import { ShieldCheck, Landmark, Scale, Wallet, Headphones, Eye } from "lucide-react";
import { excellenceFeatures } from "../../data/staticData";

const iconMap = { ShieldCheck, Landmark, Scale, Wallet, Headphones, Eye };

function FeatureCard({ f }) {
  const Icon = iconMap[f.icon] ?? ShieldCheck;
  return (
    <div className="w-[260px] shrink-0 bg-[#EAF1FB] rounded-2xl p-6 hover:bg-white hover:shadow-card transition-all">
      <span className="w-12 h-12 rounded-xl bg-[#EAF6DE] flex items-center justify-center">
        <Icon size={20} className="text-[#6FA82C]" />
      </span>
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#6FA82C] mt-4">
        {f.tag}
      </p>
      <p className="font-display text-base text-[#1E4C8C] font-medium mt-1.5 leading-snug">
        {f.title}
      </p>
      <p className="text-slate-500 text-xs mt-2 leading-relaxed">{f.desc}</p>
    </div>
  );
}

export default function WhyChooseUs() {
  const items = [...excellenceFeatures, ...excellenceFeatures];

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 sm:pt-14 pb-4 sm:pb-6">
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

      <div className="mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="partner-marquee flex w-max py-2">
          {items.map((f, i) => (
            <div key={`${f.title}-${i}`} className="mr-4" aria-hidden={i >= excellenceFeatures.length}>
              <FeatureCard f={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}