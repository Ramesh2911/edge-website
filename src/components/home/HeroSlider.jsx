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
      className="relative overflow-hidden h-[240px] sm:h-[320px] lg:h-[380px]"
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

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-7 bg-[#7CB93D]" : "w-2 bg-[#1E4C8C]/25 hover:bg-[#1E4C8C]/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
