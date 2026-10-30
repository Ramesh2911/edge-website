import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_DELAY = 5000;

export default function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_DELAY);
    return () => clearInterval(timer);
  }, [paused, current, total]);

  const go = (dir) => setCurrent((c) => (c + dir + total) % total);

  return (
    <section
      className="relative overflow-hidden min-h-[300px] sm:h-[380px] lg:h-[440px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ))}

      {/* Side arrows — visible on all sizes (dots removed; card covers hero bottom) */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="flex absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] items-center justify-center shadow-card transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="flex absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] items-center justify-center shadow-card transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </section>
  );
}
