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
} from "lucide-react";

// ============================================================
// Icon lookup — maps an amenity's `icon` key to a lucide component.
// Falls back to a generic check icon if the key isn't found, so
// consumers can pass any string without the UI breaking.
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
// PropertyAmenities
// ============================================================
//
// Props:
//   amenities : Array<{ key: string, label: string, icon?: string }>
//               or a flat string[] of labels (icon falls back to a checkmark)
//   initialVisibleCount : number — how many show before "View all" (default 8)

export default function PropertyAmenities({ amenities = [], initialVisibleCount = 8 }) {
    const [expanded, setExpanded] = useState(false);

    const normalized = amenities.map((item) =>
        typeof item === "string" ? { key: item, label: item } : item
    );

    if (!normalized.length) return null;

    const visible = expanded ? normalized : normalized.slice(0, initialVisibleCount);
    const hasMore = normalized.length > initialVisibleCount;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-sm p-5 sm:p-6">
            <h3 className="font-display text-lg text-charcoal-deep font-medium mb-5">
                Amenities & Features
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {visible.map((item, i) => {
                    const Icon = ICON_MAP[item.icon || item.key] || CircleCheck;
                    return (
                        <div key={item.key + i} className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-lg bg-gold-light/25 flex items-center justify-center shrink-0">
                                <Icon size={16} className="text-gold-dark" />
                            </span>
                            <span className="text-sm text-charcoal-deep leading-snug">{item.label}</span>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gold-dark hover:text-gold mt-5 pt-5 border-t border-charcoal/5 w-full justify-center sm:w-auto sm:justify-start"
                >
                    {expanded ? "Show Less" : `View All ${normalized.length} Amenities`}
                    <ChevronDown size={15} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
            )}
        </div>
    );
}