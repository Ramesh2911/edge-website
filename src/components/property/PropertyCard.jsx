import { useState, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    Scale,
    MapPin,
    BedDouble,
    Bath,
    Car,
    Ruler,
    BadgeCheck,
    Star,
    User,
    Phone,
    Eye,
} from "lucide-react";

// ============================================================
// Helpers
// ============================================================

import { formatPrice } from "../../utils/formatPrice";

const formatArea = (value, unit = "sq.ft") => {
    if (value == null) return "—";
    return `${value.toLocaleString("en-IN")} ${unit}`;
};

// ============================================================
// Skeleton (loading state)
// ============================================================

function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal/5 animate-pulse">
            <div className="aspect-[4/3] bg-stone/15" />
            <div className="p-4 sm:p-5 space-y-3">
                <div className="h-4 w-24 bg-stone/15 rounded-full" />
                <div className="h-5 w-3/4 bg-stone/15 rounded-full" />
                <div className="h-4 w-1/2 bg-stone/15 rounded-full" />
                <div className="flex gap-3 pt-2">
                    <div className="h-4 w-14 bg-stone/15 rounded-full" />
                    <div className="h-4 w-14 bg-stone/15 rounded-full" />
                    <div className="h-4 w-14 bg-stone/15 rounded-full" />
                </div>
                <div className="h-9 w-full bg-stone/15 rounded-xl mt-4" />
            </div>
        </div>
    );
}

// ============================================================
// Image Slider
// ============================================================

