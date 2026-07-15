import { ShieldCheck, BadgePercent, Headset, LockKeyhole } from "lucide-react";
import { trustStrip } from "../../data/staticData";

const iconMap = { ShieldCheck, BadgePercent, Headset, LockKeyhole };

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-4">
      <div className="bg-[#EAF1FB] rounded-2xl grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1E4C8C]/10">
        {trustStrip.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.label} className="flex items-center gap-3 px-5 py-5">
              <Icon size={20} className="text-[#6FA82C] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E4C8C] leading-tight">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}