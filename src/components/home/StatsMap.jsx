import { Building2, Users, MapPinned, ShieldCheck } from "lucide-react";
import { heroStats, nearbyPins } from "../../data/staticData";

const icons = [Building2, Users, MapPinned, ShieldCheck];

export default function StatsMap() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-4">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 items-stretch">
        <div className="grid grid-cols-2 gap-4">
          {heroStats.map((s, i) => {
            const Icon = icons[i];
            return (
              <div
                key={s.label}
                className="bg-white border border-[#1E4C8C]/10 rounded-2xl p-5 flex flex-col gap-2"
              >
                <Icon size={20} className="text-[#6FA82C]" />
                <p className="font-display text-2xl text-[#1E4C8C] font-semibold">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 via-blue-50 to-[#EAF1FB] border border-[#1E4C8C]/10 min-h-[260px]">
          <div className="absolute inset-0 opacity-40 [background:linear-gradient(rgba(21,57,100,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(21,57,100,0.07)_1px,transparent_1px)] [background-size:28px_28px]" />
          <span className="absolute top-4 left-4 bg-white/95 rounded-full px-3 py-1.5 text-xs font-semibold text-[#1E4C8C] shadow-card">
            Properties Near You
          </span>
          {nearbyPins.map((pin, i) => (
            <span
              key={i}
              style={{ top: pin.top, left: pin.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#1E4C8C] text-[#8BC53F] text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-card"
            >
              {pin.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}