import { useState } from "react";
import { partnerDevelopers } from "../../data/staticData";

function DeveloperCard({ dev }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showLogo = dev.logo && !imgFailed;

  return (
    <div className="shrink-0 w-[300px] bg-white rounded-2xl border border-[#1E4C8C]/10 p-5 shadow-card">
      <div className="h-28 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
        {showLogo ? (
          <img
            src={dev.logo}
            alt={`${dev.name} logo`}
            loading="lazy"
            className="max-h-24 max-w-[85%] object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span
            className={`font-display text-2xl font-semibold px-6 py-3 rounded-xl ${dev.color}`}
          >
            {dev.initials}
          </span>
        )}
      </div>
      <p className="font-display text-base text-[#1E4C8C] font-medium mt-4">{dev.name}</p>
      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-3">{dev.desc}</p>
    </div>
  );
}

export default function Partners() {
  const items = [...partnerDevelopers, ...partnerDevelopers];

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-6 sm:pt-8 pb-10 sm:pb-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
          Our Partners
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#1E4C8C] mt-3 font-medium">
          Our Partner Developers
        </h2>
        <p className="text-slate-500 mt-3 text-[15px]">
          We deal only in properties created by leading, renowned, and trusted developers.
        </p>
      </div>

      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="partner-marquee flex w-max py-2">
          {items.map((dev, i) => (
            <div key={`${dev.name}-${i}`} className="mr-5" aria-hidden={i >= partnerDevelopers.length}>
              <DeveloperCard dev={dev} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
