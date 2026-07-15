import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { testimonials } from "../../data/staticData";

export default function Testimonials() {
  const trackRef = useRef(null);
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
            Happy Customers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
            What Our Customers Say
          </h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full border border-[#1E4C8C]/15 flex items-center justify-center hover:bg-[#7CB93D] hover:text-white hover:border-[#7CB93D] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full border border-[#1E4C8C]/15 flex items-center justify-center hover:bg-[#7CB93D] hover:text-white hover:border-[#7CB93D] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-5 mt-8 overflow-x-auto no-scrollbar pb-2">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="shrink-0 w-[320px] bg-[#EAF1FB] rounded-2xl p-6 flex flex-col"
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
    </section>
  );
}