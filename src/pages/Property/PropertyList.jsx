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
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import PropertyFilter, {
    countActiveFilters,
} from '../../components/property/PropertyFilter';
import PropertyCard from '../../components/property/PropertyCard';
import API from '../../services/api';
import propertyService from '../../services/property.service';
import { useWishlist } from '../../context/WishlistContext';
import { resolveImageUrl } from '../../utils/imageUrl';

// ============================================================
// Helpers
// ============================================================

const PLACEHOLDER =
    'https://placehold.co/640x480/EFE9DD/A38F71?text=No+Image';

// Guard against dirty area-unit values stored in the DB (e.g. a stray number).
const isValidAreaUnit = (u) =>
    /^(sq\.?\s?ft|sq\.?\s?m|sq\.?\s?yard|acres?|hectare|marla|guntha|cent|katha|bigha)/i.test(
        String(u || '').trim()
    );

const fmtArea = (a) => {
    if (a == null || a === '') return null;
    const s = String(a).trim();
    const n = Number(s);
    return Number.isFinite(n) && s !== '' && !/[^\d.]/.test(s)
        ? n.toLocaleString('en-IN')
        : s;
};

// Raw DB row → camelCase shape expected by PropertyCard.
const toCard = (r) => ({
    id: r.id,
    images: (Array.isArray(r.images) && r.images.length ? r.images : [PLACEHOLDER]).map(
        resolveImageUrl
    ),
    title: r.property_title,
    propertyType: r.property_type,
    listingType: (r.property_for || 'Sale') === 'Rent' ? 'Rent' : 'Sale',
    price: r.price,
    priceUnit: 'mo',
    address:
        [r.address, r.city].filter(Boolean).join(', ') ||
        [r.city, r.state].filter(Boolean).join(', '),
    area: fmtArea(r.area),
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
    keyword: sp.get('keyword') || sp.get('search') || '',
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
        <div className="flex items-center justify-center gap-1.5 pt-10 flex-wrap">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="group flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E4C8C]/10 bg-white text-sm font-semibold text-[#1E4C8C] hover:border-[#7CB93D] hover:text-[#6FA82C] hover:shadow-[0_4px_16px_-4px_rgba(124,185,61,0.35)] disabled:opacity-35 disabled:hover:border-[#1E4C8C]/10 disabled:hover:text-[#1E4C8C] disabled:hover:shadow-none transition-all"
            >
                <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
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
                        className={`min-w-[42px] h-11 rounded-xl text-sm font-bold transition-all ${
                            p === page
                                ? 'bg-gradient-to-br from-[#153964] to-[#1E4C8C] text-white shadow-[0_8px_20px_-6px_rgba(21,57,100,0.45)] scale-105'
                                : 'border border-[#1E4C8C]/10 bg-white text-[#1E4C8C]/75 hover:border-[#7CB93D] hover:text-[#6FA82C] hover:shadow-[0_4px_14px_-4px_rgba(124,185,61,0.3)]'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className="group flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E4C8C]/10 bg-white text-sm font-semibold text-[#1E4C8C] hover:border-[#7CB93D] hover:text-[#6FA82C] hover:shadow-[0_4px_16px_-4px_rgba(124,185,61,0.35)] disabled:opacity-35 disabled:hover:border-[#1E4C8C]/10 disabled:hover:text-[#1E4C8C] disabled:hover:shadow-none transition-all"
            >
                Next
                <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
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
    const { isWishlisted, toggle: toggleWishlist } = useWishlist();

    const [properties, setProperties] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 9 });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [typeOptions, setTypeOptions] = useState([]);
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

            <div className="min-h-screen bg-[#F7FAFC] pb-24">
                <style>{`
                    @keyframes plFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
                    .pl-fade { animation: plFadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
                    .pl-delay-1 { animation-delay: 80ms; }
                    .pl-delay-2 { animation-delay: 160ms; }
                    .pl-delay-3 { animation-delay: 240ms; }
                    @keyframes plShimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
                    .pl-skel { background: linear-gradient(90deg,#EAF1FB 25%,#F4F8FE 50%,#EAF1FB 75%); background-size: 800px 100%; animation: plShimmer 1.3s ease-in-out infinite; }
                `}</style>

                {/* ================= Hero ================= */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#0F2D52] via-[#153964] via-45% to-[#1E4C8C] text-white">
                    {/* Decorative orbs */}
                    <div className="absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full bg-[#7CB93D]/25 blur-[100px]" aria-hidden />
                    <div className="absolute -bottom-40 -left-24 w-[460px] h-[460px] rounded-full bg-[#33425C]/60 blur-[110px]" aria-hidden />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.04] blur-2xl" aria-hidden />
                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
                            backgroundSize: '28px 28px',
                        }}
                        aria-hidden
                    />
                    {/* Gold hairline */}
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#7CB93D]/60 to-transparent" aria-hidden />

                    <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24 text-center">
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[#B8F07A] bg-white/[0.08] border border-white/15 backdrop-blur-md px-4 py-1.5 rounded-full pl-fade">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7CB93D] animate-pulse" />
                            Verified Listings
                            <span className="w-px h-3 bg-white/20" />
                            <span className="text-white/70">{meta.total > 0 ? `${meta.total}+` : 'Live'} Properties</span>
                        </span>

                        <h1 className="font-display text-[2rem] sm:text-5xl lg:text-[3.4rem] font-medium mt-6 leading-[1.12] tracking-tight pl-fade pl-delay-1">
                            Find Your{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-[#B8F07A] via-[#7CB93D] to-[#9FD65F] bg-clip-text text-transparent font-semibold">
                                    Perfect Property
                                </span>
                            </span>
                        </h1>
                        <p className="text-white/65 mt-4 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed pl-fade pl-delay-1">
                            Handpicked homes, plots & commercial spaces — filtered exactly
                            the way you like, verified end to end.
                        </p>

                        {/* Search bar */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="mt-10 max-w-3xl mx-auto bg-white/[0.07] backdrop-blur-xl border border-white/20 rounded-[20px] p-2 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45)] flex flex-col sm:flex-row gap-2 pl-fade pl-delay-2 hover:bg-white/[0.1] transition-colors"
                        >
                            <div className="relative flex-1">
                                <Search
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7CB93D]"
                                />
                                <input
                                    type="text"
                                    value={keywordDraft}
                                    onChange={(e) => setKeywordDraft(e.target.value)}
                                    placeholder="Search by title, locality or project…"
                                    className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/45 focus:outline-none"
                                />
                            </div>
                            <div className="hidden sm:block w-px bg-white/15 my-2" />
                            <div className="relative flex-1">
                                <MapPin
                                    size={17}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7CB93D]"
                                />
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) =>
                                        handleFilterChange({ ...filters, location: e.target.value })
                                    }
                                    placeholder="City or locality"
                                    className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/45 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#7CB93D] to-[#6FA82C] hover:from-[#6FA82C] hover:to-[#5F9424] text-white font-bold text-sm rounded-xl px-8 py-3.5 transition-all shadow-[0_8px_24px_-6px_rgba(124,185,61,0.55)] shrink-0 active:scale-[0.98]"
                            >
                                Search
                            </button>
                        </form>

                        {/* Trust strip */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12px] font-semibold text-white/55 pl-fade pl-delay-3">
                            {[
                                { icon: '✓', label: '100% Verified' },
                                { icon: '⚡', label: 'Zero Brokerage' },
                                { icon: '★', label: 'Premium Support' },
                                { icon: '⌂', label: 'All Property Types' },
                            ].map((t) => (
                                <span key={t.label} className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#B8F07A] text-[10px]">
                                        {t.icon}
                                    </span>
                                    {t.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= Body ================= */}
                <div className="max-w-7xl mx-auto px-5 lg:px-8 -mt-7">
                    <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
                        {/* Sidebar (desktop) */}
                        <aside className="hidden lg:block lg:sticky lg:top-24 pl-fade pl-delay-1">
                            {filterPanel(false)}
                        </aside>

                        {/* Main */}
                        <main className="pt-8 lg:pt-0 space-y-5">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur rounded-2xl border border-[#1E4C8C]/[0.07] shadow-[0_4px_24px_-8px_rgba(21,57,100,0.1)] px-4 sm:px-5 py-3.5 pl-fade pl-delay-1">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setIsMobileFilterOpen(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[#1E4C8C]/12 rounded-xl text-sm font-semibold text-[#1E4C8C] hover:border-[#7CB93D] hover:text-[#6FA82C] hover:shadow-[0_4px_14px_-4px_rgba(124,185,61,0.3)] transition-all"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                        {activeCount > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-[#7CB93D] text-white text-[11px] font-bold flex items-center justify-center shadow-[0_2px_8px_rgba(124,185,61,0.5)]">
                                                {activeCount}
                                            </span>
                                        )}
                                    </button>

                                    <p className="text-sm text-stone">
                                        {loading ? (
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#7CB93D] border-t-transparent animate-spin" />
                                                Loading listings…
                                            </span>
                                        ) : (
                                            <>
                                                Showing{' '}
                                                <span className="font-bold text-[#153964]">
                                                    {startIdx}–{endIdx}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-bold text-[#153964]">
                                                    {meta.total}
                                                </span>{' '}
                                                properties
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Sort */}
                                    <div className="relative group">
                                        <select
                                            value={filters.sort}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            aria-label="Sort properties"
                                            className="appearance-none bg-white border border-[#1E4C8C]/12 rounded-xl pl-3.5 pr-9 py-2.5 text-[13px] font-semibold text-[#1E4C8C] hover:border-[#7CB93D] focus:outline-none focus:border-[#7CB93D] focus:ring-2 focus:ring-[#7CB93D]/20 transition-all cursor-pointer shadow-sm"
                                        >
                                            {SORT_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight
                                            size={14}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#1E4C8C]/50 group-hover:text-[#6FA82C] pointer-events-none transition-colors"
                                        />
                                    </div>

                                    {/* View toggle */}
                                    <div className="flex items-center gap-0.5 bg-white border border-[#1E4C8C]/12 p-1 rounded-xl shadow-sm">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            aria-label="Grid view"
                                            aria-pressed={viewMode === 'grid'}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                                viewMode === 'grid'
                                                    ? 'bg-[#153964] text-white shadow-[0_3px_10px_-3px_rgba(21,57,100,0.5)]'
                                                    : 'text-[#1E4C8C]/45 hover:text-[#1E4C8C] hover:bg-[#F7FAFC]'
                                            }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            aria-label="List view"
                                            aria-pressed={viewMode === 'list'}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                                viewMode === 'list'
                                                    ? 'bg-[#153964] text-white shadow-[0_3px_10px_-3px_rgba(21,57,100,0.5)]'
                                                    : 'text-[#1E4C8C]/45 hover:text-[#1E4C8C] hover:bg-[#F7FAFC]'
                                            }`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active filter chips */}
                            {chips.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pl-fade">
                                    {chips.map((chip) => (
                                        <button
                                            key={chip.key}
                                            onClick={chip.onRemove}
                                            className="group flex items-center gap-1.5 bg-white border border-[#1E4C8C]/10 hover:border-[#A1463F]/50 hover:bg-[#A1463F]/5 text-[#1E4C8C] text-[13px] font-semibold rounded-full pl-3.5 pr-2.5 py-1.5 shadow-sm transition-all"
                                        >
                                            {chip.label}
                                            <X size={13} className="text-stone group-hover:text-[#A1463F]" />
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleReset}
                                        className="text-[13px] font-bold text-[#6FA82C] hover:text-[#153964] transition-colors"
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
                                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_-6px_rgba(21,57,100,0.08)] border border-[#1E4C8C]/[0.06] animate-pulse">
                                            <div className="aspect-[4/3] pl-skel" />
                                            <div className="p-5 space-y-3">
                                                <div className="h-4 w-24 pl-skel rounded-full" />
                                                <div className="h-5 w-3/4 pl-skel rounded-full" />
                                                <div className="h-4 w-1/2 pl-skel rounded-full" />
                                                <div className="h-9 w-full pl-skel rounded-xl mt-4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl border border-dashed border-[#1E4C8C]/15 shadow-[0_4px_24px_-8px_rgba(21,57,100,0.06)] pl-fade">
                                    <span className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EAF1FB] to-[#EAF6DE] flex items-center justify-center mb-6 shadow-inner">
                                        <SearchX size={32} className="text-[#1E4C8C]" />
                                    </span>
                                    <p className="font-display text-2xl text-[#153964] font-medium">
                                        No properties match your filters
                                    </p>
                                    <p className="text-sm text-stone mt-2.5 max-w-md leading-relaxed">
                                        Try broadening your search or clearing some filters to
                                        see more listings.
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="mt-7 bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:from-[#0F2D52] hover:to-[#153964] text-white text-sm font-bold rounded-xl px-7 py-3.5 shadow-[0_8px_24px_-6px_rgba(21,57,100,0.4)] transition-all active:scale-[0.98]"
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
                                    {properties.map((property, idx) => (
                                        <div
                                            key={property.id}
                                            className="pl-fade"
                                            style={{ animationDelay: `${Math.min(idx, 8) * 55}ms` }}
                                        >
                                            <PropertyCard
                                                property={property}
                                                isWishlisted={isWishlisted(property.id)}
                                                isCompared={compareList.includes(property.id)}
                                                onToggleWishlist={toggleWishlist}
                                                onToggleCompare={handleToggleCompare}
                                                onViewDetails={handleViewDetails}
                                                onContactOwner={handleContactOwner}
                                                onShare={handleShare}
                                                className="h-full hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(21,57,100,0.22)] hover:border-[#7CB93D]/40"
                                            />
                                        </div>
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
