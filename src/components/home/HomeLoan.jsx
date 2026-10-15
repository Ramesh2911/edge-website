import { useMemo, useState } from "react";
import { Check, Home } from "lucide-react";

const formatInr = (n) =>
  `₹ ${Math.round(n).toLocaleString("en-IN")}`;

const Slider = ({ label, value, display, min, max, step, onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-bold text-[#1E4C8C]">{display}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 appearance-none rounded-full bg-[#EAF1FB] accent-[#7CB93D] cursor-pointer"
    />
  </div>
);

export default function HomeLoan() {
  const [amount, setAmount] = useState(5000000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const n = years * 12;
    const r = rate / 12 / 100;
    const emiVal =
      r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emiVal * n;
    return {
      emi: emiVal,
      totalInterest: total - amount,
      totalPayment: total,
    };
  }, [amount, years, rate]);

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-2 sm:pt-3 pb-10 sm:pb-14">
      <div className="bg-gradient-to-br from-[#153964] to-[#1E4C8C] rounded-3xl overflow-hidden grid sm:grid-cols-2 shadow-xl shadow-[#153964]/20">
        {/* Left — content */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#8BC53F] uppercase">
            Home Loan
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#F7FAFC] font-medium leading-tight mt-3">
            Finance Your Dream Home
          </h2>
          <p className="text-[#F7FAFC]/70 mt-3 text-[15px] max-w-sm">
            Plan your home loan with our EMI calculator — quick approval,
            competitive rates and flexible tenure options.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              "Instant eligibility check",
              "Competitive interest rates",
              "Tenure up to 30 years",
              "Minimal documentation",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[#F7FAFC]/85 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-[#7CB93D]/25 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-[#8BC53F]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button className="mt-7 self-start bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-6 py-3">
            Apply for Loan
          </button>
        </div>

        {/* Right — EMI calculator */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-lg">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-9 h-9 rounded-xl bg-[#EAF6DE] flex items-center justify-center">
                <Home size={17} className="text-[#6FA82C]" />
              </span>
              <div>
                <p className="font-semibold text-[#1E4C8C] text-sm leading-tight">
                  EMI Calculator
                </p>
                <p className="text-[11px] text-slate-500">
                  Adjust the sliders to plan your loan
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Slider
                label="Loan Amount"
                value={amount}
                display={formatInr(amount)}
                min={100000}
                max={20000000}
                step={100000}
                onChange={setAmount}
              />
              <Slider
                label="Tenure"
                value={years}
                display={`${years} Years`}
                min={1}
                max={30}
                step={1}
                onChange={setYears}
              />
              <Slider
                label="Interest Rate"
                value={rate}
                display={`${rate}% p.a.`}
                min={6}
                max={15}
                step={0.05}
                onChange={setRate}
              />
            </div>

            <div className="mt-6 pt-5 border-t border-dashed border-[#D4E5F7] text-center">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Monthly EMI
              </p>
              <p className="font-display text-3xl sm:text-[34px] text-[#1E4C8C] font-semibold mt-1">
                {formatInr(emi)}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#F4F9FE] rounded-xl py-2.5 px-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">
                    Total Interest
                  </p>
                  <p className="text-sm font-bold text-[#1E4C8C] mt-0.5">
                    {formatInr(totalInterest)}
                  </p>
                </div>
                <div className="bg-[#F4F9FE] rounded-xl py-2.5 px-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">
                    Total Payment
                  </p>
                  <p className="text-sm font-bold text-[#1E4C8C] mt-0.5">
                    {formatInr(totalPayment)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
