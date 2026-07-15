import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, BedDouble, Ruler, CalendarCheck } from "lucide-react";
import { propertyFilterTabs, properties } from "../../data/staticData";

export default function FeaturedProperties() {
  const [filter, setFilter] = useState("All Properties");
  const [liked, setLiked] = useState(new Set());
  const trackRef = useRef(null);

  const list =
    filter === "All Properties" ? properties : properties.filter((p) => p.tag === filter);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
            Featured Properties
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
            Handpicked Properties for You
          </h2>
        </div>
        <a href="#" className="text-sm font-semibold text-[#6FA82C] hover:underline">
          View All Properties →
        </a>
      </div>

      <div className="flex items-center justify-between gap-4 mt-7">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {propertyFilterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${filter === tab
                  ? "bg-[#1E4C8C] text-[#8BC53F] border-[#1E4C8C]"
                  : "border-[#1E4C8C]/15 text-slate-600 hover:border-[#7CB93D]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full border border-[#1E4C8C]/15 flex items-center justify-center hover:bg-[#7CB93D] hover:text-white hover:border-[#7CB93D] transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full border border-[#1E4C8C]/15 flex items-center justify-center hover:bg-[#7CB93D] hover:text-white hover:border-[#7CB93D] transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-5 mt-7 overflow-x-auto no-scrollbar scroll-px-5 pb-2">
        {list.map((p) => (
          <div
            key={p.id}
            className="shrink-0 w-[300px] bg-white rounded-2xl border border-[#1E4C8C]/10 overflow-hidden shadow-card hover:shadow-lift transition-shadow"
          >
            <div className={`relative h-44 bg-gradient-to-br ${p.gradient} overflow-hidden`}>
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span
                className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${p.badgeColor}`}
              >
                {p.badge}
              </span>
              <button
                onClick={() => toggleLike(p.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                aria-label="Save to wishlist"
              >
                <Heart
                  size={15}
                  className={liked.has(p.id) ? "fill-[#E76F51] text-[#E76F51]" : "text-slate-600"}
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg text-[#1E4C8C] font-medium">{p.name}</h3>
              <p className="text-slate-500 text-xs mt-1">{p.location}</p>
              <p className="font-display text-xl text-[#6FA82C] font-semibold mt-2">{p.price}</p>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-3">
                <BedDouble size={13} /> {p.beds}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 border-t border-[#1E4C8C]/10 pt-3">
                <span className="flex items-center gap-1.5">
                  <Ruler size={13} /> {p.area} sq.ft.
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarCheck size={13} /> {p.possession}
                </span>
              </div>

              <button className="w-full mt-4 border border-[#7CB93D] text-[#6FA82C] hover:bg-[#7CB93D] hover:text-white transition-colors font-semibold text-sm rounded-xl py-2.5">
                View Details
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-slate-500 text-sm py-10">No properties found in this category yet.</p>
        )}
      </div>
    </section>
  );
}