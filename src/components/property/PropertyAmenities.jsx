import { useState } from "react";
import {
    Wifi,
    Car,
    Dumbbell,
    Waves,
    ShieldCheck,
    TreePine,
    Zap,
    Wind,
    Sofa,
    Baby,
    Dog,
    Flame,
    Camera,
    Droplets,
    Users,
    Sparkles,
    ChevronDown,
    CircleCheck,
    LayoutGrid,
} from "lucide-react";

// ============================================================
// Icon lookup — maps an amenity's `icon` key to a lucide component.
// Falls back to a generic check icon so any string is safe to pass.
// ============================================================

const ICON_MAP = {
    wifi: Wifi,
    parking: Car,
    gym: Dumbbell,
    pool: Waves,
    security: ShieldCheck,
    garden: TreePine,
    power_backup: Zap,
    ac: Wind,
    furnished: Sofa,
    kids_area: Baby,
    pet_friendly: Dog,
    gas_pipeline: Flame,
    cctv: Camera,
    water_supply: Droplets,
    clubhouse: Users,
    housekeeping: Sparkles,
};

// ============================================================
// PropertyAmenities — premium amenity pills
// ============================================================
//
// Props:
//   amenities : Array<{ key, label, icon? }> or flat string[]
//   initialVisibleCount : number (default 8)

export default function PropertyAmenities({
    amenities = [],
    initialVisibleCount = 8,
}) {
    const [expanded, setExpanded] = useState(false);

    const normalized = amenities.map((item) =>
        typeof item === "string" ? { key: item, label: item } : item
    );

    if (!normalized.length) return null;

    const visible = expanded ? normalized : normalized.slice(0, initialVisibleCount);
    const hasMore = normalized.length > initialVisibleCount;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-card p-5 sm:p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-light/60 to-gold-light/20 flex items-center justify-center">
                        <LayoutGrid size={16} className="text-gold-dark" />
                    </span>
                    <h3 className="font-display text-xl text-charcoal-deep font-medium">
                        Amenities & Features
                    </h3>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gold-dark bg-gold-pale/60 px-2.5 py-1 rounded-full">
                    {normalized.length}
                </span>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2.5">
                {visible.map((item, i) => {
                    const Icon = ICON_MAP[item.icon || item.key] || CircleCheck;
                    return (
                        <span
                            key={item.key + i}
                            className="group flex items-center gap-2 bg-cream-deep/70 hover:bg-gold-pale/60 border border-charcoal/6 hover:border-gold/40 text-charcoal-deep text-sm font-medium pl-2 pr-4 py-2 rounded-full transition-all"
                        >
                            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <Icon size={14} className="text-gold-dark" />
                            </span>
                            {item.label}
                        </span>
                    );
                })}
            </div>

            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gold-dark hover:text-gold mt-5 pt-5 border-t border-charcoal/8 w-full justify-center sm:w-auto sm:justify-start transition-colors"
                >
                    {expanded ? "Show Less" : `View All ${normalized.length} Amenities`}
                    <ChevronDown
                        size={15}
                        className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                </button>
            )}
        </div>
    );
}
