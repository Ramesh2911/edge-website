import { useState } from "react";
import {
    MapPin,
    Search,
    SlidersHorizontal,
    RotateCcw,
    ChevronDown,
    Home,
    BedDouble,
} from "lucide-react";

// ============================================================
// PropertyFilter — premium controlled filter sidebar
// ============================================================
//
// Fully controlled: the parent owns the filter state (kept in sync with the
// URL) and receives every change through `onChange`, so filtering is live and
// bookmarkable / shareable.
//
// Props:
//   filters : {
//     location, listingType, propertyTypes[], bedrooms[],
//     minPrice, maxPrice, minArea, maxArea
//   }
//   onChange     : (nextFilters) => void — fired on every control change
//   onReset      : () => void             — clear all filters
//   onApply      : () => void             — optional; closes the mobile drawer
//   typeOptions  : string[]               — property type chips (from /categories)
//   resultsCount : number                 — live count for the apply button
//
// NOTE: sort is intentionally NOT here — it lives in the results toolbar.

const BEDROOM_OPTIONS = ["1", "2", "3", "4+"];
const LISTING_OPTIONS = [
    { value: "", label: "Any" },
    { value: "Sale", label: "Buy" },
    { value: "Rent", label: "Rent" },
];
const DEFAULT_TYPES = [
    "Apartment",
    "Villa",
    "House",
    "Commercial",
    "Office",
    "Shop",
    "Plot",
    "Land",
];

/** Count of active (non-default) filter facets. */
export function countActiveFilters(f = {}) {
    return (
        (f.location ? 1 : 0) +
        (f.listingType ? 1 : 0) +
        (f.propertyTypes?.length || 0) +
        (f.bedrooms?.length || 0) +
        (f.minPrice || f.maxPrice ? 1 : 0) +
        (f.minArea || f.maxArea ? 1 : 0)
    );
}

function SectionLabel({ icon: Icon, children }) {
    return (
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-stone mb-3">
            {Icon && <Icon size={13} className="text-gold-dark" />}
            {children}
        </p>
    );
}

