import { useState, useEffect } from "react";
import { createBuyerRequirement } from "../../services/lead.service";

export default function LeadPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const shown = sessionStorage.getItem("lead_popup_shown");
    if (!shown) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    sessionStorage.setItem("lead_popup_shown", "true");
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBuyerRequirement(form);
      setSubmitted(true);
      sessionStorage.setItem("lead_popup_shown", "true");
      setTimeout(() => setVisible(false), 2000);
    } catch (err) {
      console.error("Lead submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FFFDF5] rounded-2xl shadow-2xl border border-[#D4AF37]/30">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#2B2D2E]/10 text-[#2B2D2E] hover:bg-[#D4AF37]/20 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2B2D2E] mb-2">Thank You!</h3>
              <p className="text-[#6B6E6F]">Our team will contact you shortly.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2B2D2E]">Find Your Dream Property</h2>
                <p className="text-sm text-[#6B6E6F] mt-1">Tell us what you're looking for and we'll get back to you.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#2B2D2E] mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 bg-white text-[#2B2D2E] placeholder:text-[#6B6E6F]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#2B2D2E] mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 bg-white text-[#2B2D2E] placeholder:text-[#6B6E6F]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#2B2D2E] mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 bg-white text-[#2B2D2E] placeholder:text-[#6B6E6F]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-[#D4AF37] hover:bg-[#C5A028] text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Requirements"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
