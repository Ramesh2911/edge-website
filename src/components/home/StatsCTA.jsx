import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { heroStats } from "../../data/staticData";

function parseValue(str) {
  const match = String(str).match(/^([\d.]+)(.*)$/);
  if (!match) return { target: 0, suffix: "", decimals: 0 };
  const decimals = (match[1].split(".")[1] || "").length;
  return { target: parseFloat(match[1]), suffix: match[2], decimals };
}

function Counter({ value }) {
  const { target, suffix, decimals } = parseValue(value);
  const [display, setDisplay] = useState(0);
  const wrapRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("en-IN");

  return (
    <span ref={wrapRef}>
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsCTA() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-10 sm:pb-14">
      <div className="bg-[#EAF1FB] rounded-2xl p-5 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 text-center sm:text-left">
          {heroStats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-3xl text-[#1E4C8C] font-semibold">
                <Counter value={s.value} />
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {s.label === "Top Cities"
                  ? "Cities Covered"
                  : s.label === "Years of Trust"
                    ? "Years of Experience"
                    : s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center sm:items-end gap-3 pt-6 border-t border-[#1E4C8C]/10 sm:pt-0 sm:border-t-0 sm:pl-8 sm:border-l">
          <p className="font-display text-lg text-[#1E4C8C] font-medium text-center sm:text-right">
            Ready to Find Your Dream Home?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/properties"
              className="bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-5 py-2.5"
            >
              Explore Properties
            </Link>
            <Link
              to="/contact"
              className="border border-[#1E4C8C]/20 hover:border-[#7CB93D] text-[#1E4C8C] font-semibold text-sm rounded-xl px-5 py-2.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
