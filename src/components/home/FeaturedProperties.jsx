import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, BedDouble, Ruler, CalendarCheck, Loader2 } from "lucide-react";
import propertyService from '../../services/property.service';

export default function FeaturedProperties() {
  const [categories, setCategories] = useState(["All Properties"]);
  const [categoryMap, setCategoryMap] = useState({}); 
  const [filter, setFilter] = useState("All Properties");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(new Set());
  const trackRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, propRes] = await Promise.all([
          propertyService.getCategories().catch(() => null),
          propertyService.propertyList().catch(() => null)
        ]);

        // 1. Map Category IDs to Category Names
        const catData = catRes?.data?.data || catRes?.data || catRes || [];
        if (Array.isArray(catData) && catData.length > 0) {
          const map = {};
          const categoryNames = catData.map((c) => {
            map[c.id] = c.category_name; // ID-to-Name Mapping
            return c.category_name;
          });
          setCategoryMap(map);
          setCategories(["All Properties", ...categoryNames]);
        }

        // 2. Fetch Properties Payload
        const propData = propRes?.data?.data || propRes?.data || propRes || [];
        setProperties(Array.isArray(propData) ? propData : []);
      } catch (err) {
        console.error("Failed to load featured properties data:", err);
        setError("Failed to load featured properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter properties by checking p.category_id against mapped category names
  const list = filter === "All Properties" 
    ? properties 
    : properties.filter((p) => {
        const mappedName = categoryMap[p.category_id] || p.category_name || p.property_type || "";
        return mappedName.toLowerCase() === filter.toLowerCase();
      });

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-4 sm:pt-6 pb-10 sm:pb-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Featured Properties
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          Handpicked Properties for You
        </h2>
        <a
          href="/properties"
          className="inline-block text-sm font-semibold text-[#6FA82C] hover:underline mt-3"
        >
          View All Properties →
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 mt-7">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                filter === tab
                  ? "bg-[#1E4C8C] text-[#8BC53F] border-[#1E4C8C]"
                  : "border-[#1E4C8C]/15 text-slate-600 hover:border-[#7CB93D]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Property Cards Slider */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <Loader2 className="animate-spin text-[#1E4C8C]" size={32} />
          <p className="text-sm font-medium">Fetching verified listings...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 font-medium text-sm">
          {error}
        </div>
      ) : (
        <div className="relative mt-7">
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-1 sm:-left-3 top-[72px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="absolute -right-1 sm:-right-3 top-[72px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#1E4C8C]/10 text-[#1E4C8C] flex items-center justify-center shadow-card transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          <div ref={trackRef} className="flex gap-5 overflow-x-auto no-scrollbar scroll-px-5 pb-2">
          {list.map((p) => {
            const title = p.property_title || p.title || "Untitled Property";
            const location = p.city ? `${p.city}, ${p.state || ""}` : p.address || "Location N/A";
            const rawPrice = parseFloat(p.price || 0);
            const formattedPrice = rawPrice > 0 
              ? `₹${rawPrice.toLocaleString('en-IN')}` 
              : "Price on Request";
            
            const imageSrc = p.image_url || p.cover_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80";
            const badgeLabel = p.construction_status || p.property_for || "For Sale";
            const bedsLabel = p.bedroom ? `${p.bedroom} BHK` : "N/A";
            const areaLabel = p.area ? `${p.area} sq.ft.` : "N/A";
            const possessionLabel = p.construction_status || "Ready to Move";

            return (
              <div
                key={p.id}
                className="group shrink-0 w-[260px] bg-white rounded-2xl border border-[#1E4C8C]/10 overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#1E4C8C] text-white">
                    {badgeLabel}
                  </span>
                  <button
                    onClick={() => toggleLike(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      size={15}
                      className={liked.has(p.id) ? "fill-[#E76F51] text-[#E76F51]" : "text-slate-600"}
                    />
                  </button>
                </div>

                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display text-base text-[#1E4C8C] font-medium truncate" title={title}>
                        {title}
                      </h3>
                      <p className="text-slate-500 text-[11px] mt-0.5 truncate">{location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-lg text-[#6FA82C] font-semibold leading-tight">
                        {formattedPrice}
                      </p>
                      <p className="flex items-center justify-end gap-1.5 text-[11px] text-slate-600 mt-1">
                        <BedDouble size={12} /> {bedsLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 border-t border-[#1E4C8C]/10 pt-1.5">
                    <span className="flex items-center gap-1.5">
                      <Ruler size={12} /> {areaLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarCheck size={12} /> {possessionLabel}
                    </span>
                  </div>

                  <a
                    href={`/properties/details/${p.id}`}
                    className="block text-center w-full mt-2.5 border border-[#7CB93D] text-[#6FA82C] hover:bg-[#7CB93D] hover:text-white transition-colors font-semibold text-sm rounded-xl py-2"
                  >
                    View Details
                  </a>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <p className="text-slate-500 text-sm py-10 text-center">
          No properties found in this category yet.
        </p>
      )}
    </section>
  );
}