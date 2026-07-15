import { ShieldCheck, BadgePercent, Compass, Scale, Wallet } from "lucide-react";
import { excellenceFeatures } from "../../data/staticData";

const iconMap = { ShieldCheck, BadgePercent, Compass, Scale, Wallet };

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 sm:py-20">
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Why Choose Us
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          Experience Excellence in Real Estate
        </h2>
        <p className="text-slate-500 mt-3 text-[15px]">
          We go the extra mile to help you find the perfect property
        </p>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
        {excellenceFeatures.map((f) => {
          const Icon = iconMap[f.icon];
          return (
            <div
              key={f.title}
              className="bg-[#EAF1FB] rounded-2xl p-6 text-center hover:bg-white hover:shadow-card transition-all"
            >
              <span className="w-12 h-12 rounded-xl bg-[#EAF6DE] flex items-center justify-center mx-auto">
                <Icon size={20} className="text-[#6FA82C]" />
              </span>
              <p className="font-display text-base text-[#1E4C8C] font-medium mt-4">{f.title}</p>
              <p className="text-slate-500 text-xs mt-1.5 leading-snug">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}