function Chip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-all ${
                active
                    ? "bg-gold text-white border-gold shadow-sm"
                    : "bg-cream-deep/60 text-charcoal-soft border-charcoal/8 hover:border-gold/50 hover:bg-gold-pale/50"
            }`}
        >
            {children}
        </button>
    );
}

const inputCls =
    "w-full border border-charcoal/12 rounded-xl px-3.5 py-2.5 text-sm bg-cream-deep/40 placeholder:text-stone/60 focus:outline-none focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all";

export default function PropertyFilter({
    filters = {},
    onChange,
    onReset,
    onApply,
    typeOptions = DEFAULT_TYPES,
    resultsCount,
}) {
    const [typesExpanded, setTypesExpanded] = useState(false);

    const {
        location = "",
        listingType = "",
        propertyTypes = [],
        bedrooms = [],
        minPrice = "",
        maxPrice = "",
        minArea = "",
        maxArea = "",
    } = filters || {};

    const activeCount = countActiveFilters(filters);

    const patch = (partial) => onChange?.({ ...filters, ...partial });

    const toggleIn = (arr, value) =>
        arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

    const visibleTypes = typesExpanded ? typeOptions : typeOptions.slice(0, 6);

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-card overflow-hidden">
            {/* ---------- Header ---------- */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/8 bg-gradient-to-r from-gold-pale/50 to-transparent">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
                        <SlidersHorizontal size={15} className="text-gold-dark" />
                    </span>
                    <h3 className="font-display text-lg text-charcoal-deep font-medium">
                        Filters
                    </h3>
                    {activeCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs font-semibold text-gold-dark hover:text-gold transition-colors"
                    >
                        <RotateCcw size={12} />
                        Clear All
                    </button>
                )}
            </div>

            <div className="p-5 space-y-6 max-h-none lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto">
                {/* ---------- Location ---------- */}
                <div>
                    <SectionLabel icon={MapPin}>Location</SectionLabel>
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone"
                        />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => patch({ location: e.target.value })}
                            placeholder="City, locality or project"
                            className={`${inputCls} pl-9`}
                        />
                    </div>
                </div>

                {/* ---------- Listing type ---------- */}
                <div>
                    <SectionLabel icon={Home}>Looking to</SectionLabel>
                    <div className="flex bg-cream-deep/70 rounded-xl p-1 gap-1">
                        {LISTING_OPTIONS.map((opt) => (
                            <button
                                key={opt.value || "any"}
                                type="button"
                                onClick={() => patch({ listingType: opt.value })}
                                className={`flex-1 text-sm font-semibold rounded-lg py-2 transition-all ${
                                    listingType === opt.value
                                        ? "bg-white text-charcoal-deep shadow-sm"
                                        : "text-stone hover:text-charcoal-soft"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ---------- Property type ---------- */}
                {typeOptions.length > 0 && (
                    <div>
                        <SectionLabel icon={Home}>Property Type</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                            {visibleTypes.map((t) => (
                                <Chip
                                    key={t}
                                    active={propertyTypes.includes(t)}
                                    onClick={() =>
                                        patch({ propertyTypes: toggleIn(propertyTypes, t) })
                                    }
                                >
                                    {t}
                                </Chip>
                            ))}
                            {typeOptions.length > 6 && (
                                <button
                                    type="button"
                                    onClick={() => setTypesExpanded((v) => !v)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-semibold text-gold-dark hover:bg-gold-pale/50 transition-colors"
                                >
                                    {typesExpanded ? "Less" : `+${typeOptions.length - 6} more`}
                                    <ChevronDown
                                        size={13}
                                        className={`transition-transform ${typesExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ---------- Bedrooms ---------- */}
                <div>
                    <SectionLabel icon={BedDouble}>Bedrooms</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                        {BEDROOM_OPTIONS.map((b) => (
                            <Chip
                                key={b}
                                active={bedrooms.includes(b)}
                                onClick={() => patch({ bedrooms: toggleIn(bedrooms, b) })}
                            >
                                {b === "4+" ? "4+ Beds" : `${b} Bed`}
                            </Chip>
                        ))}
                    </div>
                </div>

                {/* ---------- Price range ---------- */}
                <div>
                    <SectionLabel>Price Range (₹)</SectionLabel>
                    <div className="grid grid-cols-2 gap-2.5">
                        <input
                            type="number"
                            min="0"
                            value={minPrice}
                            onChange={(e) => patch({ minPrice: e.target.value })}
                            placeholder="Min"
                            className={inputCls}
                        />
                        <input
                            type="number"
                            min="0"
                            value={maxPrice}
                            onChange={(e) => patch({ maxPrice: e.target.value })}
                            placeholder="Max"
                            className={inputCls}
                        />
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-light mt-1.5 px-0.5">
                        <span>No min</span>
                        <span>No max</span>
                    </div>
                </div>

                {/* ---------- Area range ---------- */}
                <div>
                    <SectionLabel>Built-up Area (sq.ft)</SectionLabel>
                    <div className="grid grid-cols-2 gap-2.5">
                        <input
                            type="number"
                            min="0"
                            value={minArea}
                            onChange={(e) => patch({ minArea: e.target.value })}
                            placeholder="Min"
                            className={inputCls}
                        />
                        <input
                            type="number"
                            min="0"
                            value={maxArea}
                            onChange={(e) => patch({ maxArea: e.target.value })}
                            placeholder="Max"
                            className={inputCls}
                        />
                    </div>
                </div>
            </div>

            {/* ---------- Footer (mobile apply) ---------- */}
            {onApply && (
                <div className="px-5 py-4 border-t border-charcoal/8 bg-cream-deep/40">
                    <button
                        type="button"
                        onClick={onApply}
                        className="w-full bg-charcoal-deep hover:bg-charcoal text-cream text-sm font-semibold rounded-xl py-3 transition-colors"
                    >
                        Show {resultsCount ?? 0} Results
                    </button>
                </div>
            )}
        </div>
    );
}
