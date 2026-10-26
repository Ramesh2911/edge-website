import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { testimonials } from "../../data/staticData";

export default function Testimonials() {
  const trackRef = useRef(null);
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Happy Customers
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          What Our Customers Say
        </h2>
      </div>
      <div className="relative mt-6">
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        <div ref={trackRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="shrink-0 w-[280px] sm:w-[320px] bg-[#EAF1FB] rounded-2xl p-6 flex flex-col"
          >
            <Quote size={22} className="text-[#8BC53F]" />
            <div className="flex gap-0.5 mt-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} className="fill-[#7CB93D] text-[#7CB93D]" />
              ))}
            </div>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed flex-1">{t.quote}</p>
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1E4C8C]/10">
              <span className="w-9 h-9 rounded-full bg-[#EAF6DE] flex items-center justify-center font-display text-sm text-[#6FA82C] font-semibold">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1E4C8C] leading-none">{t.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.city}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}