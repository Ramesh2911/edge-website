import { Building2, MapPin, TrendingUp, Landmark, Megaphone, ArrowRight } from "lucide-react";
import { quickLinks } from "../../data/staticData";

const iconMap = { Building2, MapPin, TrendingUp, Landmark, Megaphone };

export default function ExploreMore() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Explore More
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          Everything you need in one place
        </h2>
        <p className="text-slate-500 mt-3 text-[15px]">
          Explore top opportunities and make confident real estate decisions
        </p>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-7">
        {quickLinks.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <button
              key={item.label}
              className="group bg-white rounded-2xl border border-[#1E4C8C]/10 p-6 text-left hover:shadow-lift hover:-translate-y-1 transition-all"
            >
              <span className="w-12 h-12 rounded-xl bg-[#EAF6DE] flex items-center justify-center">
                <Icon size={22} className="text-[#6FA82C]" />
              </span>
              <p className="font-display text-lg text-[#1E4C8C] mt-4 font-medium">{item.label}</p>
              <p className="text-slate-500 text-sm mt-1.5 leading-snug">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-[#6FA82C] text-sm font-semibold mt-4">
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}