function ImageSlider({ images, alt, badges }) {
    const [active, setActive] = useState(0);
    const touchStartX = useRef(null);

    const hasMultiple = images.length > 1;

    const goTo = (i) => setActive((i + images.length) % images.length);
    const next = (e) => {
        e?.stopPropagation();
        goTo(active + 1);
    };
    const prev = (e) => {
        e?.stopPropagation();
        goTo(active - 1);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (touchStartX.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > 40) prev();
        else if (delta < -40) next();
        touchStartX.current = null;
    };

    return (
        <div
            className="relative aspect-[4/3] overflow-hidden bg-cream-deep group/slider"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {images.map((src, i) => (
                <img
                    key={src + i}
                    src={src}
                    alt={`${alt} — photo ${i + 1}`}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {badges.featured && (
                    <span className="flex items-center gap-1 bg-gold text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        <Star size={11} className="fill-white" />
                        Featured
                    </span>
                )}
                {badges.verified && (
                    <span className="flex items-center gap-1 bg-white/95 text-charcoal-deep text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        <BadgeCheck size={12} className="text-blue-600" />
                        Verified
                    </span>
                )}
            </div>

            <div className="absolute top-3 right-3 z-10">
                <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${badges.listingType === "Rent"
                            ? "bg-charcoal-deep text-cream"
                            : "bg-white/95 text-charcoal-deep"
                        }`}
                >
                    For {badges.listingType}
                </span>
            </div>

            {/* Arrows */}
            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-10"
                    >
                        <ChevronLeft size={16} className="text-charcoal-deep" />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-10"
                    >
                        <ChevronRight size={16} className="text-charcoal-deep" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Go to photo ${i + 1}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goTo(i);
                                }}
                                className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-white" : "w-1.5 bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================
// PropertyCard
// ============================================================

export default function PropertyCard({
    property,
    loading = false,
    isWishlisted = false,
    isCompared = false,
    onToggleWishlist,
    onToggleCompare,
    onViewDetails,
    onContactOwner,
    onShare,
    className = "",
}) {
    const [wishBusy, setWishBusy] = useState(false);

    if (loading || !property) return <PropertyCardSkeleton />;

    const {
        id,
        images = [],
        title,
        propertyType,
        listingType = "Sale",
        price,
        priceUnit,
        address,
        area,
        areaUnit,
        bedrooms,
        bathrooms,
        parking,
        featured = false,
        verified = false,
        postedBy = { role: "Owner", name: "" },
    } = property;

    const fallbackImages = images.length
        ? images
        : ["https://placehold.co/640x480/EFE9DD/A38F71?text=No+Image"];

    const handleWishlist = async (e) => {
        e.stopPropagation();
        if (!onToggleWishlist) return;
        setWishBusy(true);
        try {
            await onToggleWishlist(id);
        } finally {
            setWishBusy(false);
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const shareData = {
            title,
            text: `${title} — ${formatPrice(price)}`,
            url: typeof window !== "undefined" ? `${window.location.origin}/properties/details/${id}` : "",
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                /* user cancelled share — no action needed */
            }
        } else if (onShare) {
            onShare(property);
        } else if (navigator.clipboard && shareData.url) {
            navigator.clipboard.writeText(shareData.url);
        }
    };

    const handleCompare = (e) => {
        e.stopPropagation();
        onToggleCompare?.(id);
    };

    const handleViewDetails = () => {
        onViewDetails?.(id);
    };

    const handleContactOwner = (e) => {
        e.stopPropagation();
        onContactOwner?.(property);
    };

    return (
        <div
            onClick={handleViewDetails}
            className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-charcoal/5 transition-all duration-300 cursor-pointer flex flex-col ${className}`}
        >
            {/* Image Slider */}
            <div className="relative">
                <ImageSlider images={fallbackImages} alt={title} badges={{ featured, verified, listingType }} />

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={handleWishlist}
                    disabled={wishBusy}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isWishlisted}
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center z-10 disabled:opacity-60 transition-transform active:scale-90"
                >
                    <Heart
                        size={17}
                        className={isWishlisted ? "fill-red-500 text-red-500" : "text-charcoal-deep"}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                {/* Type + Price */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-dark bg-gold-light/30 px-2.5 py-1 rounded-full">
                        {propertyType}
                    </span>
                    <span className="font-display text-lg text-charcoal-deep font-semibold whitespace-nowrap">
                        {formatPrice(price)}
                        {listingType === "Rent" && priceUnit ? (
                            <span className="text-xs font-normal text-stone">/{priceUnit}</span>
                        ) : null}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base sm:text-lg text-charcoal-deep font-medium leading-snug line-clamp-1">
                    {title}
                </h3>

                {/* Address */}
                <p className="flex items-start gap-1.5 text-sm text-stone mt-1.5 line-clamp-1">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{address}</span>
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-charcoal/80 mt-3 pt-3 border-t border-charcoal/5">
                    {area != null && (
                        <span className="flex items-center gap-1.5">
                            <Ruler size={14} className="text-gold-dark shrink-0" />
                            {formatArea(area, areaUnit)}
                        </span>
                    )}
                    {bedrooms != null && (
                        <span className="flex items-center gap-1.5">
                            <BedDouble size={14} className="text-gold-dark shrink-0" />
                            {bedrooms} Bed
                        </span>
                    )}
                    {bathrooms != null && (
                        <span className="flex items-center gap-1.5">
                            <Bath size={14} className="text-gold-dark shrink-0" />
                            {bathrooms} Bath
                        </span>
                    )}
                    {parking != null && (
                        <span className="flex items-center gap-1.5">
                            <Car size={14} className="text-gold-dark shrink-0" />
                            {parking} Parking
                        </span>
                    )}
                </div>

                {/* Posted by */}
                <p className="flex items-center gap-1.5 text-xs text-stone mt-3">
                    <User size={12} className="shrink-0" />
                    Posted by {postedBy.role}
                    {postedBy.name ? ` · ${postedBy.name}` : ""}
                </p>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-charcoal/5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-charcoal-deep hover:bg-charcoal text-cream text-sm font-semibold rounded-xl px-3 py-2.5 transition-colors"
                    >
                        <Eye size={15} />
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={handleContactOwner}
                        aria-label="Contact owner"
                        className="w-10 h-10 shrink-0 rounded-xl bg-gold-light/30 hover:bg-gold-light/50 text-gold-dark flex items-center justify-center transition-colors"
                    >
                        <Phone size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={handleCompare}
                        aria-label={isCompared ? "Remove from compare" : "Add to compare"}
                        aria-pressed={isCompared}
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${isCompared
                                ? "bg-gold text-white"
                                : "bg-cream-deep hover:bg-stone/15 text-charcoal-deep"
                            }`}
                    >
                        <Scale size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Share property"
                        className="w-10 h-10 shrink-0 rounded-xl bg-cream-deep hover:bg-stone/15 text-charcoal-deep flex items-center justify-center transition-colors"
                    >
                        <Share2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

