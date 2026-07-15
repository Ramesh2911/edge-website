import { useState } from "react";
import {
    Ruler,
    BedDouble,
    Bath,
    Car,
    Compass,
    Building2,
    CalendarClock,
    Sofa,
    ChevronDown,
} from "lucide-react";

// ============================================================
// PropertyOverview
// ============================================================
//
// Props:
//   overview     : {
//     area, areaUnit, bedrooms, bathrooms, parking,
//     facing, floor, totalFloors, propertyAge, furnishing, propertyType
//   }
//   description  : string — full property description
//   descriptionLimit : number — characters shown before "Read more" (default 260)

export default function PropertyOverview({ overview = {}, description = "", descriptionLimit = 260 }) {
    const [expanded, setExpanded] = useState(false);

    const {
        area,
        areaUnit = "sq.ft",
        bedrooms,
        bathrooms,
        parking,
        facing,
        floor,
        totalFloors,
        propertyAge,
        furnishing,
        propertyType,
    } = overview;

    const stats = [
        { icon: Ruler, label: "Area", value: area != null ? `${area.toLocaleString("en-IN")} ${areaUnit}` : null },
        { icon: BedDouble, label: "Bedrooms", value: bedrooms },
        { icon: Bath, label: "Bathrooms", value: bathrooms },
        { icon: Car, label: "Parking", value: parking },
        { icon: Building2, label: "Property Type", value: propertyType },
        {
            icon: Building2,
            label: "Floor",
            value: floor != null ? `${floor}${totalFloors ? ` of ${totalFloors}` : ""}` : null,
        },
        { icon: Compass, label: "Facing", value: facing },
        { icon: Sofa, label: "Furnishing", value: furnishing },
        { icon: CalendarClock, label: "Property Age", value: propertyAge },
    ].filter((s) => s.value !== null && s.value !== undefined && s.value !== "");

    const shouldTruncate = description.length > descriptionLimit;
    const shownDescription =
        !expanded && shouldTruncate ? `${description.slice(0, descriptionLimit).trim()}…` : description;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-sm p-5 sm:p-6">
            <h3 className="font-display text-lg text-charcoal-deep font-medium mb-5">Overview</h3>

            {/* Stats grid */}
            {stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-charcoal/5">
                    {stats.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-2.5">
                            <span className="w-9 h-9 rounded-lg bg-gold-light/25 flex items-center justify-center shrink-0">
                                <Icon size={16} className="text-gold-dark" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs text-stone">{label}</p>
                                <p className="text-sm font-semibold text-charcoal-deep truncate">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Description */}
            {description && (
                <div>
                    <p className="text-sm text-charcoal-deep/85 leading-relaxed whitespace-pre-line">
                        {shownDescription}
                    </p>
                    {shouldTruncate && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="flex items-center gap-1 text-sm font-semibold text-gold-dark hover:text-gold mt-3"
                        >
                            {expanded ? "Read Less" : "Read More"}
                            <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}