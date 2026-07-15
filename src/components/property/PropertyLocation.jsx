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
//   address    : string — full display address
//   lat, lng   : number — coordinates, used for the embedded map + directions link
//   nearby     : Array<{ name: string, category: "school"|"hospital"|"shopping"|"transit", distance: string }>
//
// Note: the map uses Google Maps' no-API-key embed (`maps.google.com/maps?q=...&output=embed`),
// so no billing account or API key setup is required. Swap for the official Maps Embed API
// (with a key) if you need custom styling or higher usage limits.

export default function PropertyLocation({ address, lat, lng, nearby = [] }) {
    const hasCoords = lat != null && lng != null;

    const mapSrc = hasCoords
        ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(address || "")}&z=14&output=embed`;

    const directionsUrl = hasCoords
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || "")}`;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-sm p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h3 className="font-display text-lg text-charcoal-deep font-medium mb-1.5">
                        Location
                    </h3>
                    <p className="flex items-start gap-1.5 text-sm text-stone">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        {address}
                    </p>
                </div>

                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-cream-deep hover:bg-gold-light/30 text-charcoal-deep text-xs font-semibold px-3.5 py-2.5 rounded-lg shrink-0 transition-colors"
                >
                    <Navigation size={13} />
                    Directions
                </a>
            </div>

            {/* Embedded map */}
            <div className="rounded-xl overflow-hidden border border-charcoal/5 aspect-[16/9] mb-5">
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
                    <p className="text-sm font-semibold text-charcoal-deep mb-3">What's Nearby</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {nearby.map((place, i) => {
                            const Icon = CATEGORY_ICON[place.category] || MapPin;
                            return (
                                <div
                                    key={place.name + i}
                                    className="flex items-center gap-3 bg-cream-deep rounded-lg px-3.5 py-2.5"
                                >
                                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                                        <Icon size={14} className="text-gold-dark" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm text-charcoal-deep truncate">{place.name}</p>
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