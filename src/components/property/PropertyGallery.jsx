import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Expand, Image as ImageIcon } from "lucide-react";

// ============================================================
// PropertyGallery
// ============================================================
//
// Props:
//   images : string[] — array of image URLs
//   title  : string   — used for alt text

export default function PropertyGallery({ images = [], title = "Property" }) {
    const [active, setActive] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const list = images.length ? images : ["https://placehold.co/1200x800/EFE9DD/A38F71?text=No+Image"];

    const goTo = useCallback((i) => setActive((i + list.length) % list.length), [list.length]);
    const next = useCallback(() => goTo(active + 1), [active, goTo]);
    const prev = useCallback(() => goTo(active - 1), [active, goTo]);

    // Keyboard navigation while lightbox is open
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
        <div>
            {/* ================= Main view ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-2 sm:gap-3">
                {/* Large active image */}
                <div
                    className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-cream-deep cursor-zoom-in group"
                    onClick={() => setLightboxOpen(true)}
                >
                    <img
                        src={list[active]}
                        alt={`${title} — photo ${active + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-charcoal-deep/0 group-hover:bg-charcoal-deep/10 transition-colors" />

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxOpen(true);
                        }}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 hover:bg-white text-charcoal-deep text-xs font-semibold px-3 py-2 rounded-lg shadow-sm"
                    >
                        <Expand size={13} />
                        View all {list.length} photos
                    </button>

                    {/* Mobile arrows */}
                    {list.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                aria-label="Previous photo"
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center lg:hidden"
                            >
                                <ChevronLeft size={16} className="text-charcoal-deep" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                aria-label="Next photo"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white flex items-center justify-center lg:hidden"
                            >
                                <ChevronRight size={16} className="text-charcoal-deep" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail column — desktop only */}
                <div className="hidden lg:grid grid-rows-4 gap-3">
                    {list.slice(0, 4).map((src, i) => (
                        <button
                            key={src + i}
                            type="button"
                            onClick={() => (i === 3 && list.length > 4 ? setLightboxOpen(true) : goTo(i))}
                            className={`relative rounded-xl overflow-hidden border-2 transition-colors ${active === i ? "border-gold" : "border-transparent"
                                }`}
                        >
                            <img src={src} alt={`${title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                            {i === 3 && list.length > 4 && (
                                <div className="absolute inset-0 bg-charcoal-deep/60 flex flex-col items-center justify-center text-cream">
                                    <ImageIcon size={16} />
                                    <span className="text-xs font-semibold mt-1">+{list.length - 4} more</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
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
                            className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-gold" : "w-1.5 bg-charcoal/15"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* ================= Lightbox ================= */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-charcoal-deep/95 flex flex-col">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
                        <span className="text-cream/70 text-sm">
                            {active + 1} / {list.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => setLightboxOpen(false)}
                            aria-label="Close gallery"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
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
                                className="absolute left-2 sm:left-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
                            >
                                <ChevronLeft size={20} className="text-cream" />
                            </button>
                        )}

                        <img
                            src={list[active]}
                            alt={`${title} — photo ${active + 1}`}
                            className="max-h-[75vh] max-w-full object-contain rounded-lg"
                        />

                        {list.length > 1 && (
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next photo"
                                className="absolute right-2 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
                            >
                                <ChevronRight size={20} className="text-cream" />
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
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${active === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}