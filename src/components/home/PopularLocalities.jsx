import { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { localities } from "../../data/staticData";

export default function PopularLocalities() {
  const trackRef = useRef(null);
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 sm:pt-14 pb-0">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Popular Localities
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          Explore Top Localities
        </h2>
        <p className="text-slate-500 mt-2 text-[15px]">
          Discover prime locations with great connectivity and lifestyle
        </p>
      </div>

      <div className="relative mt-6">
        {/* Side arrows */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute -left-1 sm:-left-3 top-[88px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute -right-1 sm:-right-3 top-[88px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        <div ref={trackRef} className="flex gap-4 overflow-x-auto no-scrollbar">
          {localities.map((loc) => (
            <button
              key={loc.id}
              className="shrink-0 w-[200px] group text-left"
            >
              <div className={`h-44 rounded-2xl bg-gradient-to-br ${loc.gradient} relative overflow-hidden`}>
                <img
                  src={loc.image}
                  alt={loc.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-[#1E4C8C]/0 group-hover:bg-[#1E4C8C]/10 transition-colors" />
                <span className="absolute bottom-3 left-3 bg-white/90 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#1E4C8C] flex items-center gap-1">
                  <MapPin size={11} /> {loc.city}
                </span>
              </div>
              <p className="font-display text-base text-[#1E4C8C] font-medium mt-3">{loc.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{loc.count}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
