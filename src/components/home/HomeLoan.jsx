import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Check, Home, X } from "lucide-react";
import loanService from "../../services/loan.service";

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

  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", amount: "" });

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

  const openModal = () => {
    setSubmitted(false);
    setForm({ name: "", phone: "", email: "", amount: String(amount) });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const cleaned = value.replace(/[^A-Za-z ]/g, "");
      if (cleaned !== value) toast.error("Name can only contain letters");
      setForm((f) => ({ ...f, name: cleaned }));
      return;
    }
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9]/g, "").slice(0, 15);
      if (cleaned !== value) toast.error("Phone can only contain numbers");
      setForm((f) => ({ ...f, phone: cleaned }));
      return;
    }
    if (name === "amount") {
      const cleaned = value.replace(/[^0-9]/g, "");
      setForm((f) => ({ ...f, amount: cleaned }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid loan amount");
      return;
    }
    setLoading(true);
    try {
      await loanService.createLoanApplication({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        amount: Number(form.amount),
      });
      toast.success("Loan application submitted successfully!");
      setSubmitted(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-6 sm:pt-8 pb-10 sm:pb-14">
      <Toaster position="top-right" />
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
          <button
            onClick={openModal}
            className="mt-7 self-start bg-[#7CB93D] hover:bg-[#6FA82C] transition-colors text-white font-semibold text-sm rounded-xl px-6 py-3"
          >
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

      {/* Loan application modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#1E4C8C]/10">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1E4C8C]/10 text-[#1E4C8C] hover:bg-[#EAF1FB] transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EAF6DE] flex items-center justify-center">
                    <Check size={30} className="text-[#6FA82C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E4C8C] mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-slate-500">
                    Our loan team will contact you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#6FA82C] uppercase">
                      Home Loan
                    </span>
                    <h2 className="text-2xl font-bold text-[#1E4C8C] mt-1.5">
                      Apply for Loan
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Fill in your details and our team will reach out to you.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1E4C8C] mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#1E4C8C]/15 bg-[#F7FAFC] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E4C8C] mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#1E4C8C]/15 bg-[#F7FAFC] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E4C8C] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#1E4C8C]/15 bg-[#F7FAFC] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E4C8C] mb-1">
                        Loan Amount (₹) *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="amount"
                        required
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="e.g. 5000000"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#1E4C8C]/15 bg-[#F7FAFC] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D] transition"
                      />
                      {form.amount ? (
                        <p className="text-xs text-slate-500 mt-1.5">
                          {formatInr(Number(form.amount))}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg bg-[#7CB93D] hover:bg-[#6FA82C] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
