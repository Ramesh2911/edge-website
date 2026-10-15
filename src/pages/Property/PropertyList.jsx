import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Grid,
    List,
    SlidersHorizontal,
    Search,
    MapPin,
    ChevronLeft,
    ChevronRight,
    X,
    SearchX,
    Building2,
    Home as HomeIcon,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import PropertyFilter, {
    countActiveFilters,
} from '../../components/property/PropertyFilter';
import PropertyCard from '../../components/property/PropertyCard';
import API from '../../services/api';
import propertyService from '../../services/property.service';
import { resolveImageUrl } from '../../utils/imageUrl';

// ============================================================
// Helpers
// ============================================================

const PLACEHOLDER =
    'https://placehold.co/640x480/EFE9DD/A38F71?text=No+Image';

// Guard against dirty area-unit values stored in the DB (e.g. a stray number).
const isValidAreaUnit = (u) =>
    /^(sq\.?\s?ft|sq\.?\s?m|sq\.?\s?yard|acres?|hectare|marla|guntha|cent)/i.test(
        String(u || '').trim()
    );

// Raw DB row → camelCase shape expected by PropertyCard.
const toCard = (r) => ({
    id: r.id,
    images: (Array.isArray(r.images) && r.images.length ? r.images : [PLACEHOLDER]).map(
        resolveImageUrl
    ),
    title: r.property_title,
    propertyType: r.property_type,
    listingType: (r.property_for || 'Sale') === 'Rent' ? 'Rent' : 'Sale',
    price: parseFloat(r.price || 0),
    priceUnit: 'mo',
    address:
        [r.address, r.city].filter(Boolean).join(', ') ||
        [r.city, r.state].filter(Boolean).join(', '),
    area: r.area != null ? parseFloat(r.area) : null,
    areaUnit: isValidAreaUnit(r.area_unit) ? r.area_unit : 'sq.ft',
    bedrooms: r.bedroom ?? null,
    bathrooms: r.bathroom ?? null,
    parking: r.parking ?? null,
    featured: r.featured === 1 || r.featured === true,
    verified: r.property_status === 'Approved',
    postedBy: { role: 'Owner', name: '' },
});

// URL searchParams → filter object (source of truth = URL).
// Aliases (city/purpose/type/search) are honoured so external nav links work.
const filtersFromParams = (sp) => ({
    location: sp.get('location') || sp.get('city') || '',
    listingType: sp.get('listingType') || sp.get('purpose') || '',
    propertyTypes: (sp.get('propertyTypes') || sp.get('type') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    bedrooms: (sp.get('bedrooms') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    minPrice: sp.get('minPrice') || '',
    maxPrice: sp.get('maxPrice') || '',
    minArea: sp.get('minArea') || '',
    maxArea: sp.get('maxArea') || '',
    sort: sp.get('sort') || 'relevance',
});

// Filter object → URL searchParams (only non-defaults are written).
const paramsFromFilters = (f, page = 1) => {
    const p = new URLSearchParams();
    if (f.keyword) p.set('keyword', f.keyword);
    if (f.location) p.set('location', f.location);
    if (f.listingType) p.set('listingType', f.listingType);
    if (f.propertyTypes?.length) p.set('propertyTypes', f.propertyTypes.join(','));
    if (f.bedrooms?.length) p.set('bedrooms', f.bedrooms.join(','));
    if (f.minPrice) p.set('minPrice', f.minPrice);
    if (f.maxPrice) p.set('maxPrice', f.maxPrice);
    if (f.minArea) p.set('minArea', f.minArea);
    if (f.maxArea) p.set('maxArea', f.maxArea);
    if (f.sort && f.sort !== 'relevance') p.set('sort', f.sort);
    if (page > 1) p.set('page', String(page));
    return p;
};

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'area_high', label: 'Area: Largest First' },
];

// ============================================================
// Skeleton
// ============================================================

function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 animate-pulse">
            <div className="aspect-[4/3] bg-stone/15" />
            <div className="p-5 space-y-3">
                <div className="h-4 w-24 bg-stone/15 rounded-full" />
                <div className="h-5 w-3/4 bg-stone/15 rounded-full" />
                <div className="h-4 w-1/2 bg-stone/15 rounded-full" />
                <div className="h-9 w-full bg-stone/15 rounded-xl mt-4" />
            </div>
        </div>
    );
}

