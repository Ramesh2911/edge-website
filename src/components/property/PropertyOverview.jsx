import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";

// ============================================================
// PropertyOverview — "About this property" + spec table
// ============================================================
//
// Props:
//   overview : {
//     area, areaUnit, bedrooms, bathrooms, parking, balcony,
//     facing, floor, totalFloors, propertyAge, furnishing,
//     propertyType, ownership, construction_status, possession_date
//   }
//   description      : string — full property description
//   descriptionLimit : number — chars shown before "Read more" (default 320)
//
// The six headline stats (area / beds / baths / parking / type / furnishing)
// live in the hero facts bar; this card carries the narrative description
// plus the remaining detail rows in a clean definition list.

const DETAIL_ROWS = [
    { key: "propertyType", label: "Property Type" },
    { key: "floor", label: "Floor" },
    { key: "totalFloors", label: "Total Floors" },
    { key: "facing", label: "Facing" },
    { key: "furnishing", label: "Furnishing" },
    { key: "ownership", label: "Ownership" },
    { key: "construction_status", label: "Construction Status" },
    { key: "propertyAge", label: "Property Age" },
    { key: "balcony", label: "Balconies" },
    { key: "possession_date", label: "Possession" },
    { key: "area", label: "Built-up Area" },
];

export default function PropertyOverview({
    overview = {},
    description = "",
    descriptionLimit = 320,
}) {
    const [expanded, setExpanded] = useState(false);

    const rows = DETAIL_ROWS.map((r) => {
        let value = overview[r.key];
        if (r.key === "area" && value != null) {
            value = `${value.toLocaleString("en-IN")} ${overview.areaUnit || "sq.ft"}`;
        }
        if (r.key === "floor" && value != null && overview.totalFloors) {
            value = `${value} of ${overview.totalFloors}`;
        }
        return { ...r, value };
    }).filter(
        (r) =>
            r.value !== null && r.value !== undefined && r.value !== "" && r.value !== "N/A"
    );

    const shouldTruncate = description.length > descriptionLimit;
    const shown =
        !expanded && shouldTruncate
            ? `${description.slice(0, descriptionLimit).trim()}…`
            : description;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-card p-5 sm:p-7">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-light/60 to-gold-light/20 flex items-center justify-center">
                    <FileText size={16} className="text-gold-dark" />
                </span>
                <h3 className="font-display text-xl text-charcoal-deep font-medium">
                    About this Property
                </h3>
            </div>

            {/* Description */}
            {description && (
                <div className="mb-6 pb-6 border-b border-charcoal/8">
                    <p className="text-[15px] text-charcoal-soft leading-[1.75] whitespace-pre-line">
                        {shown}
                    </p>
                    {shouldTruncate && (
                        <button
                            type="button"
                            onClick={() => setExpanded((v) => !v)}
                            className="flex items-center gap-1 text-sm font-semibold text-gold-dark hover:text-gold mt-3 transition-colors"
                        >
                            {expanded ? "Read Less" : "Read More"}
                            <ChevronDown
                                size={14}
                                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                            />
                        </button>
                    )}
                </div>
            )}

            {/* Spec table */}
            {rows.length > 0 && (
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone mb-3">
                        Property Details
                    </p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                        {rows.map((r) => (
                            <div
                                key={r.key}
                                className="flex items-center justify-between gap-4 py-3 border-b border-charcoal/6 last:border-b-0"
                            >
                                <dt className="text-sm text-stone shrink-0">{r.label}</dt>
                                <dd className="text-sm font-semibold text-charcoal-deep text-right">
                                    {r.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </div>
    );
}
