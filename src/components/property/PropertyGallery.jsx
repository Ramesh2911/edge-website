import { useState, useEffect, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    X,
    Expand,
    Images,
    Home,
} from "lucide-react";

// ============================================================
// PropertyGallery — immersive hero gallery
// ============================================================
//
// Props:
//   images    : string[]        — image URLs (relative "/uploads/..." are resolved)
//   title     : string          — used for alt text
//   topRight  : ReactNode       — floating glass actions (wishlist / share)
//   overlay   : ReactNode       — content overlaid on the bottom gradient
//                                 (badges, title, location, price, …)
//   className : string          — extra classes for the outer wrapper
//
// Design notes: rounded-3xl hero with a right-hand thumbnail column on
// desktop, glass control chips, a bottom gradient for text legibility, and a
// full-screen lightbox with keyboard navigation.

const FALLBACK =
    "https://placehold.co/1400x900/EFE9DD/A38F71?text=No+Photo";

/** Image with graceful fallback (broken URL → placeholder). */
function Img({ src, alt, className }) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) {
        return (
            <div
                className={`${className} bg-gradient-to-br from-cream-deep via-gold-light/30 to-cream flex flex-col items-center justify-center gap-2`}
            >
                <Home size={28} className="text-gold/50" />
                <span className="text-[11px] font-semibold text-gold-dark/70 tracking-wide">
                    No photo available
                </span>
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={className}
        />
    );
}

export default function PropertyGallery({
    images = [],
    title = "Property",
    topRight,
    overlay,
    className = "",
}) {
    const [active, setActive] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const list = images.length ? images : [FALLBACK];
    const multi = list.length > 1;

    const goTo = useCallback(
        (i) => setActive((i + list.length) % list.length),
        [list.length]
    );
    const next = useCallback(() => goTo(active + 1), [active, goTo]);
    const prev = useCallback(() => goTo(active - 1), [active, goTo]);

    // Lock body scroll while the lightbox is open.
    useEffect(() => {
        if (!lightboxOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [lightboxOpen]);

    // Keyboard navigation while lightbox is open.
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e) => {
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxOpen, next, prev]);

    return (
        <div className={className}>
            {/* ================= Hero ================= */}
            <div
                className={`grid grid-cols-1 gap-2 sm:gap-3 ${
                    multi ? "lg:grid-cols-[1fr_260px]" : "lg:grid-cols-1"
                }`}
            >
                {/* Large active image */}
                <div
                    className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[560px] rounded-2xl lg:rounded-3xl overflow-hidden bg-cream-deep cursor-zoom-in group shadow-lift"
                    onClick={() => setLightboxOpen(true)}
                >
                    <Img
                        src={list[active]}
                        alt={`${title} — photo ${active + 1}`}
                        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />

                    {/* Legibility gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/85 via-charcoal-deep/10 to-charcoal-deep/30 pointer-events-none" />

                    {/* Photo count chip */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/45 backdrop-blur-md text-cream text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/15">
                        <Images size={13} />
                        {images.length ? `${images.length} Photos` : "No photos"}
                    </div>

                    {/* Floating actions */}
                    {topRight && (
                        <div
                            className="absolute top-4 right-4 flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {topRight}
                        </div>
                    )}

                    {/* Nav arrows */}
                    {multi && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                aria-label="Previous photo"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur flex items-center justify-center shadow-card transition-all active:scale-90"
                            >
                                <ChevronLeft size={18} className="text-charcoal-deep" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                aria-label="Next photo"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur flex items-center justify-center shadow-card transition-all active:scale-90"
                            >
                                <ChevronRight size={18} className="text-charcoal-deep" />
                            </button>
                        </>
                    )}

                    {/* Expand pill */}
                    {multi && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxOpen(true);
                            }}
                            className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 hover:bg-white text-charcoal-deep text-xs font-semibold px-3.5 py-2 rounded-full shadow-card backdrop-blur"
                        >
                            <Expand size={13} />
                            View all {list.length} photos
                        </button>
                    )}

                    {/* Bottom overlay content */}
                    {overlay && (
                        <div
                            className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {overlay}
                        </div>
                    )}
                </div>

                {/* Thumbnail column — desktop, only when multiple photos */}
                {multi && (
                    <div className="hidden lg:grid grid-rows-4 gap-2 sm:gap-3">
                    {list.slice(0, 4).map((src, i) => {
                        const isLast = i === 3 && list.length > 4;
                        return (
                            <button
                                key={src + i}
                                type="button"
                                onClick={() =>
                                    isLast ? setLightboxOpen(true) : goTo(i)
                                }
                                className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                                    active === i && !isLast
                                        ? "border-gold shadow-card"
                                        : "border-transparent"
                                }`}
                            >
                                <Img
                                    src={src}
                                    alt={`${title} thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {active === i && !isLast && (
                                    <div className="absolute inset-0 ring-2 ring-inset ring-gold/60" />
                                )}
                                {isLast && (
                                    <div className="absolute inset-0 bg-charcoal-deep/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-cream">
                                        <Expand size={18} />
                                        <span className="text-xs font-semibold mt-1">
                                            +{list.length - 4} more
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    </div>
                )}
            </div>

            {/* Mobile dot indicator */}
            {list.length > 1 && (
                <div className="flex lg:hidden justify-center gap-1.5 mt-3">
                    {list.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to photo ${i + 1}`}
                            onClick={() => goTo(i)}
                            className={`h-1.5 rounded-full transition-all ${
                                i === active ? "w-5 bg-gold" : "w-1.5 bg-charcoal/20"
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* ================= Lightbox ================= */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[60] bg-charcoal-deep/96 backdrop-blur-sm flex flex-col">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
                        <span className="text-cream/70 text-sm font-medium">
                            {active + 1} / {list.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => setLightboxOpen(false)}
                            aria-label="Close gallery"
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X size={18} className="text-cream" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative px-4 sm:px-16">
                        {list.length > 1 && (
                            <button
                                type="button"
                                onClick={prev}
                                aria-label="Previous photo"
                                className="absolute left-2 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
                            >
                                <ChevronLeft size={22} className="text-cream" />
                            </button>
                        )}

                        <Img
                            src={list[active]}
                            alt={`${title} — photo ${active + 1}`}
                            className="max-h-[75vh] max-w-full object-contain rounded-xl"
                        />

                        {list.length > 1 && (
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next photo"
                                className="absolute right-2 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
                            >
                                <ChevronRight size={22} className="text-cream" />
                            </button>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-4 shrink-0">
                        {list.map((src, i) => (
                            <button
                                key={src + i}
                                type="button"
                                onClick={() => goTo(i)}
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                                    active === i
                                        ? "border-gold opacity-100"
                                        : "border-transparent opacity-55 hover:opacity-100"
                                }`}
                            >
                                <Img src={src} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
