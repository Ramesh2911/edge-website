import { heroStats } from "../../data/staticData";

export default function StatsCTA() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-16 sm:pb-20">
      <div className="bg-[#EAF1FB] rounded-2xl p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {heroStats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-3xl text-[#1E4C8C] font-semibold">
                {s.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {s.label === "Top Cities" ? "Cities Covered" : s.label === "Years of Trust" ? "Years of Experience" : s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:items-end gap-3">
          <p className="font-display text-lg text-[#1E4C8C] font-medium text-center sm:text-right">
            Ready to Find Your Dream Home?
          </p>
          <div className="flex gap-3">
            <button className="bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-5 py-2.5">
              Explore Properties
            </button>
            <button className="border border-[#1E4C8C]/20 hover:border-[#7CB93D] text-[#1E4C8C] font-semibold text-sm rounded-xl px-5 py-2.5">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}