// ============================================================
// Pagination
// ============================================================

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const push = (n) => pages.push(n);
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) push(i);
    } else {
        push(1);
        if (page > 3) push('…');
        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(totalPages - 1, page + 1);
            i++
        )
            push(i);
        if (page < totalPages - 2) push('…');
        push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-1.5 pt-8 flex-wrap">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-charcoal/10 bg-white text-sm font-semibold text-charcoal-soft hover:border-gold hover:text-gold-dark disabled:opacity-40 disabled:hover:border-charcoal/10 disabled:hover:text-charcoal-soft transition-colors"
            >
                <ChevronLeft size={15} />
                Prev
            </button>

            {pages.map((p, i) =>
                p === '…' ? (
                    <span key={`e${i}`} className="px-2 text-stone">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-semibold transition-all ${
                            p === page
                                ? 'bg-charcoal-deep text-cream shadow-card'
                                : 'border border-charcoal/10 bg-white text-charcoal-soft hover:border-gold hover:text-gold-dark'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-charcoal/10 bg-white text-sm font-semibold text-charcoal-soft hover:border-gold hover:text-gold-dark disabled:opacity-40 disabled:hover:border-charcoal/10 disabled:hover:text-charcoal-soft transition-colors"
            >
                Next
                <ChevronRight size={15} />
            </button>
        </div>
    );
}

// ============================================================
// PropertyList
// ============================================================

export default function PropertyList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 9 });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [typeOptions, setTypeOptions] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [compareList, setCompareList] = useState([]);
    const [keywordDraft, setKeywordDraft] = useState('');

    // Filters are DERIVED from the URL, so they stay in sync with the address
    // bar, browser back/forward, and externally shared links.
    const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const activeCount = countActiveFilters(filters) + (filters.sort !== 'relevance' ? 1 : 0);

    // Keep the keyword input in sync with the URL.
    useEffect(() => {
        setKeywordDraft(searchParams.get('keyword') || searchParams.get('search') || '');
    }, [searchParams]);

    // Load property-type chips once.
    useEffect(() => {
        let alive = true;
        propertyService
            .getCategories()
            .then((res) => {
                if (!alive) return;
                const rows = res?.data?.data || [];
                setTypeOptions(rows.map((c) => c.category_name).filter(Boolean));
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, []);

    // Fetch listings whenever the URL changes.
    useEffect(() => {
        let alive = true;
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const qs = searchParams.toString();
                const { data } = await API.get(`/properties${qs ? `?${qs}` : ''}`);
                if (!alive) return;
                setProperties((data.listings || []).map(toCard));
                setMeta({
                    total: data.total ?? 0,
                    page: data.page ?? 1,
                    totalPages: data.totalPages ?? 1,
                    limit: data.limit ?? 9,
                });
            } catch (error) {
                console.error('Failed to load properties:', error);
                if (!alive) return;
                setProperties([]);
                setMeta({ total: 0, page: 1, totalPages: 1, limit: 9 });
            } finally {
                if (alive) setLoading(false);
            }
        };
        fetchProperties();
        return () => {
            alive = false;
        };
    }, [searchParams]);

    // ---- URL writers (filters change → reset to page 1) ----
    const applyFilters = useCallback(
        (next) => {
            setSearchParams(paramsFromFilters(next, 1));
        },
        [setSearchParams]
    );

    const handleFilterChange = useCallback(
        (nextFilters) => applyFilters({ ...nextFilters, keyword: keywordDraft }),
        [applyFilters, keywordDraft]
    );

    const handleReset = useCallback(() => {
        setSearchParams(new URLSearchParams());
    }, [setSearchParams]);

    const handleSortChange = (value) =>
        applyFilters({ ...filters, keyword: keywordDraft, sort: value });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ ...filters, keyword: keywordDraft });
    };

    const handlePageChange = (newPage) => {
        const p = paramsFromFilters({ ...filters, keyword: keywordDraft }, newPage);
        setSearchParams(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ---- Card action handlers ----
    const handleViewDetails = (id) => navigate(`/properties/details/${id}`);

    const handleToggleWishlist = async (id) => {
        const has = wishlist.includes(id);
        setWishlist((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]));
        try {
            if (has) await propertyService.removeWishlist(id);
            else await propertyService.addWishlist(id);
        } catch {
            /* not signed in or API offline — keep optimistic UI + toast */
        }
        toast.success(has ? 'Removed from wishlist' : 'Saved to wishlist');
    };

    const handleToggleCompare = (id) => {
        setCompareList((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            if (prev.length >= 3) {
                toast.error('You can compare up to 3 properties');
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleShare = (property) => {
        const url = `${window.location.origin}/properties/details/${property.id}`;
        navigator.clipboard?.writeText(url);
        toast.success('Link copied to clipboard');
    };

    const handleContactOwner = (property) => navigate(`/properties/details/${property.id}`);

    // ---- Derived display values ----
    const startIdx = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const endIdx = Math.min(meta.page * meta.limit, meta.total);

    // Active filter chips for the removable summary row.
    const chips = [];
    if (filters.keyword || searchParams.get('keyword') || searchParams.get('search'))
        chips.push({
            key: 'keyword',
            label: `“${keywordDraft}”`,
            onRemove: () => applyFilters({ ...filters, keyword: '' }),
        });
    if (filters.location)
        chips.push({
            key: 'location',
            label: filters.location,
            onRemove: () => applyFilters({ ...filters, location: '' }),
        });
    if (filters.listingType)
        chips.push({
            key: 'listingType',
            label: filters.listingType === 'Rent' ? 'For Rent' : 'For Buy',
            onRemove: () => applyFilters({ ...filters, listingType: '' }),
        });
    filters.propertyTypes.forEach((t) =>
        chips.push({
            key: `pt-${t}`,
            label: t,
            onRemove: () =>
                applyFilters({
                    ...filters,
                    propertyTypes: filters.propertyTypes.filter((x) => x !== t),
                }),
        })
    );
    filters.bedrooms.forEach((b) =>
        chips.push({
            key: `bd-${b}`,
            label: b === '4+' ? '4+ Beds' : `${b} Bed`,
            onRemove: () =>
                applyFilters({ ...filters, bedrooms: filters.bedrooms.filter((x) => x !== b) }),
        })
    );
    if (filters.minPrice || filters.maxPrice)
        chips.push({
            key: 'price',
            label: `₹${filters.minPrice || '0'} – ₹${filters.maxPrice || 'any'}`,
            onRemove: () => applyFilters({ ...filters, minPrice: '', maxPrice: '' }),
        });
    if (filters.minArea || filters.maxArea)
        chips.push({
            key: 'area',
            label: `${filters.minArea || '0'} – ${filters.maxArea || 'any'} sq.ft`,
            onRemove: () => applyFilters({ ...filters, minArea: '', maxArea: '' }),
        });

    const filterPanel = (isMobile) => (
        <PropertyFilter
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            onApply={isMobile ? () => setIsMobileFilterOpen(false) : undefined}
            typeOptions={typeOptions}
            resultsCount={meta.total}
        />
    );

    return (
        <>
            <SEO
                title="Browse Premium Properties | Edge Mile Realty"
                description="Explore verified residential and commercial properties. Filter by location, price, bedrooms and more."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-cream pb-20">
                {/* ================= Hero banner ================= */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#153964] via-[#1E4C8C] to-[#33425C] text-white">
                    <div
                        className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#7CB93D]/20 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="absolute -bottom-28 -left-16 w-80 h-80 rounded-full bg-white/5 blur-3xl"
                        aria-hidden
                    />

                    <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-14 sm:pt-16 sm:pb-20 text-center">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#9FD65F] bg-white/10 border border-white/15 backdrop-blur px-3 py-1 rounded-full">
                            <Building2 size={12} />
                            Verified Listings
                        </span>
                        <h1 className="font-display text-3xl sm:text-5xl font-medium mt-4 leading-tight">
                            Find Your Perfect Property
                        </h1>
                        <p className="text-white/70 mt-3 text-sm sm:text-base max-w-xl mx-auto">
                            Browse handpicked homes, plots and commercial spaces
                            filtered exactly the way you like.
                        </p>

                        {/* Search bar */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mt-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lift p-2 flex flex-col sm:flex-row gap-2"
                        >
                            <div className="relative flex-1">
                                <Search
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone"
                                />
                                <input
                                    type="text"
                                    value={keywordDraft}
                                    onChange={(e) => setKeywordDraft(e.target.value)}
                                    placeholder="Search by title, locality or project…"
                                    className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-3 text-sm text-charcoal-deep placeholder:text-stone/70 focus:outline-none"
                                />
                            </div>
                            <div className="hidden sm:block w-px bg-charcoal/10 my-1.5" />
                            <div className="relative flex-1">
                                <MapPin
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone"
                                />
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) =>
                                        handleFilterChange({ ...filters, location: e.target.value })
                                    }
                                    placeholder="City or locality"
                                    className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-3 text-sm text-charcoal-deep placeholder:text-stone/70 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#7CB93D] hover:bg-[#6FA82C] text-white font-semibold text-sm rounded-xl px-7 py-3 transition-colors shrink-0"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </section>

                {/* ================= Body ================= */}
                <div className="max-w-7xl mx-auto px-5 lg:px-8 -mt-6">
                    <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
                        {/* Sidebar (desktop) */}
                        <aside className="hidden lg:block lg:sticky lg:top-24">
                            {filterPanel(false)}
                        </aside>

                        {/* Main */}
                        <main className="pt-8 lg:pt-0 space-y-6">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-charcoal/5 shadow-card px-4 sm:px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsMobileFilterOpen(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-charcoal/12 rounded-xl text-sm font-semibold text-charcoal-soft hover:border-gold transition-colors"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                        {activeCount > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center">
                                                {activeCount}
                                            </span>
                                        )}
                                    </button>

                                    <p className="text-sm text-stone">
                                        {loading ? (
                                            'Loading…'
                                        ) : (
                                            <>
                                                Showing{' '}
                                                <span className="font-bold text-charcoal-deep">
                                                    {startIdx}–{endIdx}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-bold text-charcoal-deep">
                                                    {meta.total}
                                                </span>{' '}
                                                properties
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    {/* Sort */}
                                    <div className="relative">
                                        <select
                                            value={filters.sort}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            className="appearance-none bg-cream-deep/60 border border-charcoal/10 rounded-xl pl-3.5 pr-9 py-2 text-sm font-semibold text-charcoal-soft hover:border-gold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all cursor-pointer"
                                        >
                                            {SORT_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight
                                            size={14}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-stone pointer-events-none"
                                        />
                                    </div>

                                    {/* View toggle */}
                                    <div className="flex items-center gap-1 border border-charcoal/10 p-1 rounded-xl bg-cream-deep/40">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            aria-label="Grid view"
                                            className={`p-2 rounded-lg transition-colors ${
                                                viewMode === 'grid'
                                                    ? 'bg-white text-gold-dark shadow-sm'
                                                    : 'text-stone hover:text-charcoal-soft'
                                            }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            aria-label="List view"
                                            className={`p-2 rounded-lg transition-colors ${
                                                viewMode === 'list'
                                                    ? 'bg-white text-gold-dark shadow-sm'
                                                    : 'text-stone hover:text-charcoal-soft'
                                            }`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active filter chips */}
                            {chips.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    {chips.map((chip) => (
                                        <button
                                            key={chip.key}
                                            onClick={chip.onRemove}
                                            className="group flex items-center gap-1.5 bg-white border border-charcoal/10 hover:border-clay/50 text-charcoal-soft text-[13px] font-semibold rounded-full pl-3.5 pr-2 py-1.5 transition-colors"
                                        >
                                            {chip.label}
                                            <X size={13} className="text-stone group-hover:text-clay" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleReset}
                                        className="text-[13px] font-semibold text-gold-dark hover:text-gold transition-colors underline underline-offset-2"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {/* Results */}
                            {loading ? (
                                <div
                                    className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
                                            : 'grid grid-cols-1 gap-5 sm:gap-6'
                                    }
                                >
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <CardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-2xl border border-dashed border-charcoal/15">
                                    <span className="w-16 h-16 rounded-full bg-cream-deep flex items-center justify-center mb-5">
                                        <SearchX size={28} className="text-stone" />
                                    </span>
                                    <p className="font-display text-xl text-charcoal-deep font-medium">
                                        No properties match your filters
                                    </p>
                                    <p className="text-sm text-stone mt-2 max-w-sm">
                                        Try broadening your search or clearing some filters to
                                        see more listings.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="mt-6 bg-charcoal-deep hover:bg-charcoal text-cream text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
                                            : 'grid grid-cols-1 gap-5 sm:gap-6'
                                    }
                                >
                                    {properties.map((property) => (
                                        <PropertyCard
                                            key={property.id}
                                            property={property}
                                            isWishlisted={wishlist.includes(property.id)}
                                            isCompared={compareList.includes(property.id)}
                                            onToggleWishlist={handleToggleWishlist}
                                            onToggleCompare={handleToggleCompare}
                                            onViewDetails={handleViewDetails}
                                            onContactOwner={handleContactOwner}
                                            onShare={handleShare}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && properties.length > 0 && (
                                <Pagination
                                    page={meta.page}
                                    totalPages={meta.totalPages}
                                    onChange={handlePageChange}
                                />
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* ================= Mobile filter drawer ================= */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="flex-1 bg-charcoal-deep/60 backdrop-blur-sm"
                        onClick={() => setIsMobileFilterOpen(false)}
                    />
                    <div className="relative ml-auto w-full max-w-sm h-full bg-cream shadow-2xl overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/8 bg-white sticky top-0 z-10">
                            <h2 className="font-display text-lg text-charcoal-deep font-medium">
                                Refine Search
                            </h2>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                aria-label="Close filters"
                                className="w-9 h-9 rounded-full bg-cream-deep flex items-center justify-center text-charcoal-soft hover:bg-gold-pale transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4">{filterPanel(true)}</div>
                    </div>
                </div>
            )}
        </>
    );
}
