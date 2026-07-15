import { useState } from "react";
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    MapPin,
} from "lucide-react";

// ============================================================
// Static option sets — adjust to match your data
// ============================================================

const PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "Independent House", "Office", "Shop"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4+"];
const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "area_high", label: "Area: Largest First" },
];

const DEFAULT_FILTERS = {
    location: "",
    listingType: "Sale",
    propertyTypes: [],
    bedrooms: [],
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    sort: "relevance",
};

// ============================================================
// PropertyFilter
// ============================================================
//
// Props:
//   filters       : object — current filter state (falls back to DEFAULT_FILTERS)
//   onChange      : (nextFilters) => void — called on every field change
//   onApply       : () => void — called when "Apply Filters" / mobile "Show Results" is pressed
//   onReset       : () => void — called when "Clear All" is pressed
//   resultsCount  : number — shown in the mobile drawer's submit button

export default function PropertyFilter({
    filters = DEFAULT_FILTERS,
    onChange,
    onApply,
    onReset,
    resultsCount,
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [morePanelOpen, setMorePanelOpen] = useState(false);

    const update = (patch) => onChange?.({ ...filters, ...patch });

    const toggleInArray = (key, value) => {
        const current = filters[key] || [];
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        update({ [key]: next });
    };

    const activeCount =
        (filters.propertyTypes?.length || 0) +
        (filters.bedrooms?.length || 0) +
        (filters.minPrice ? 1 : 0) +
        (filters.maxPrice ? 1 : 0) +
        (filters.minArea ? 1 : 0) +
        (filters.maxArea ? 1 : 0);

    // --------------------------------------------------------
    // Shared filter fields (rendered in both desktop panel & mobile drawer)
    // --------------------------------------------------------
    const FilterFields = () => (
        <div className="space-y-6">
            {/* Property Type */}
            <div>
                <p className="text-sm font-semibold text-charcoal-deep mb-2.5">Property Type</p>
                <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggleInArray("propertyTypes", type)}
                            className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${filters.propertyTypes?.includes(type)
                                    ? "bg-gold text-white border-gold"
                                    : "bg-white text-charcoal-deep border-charcoal/10 hover:border-gold"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bedrooms */}
            <div>
                <p className="text-sm font-semibold text-charcoal-deep mb-2.5">Bedrooms</p>
                <div className="flex flex-wrap gap-2">
                    {BEDROOM_OPTIONS.map((bhk) => (
                        <button
                            key={bhk}
                            type="button"
                            onClick={() => toggleInArray("bedrooms", bhk)}
                            className={`text-xs font-medium px-3.5 py-2 rounded-lg border transition-colors ${filters.bedrooms?.includes(bhk)
                                    ? "bg-gold text-white border-gold"
                                    : "bg-white text-charcoal-deep border-charcoal/10 hover:border-gold"
                                }`}
                        >
                            {bhk} BHK
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <p className="text-sm font-semibold text-charcoal-deep mb-2.5">Price Range (₹)</p>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.minPrice}
                        onChange={(e) => update({ minPrice: e.target.value })}
                        placeholder="Min"
                        className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <span className="text-stone text-sm">–</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.maxPrice}
                        onChange={(e) => update({ maxPrice: e.target.value })}
                        placeholder="Max"
                        className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                </div>
            </div>

            {/* Area Range */}
            <div>
                <p className="text-sm font-semibold text-charcoal-deep mb-2.5">Area (Sq.ft)</p>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.minArea}
                        onChange={(e) => update({ minArea: e.target.value })}
                        placeholder="Min"
                        className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <span className="text-stone text-sm">–</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.maxArea}
                        onChange={(e) => update({ maxArea: e.target.value })}
                        placeholder="Max"
                        className="w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-sm">
            {/* ================= Top bar: search + listing type + sort ================= */}
            <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Location search */}
                <div className="relative flex-1">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => update({ location: e.target.value })}
                        placeholder="Search by city, locality or project"
                        className="w-full bg-cream-deep border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:bg-white"
                    />
                </div>

                {/* Sale / Rent toggle */}
                <div className="flex bg-cream-deep rounded-xl p-1 shrink-0">
                    {["Sale", "Rent"].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => update({ listingType: type })}
                            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${filters.listingType === type
                                    ? "bg-charcoal-deep text-cream"
                                    : "text-charcoal-deep/70 hover:text-charcoal-deep"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Desktop: more filters toggle */}
                <button
                    type="button"
                    onClick={() => setMorePanelOpen((v) => !v)}
                    className="hidden lg:flex items-center gap-2 border border-charcoal/10 hover:border-gold rounded-xl px-4 py-3 text-sm font-semibold text-charcoal-deep shrink-0"
                >
                    <SlidersHorizontal size={15} />
                    Filters
                    {activeCount > 0 && (
                        <span className="bg-gold text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                    <ChevronDown size={14} className={`transition-transform ${morePanelOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mobile: filters button */}
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="lg:hidden flex items-center justify-center gap-2 bg-cream-deep rounded-xl px-4 py-3 text-sm font-semibold text-charcoal-deep shrink-0"
                >
                    <SlidersHorizontal size={15} />
                    Filters
                    {activeCount > 0 && (
                        <span className="bg-gold text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </button>

                {/* Sort — desktop only inline, mobile could live in a separate control */}
                <div className="hidden sm:block relative shrink-0">
                    <select
                        value={filters.sort}
                        onChange={(e) => update({ sort: e.target.value })}
                        className="appearance-none bg-cream-deep border border-transparent rounded-xl pl-4 pr-9 py-3 text-sm font-medium text-charcoal-deep focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone pointer-events-none" />
                </div>
            </div>

            {/* ================= Desktop expandable panel ================= */}
            {morePanelOpen && (
                <div className="hidden lg:block border-t border-charcoal/5 p-5">
                    <FilterFields />
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-charcoal/5">
                        <button
                            type="button"
                            onClick={onReset}
                            className="text-sm font-semibold text-stone hover:text-charcoal-deep"
                        >
                            Clear All
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onApply?.();
                                setMorePanelOpen(false);
                            }}
                            className="bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* ================= Mobile drawer ================= */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-charcoal-deep/50"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/5 shrink-0">
                            <h3 className="font-display text-lg text-charcoal-deep font-medium">Filters</h3>
                            <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                                <X size={20} className="text-charcoal-deep" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto">
                            {/* Sort — mobile */}
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-charcoal-deep mb-2.5">Sort By</p>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => update({ sort: e.target.value })}
                                    className="w-full bg-cream-deep border border-transparent rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <FilterFields />
                        </div>

                        <div className="p-5 border-t border-charcoal/5 flex items-center gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={onReset}
                                className="text-sm font-semibold text-stone px-4"
                            >
                                Clear All
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onApply?.();
                                    setDrawerOpen(false);
                                }}
                                className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl py-3 transition-colors"
                            >
                                Show {resultsCount != null ? resultsCount : ""} Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}