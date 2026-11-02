import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { localities } from "../../data/staticData";
import propertyService from "../../services/property.service";

const FALLBACK = localities.map((loc) => ({
  id: loc.id,
  city: loc.city,
  count: null,
}));

export default function PopularLocalities() {
  const trackRef = useRef(null);
  const [cities, setCities] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });

  useEffect(() => {
    let alive = true;
    propertyService
      .getCities()
      .then((res) => {
        const data = res?.data?.data;
        if (alive && Array.isArray(data) && data.length) {
          setCities(
            data.map((c, i) => ({ id: c.city || i, city: c.city, count: Number(c.count) || 0 }))
          );
        }
      })
      .catch(() => {}) // keep fallback
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && cities.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] font-medium">
          Explore Top Localities
        </h2>
        <p className="text-slate-500 mt-2 text-[15px]">
          Discover prime locations with great connectivity and lifestyle
        </p>
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

        <div ref={trackRef} className="flex gap-4 overflow-x-auto no-scrollbar px-1">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[170px] animate-pulse">
                  <div className="h-4 rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-100 mt-2.5" />
                </div>
              ))
            : cities.map((loc) => (
                <Link
                  key={loc.id}
                  to={`/properties?city=${encodeURIComponent(loc.city)}`}
                  className="group shrink-0 w-[170px] text-left"
                >
                  <span className="inline-flex items-center gap-1.5 text-[#1E4C8C] group-hover:text-[#6FA82C] transition-colors">
                    <MapPin
                      size={15}
                      className="shrink-0 text-[#6FA82C] group-hover:scale-110 transition-transform"
                    />
                    <span className="font-display text-base font-medium truncate">
                      {loc.city}
                    </span>
                  </span>
                  <p className="text-slate-500 text-xs mt-1 pl-[21px]">
                    {loc.count !== null
                      ? `${loc.count} ${loc.count === 1 ? "Property" : "Properties"}`
                      : "View properties"}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
