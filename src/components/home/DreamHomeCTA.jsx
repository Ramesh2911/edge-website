import { Home } from "lucide-react";
import { dreamHomeImage } from "../../data/staticData";

export default function DreamHomeCTA() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-2 sm:pt-3 pb-10 sm:pb-14">
      <div className="bg-gradient-to-br from-[#153964] to-[#1E4C8C] rounded-3xl overflow-hidden grid sm:grid-cols-[1fr_1.1fr] shadow-xl shadow-[#153964]/20">
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="font-display text-3xl sm:text-4xl text-[#F7FAFC] font-medium leading-tight">
            Find Your Dream Home
          </h2>
          <p className="text-[#F7FAFC]/70 mt-3 text-[15px] max-w-xs">
            Trusted by thousands. Chosen for a better lifestyle.
          </p>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <button className="bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-6 py-3">
              Explore Properties
            </button>
            <a href="#" className="text-[#8BC53F] text-sm font-semibold hover:underline">
              How it Works
            </a>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-blue-100 via-slate-300 to-slate-600 min-h-[220px] flex items-center justify-center overflow-hidden">
          <img
            src={dreamHomeImage}
            alt="A home interior"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <Home size={64} className="relative text-[#F7FAFC]/30" strokeWidth={1.2} />
        </div>
      </div>
    </section>
  );
}