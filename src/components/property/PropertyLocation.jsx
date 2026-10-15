import { MapPin, Navigation, School, Hospital, ShoppingBag, TrainFront } from "lucide-react";

// ============================================================
// Icon lookup for nearby-place categories
// ============================================================

const CATEGORY_ICON = {
    school: School,
    hospital: Hospital,
    shopping: ShoppingBag,
    transit: TrainFront,
};

// ============================================================
// PropertyLocation
// ============================================================
//
// Props:
//   address  : string
//   lat, lng : number — embedded map + directions link
//   nearby   : Array<{ name, category, distance }>
//
// The map uses Google Maps' keyless embed so no billing/API key is required.

export default function PropertyLocation({ address, lat, lng, nearby = [] }) {
    // India-only guard: ignore bogus coordinates so the map geocodes the address.
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const coordsValid =
        Number.isFinite(parsedLat) &&
        Number.isFinite(parsedLng) &&
        parsedLat >= 6 &&
        parsedLat <= 37.5 &&
        parsedLng >= 68 &&
        parsedLng <= 97.5;
    const hasCoords = lat != null && lng != null && coordsValid;

    const mapSrc = hasCoords
        ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(address || "")}&z=14&output=embed`;

    const directionsUrl = hasCoords
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || "")}`;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-card p-5 sm:p-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-light/60 to-gold-light/20 flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-gold-dark" />
                    </span>
                    <div>
                        <h3 className="font-display text-xl text-charcoal-deep font-medium mb-1.5">
                            Location
                        </h3>
                        <p className="flex items-start gap-1.5 text-sm text-stone leading-relaxed">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-gold-dark" />
                            {address}
                        </p>
                    </div>
                </div>

                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-cream-deep hover:bg-gold-light/30 border border-charcoal/8 text-charcoal-deep text-xs font-semibold px-3.5 py-2.5 rounded-lg shrink-0 transition-colors"
                >
                    <Navigation size={13} />
                    Directions
                </a>
            </div>

            {/* Embedded map */}
            <div className="rounded-xl overflow-hidden border border-charcoal/8 aspect-[16/9] mb-5 bg-cream-deep">
                <iframe
                    title="Property location map"
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            {/* Nearby places */}
            {nearby.length > 0 && (
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone mb-3">
                        What's Nearby
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {nearby.map((place, i) => {
                            const Icon = CATEGORY_ICON[place.category] || MapPin;
                            return (
                                <div
                                    key={place.name + i}
                                    className="flex items-center gap-3 bg-cream-deep/60 hover:bg-gold-pale/40 border border-charcoal/6 rounded-xl px-3.5 py-3 transition-colors"
                                >
                                    <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                        <Icon size={15} className="text-gold-dark" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm text-charcoal-deep truncate font-medium">
                                            {place.name}
                                        </p>
                                        <p className="text-xs text-stone">{place.distance}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
