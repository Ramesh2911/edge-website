import { partners } from "../../data/staticData";

export default function Partners() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-16 sm:pb-20">
      <p className="text-center text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-7">
        Our Trusted Partners
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {partners.map((p) => (
          <span
            key={p}
            className="font-display text-xl text-[#1E4C8C]/30 font-semibold tracking-wide select-none"
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}