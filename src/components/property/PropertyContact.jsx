import { useState } from "react";
import {
    Loader2,
    CheckCircle2,
    Send,
} from "lucide-react";

// ============================================================
// PropertyContact — simple enquiry form (right sticky column)
// ============================================================

export default function PropertyContact({
    contact = {},
    propertyTitle = "this property",
    onSubmit,
}) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [consent, setConsent] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });

    const { name = "our team" } = contact;

    const handleChange = (e) => {
        const { name: field, value } = e.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) return;
        if (!consent) return;
        setSubmitting(true);
        try {
            await onSubmit?.({ ...formData, consent });
            setSubmitted(true);
        } catch {
            // error already surfaced by onSubmit (toast) — keep the form open
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls =
        "w-full border border-charcoal/12 rounded-xl px-4 py-3 text-sm bg-cream-deep/40 placeholder:text-stone/70 focus:outline-none focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all";

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-lift overflow-hidden lg:sticky lg:top-24">
            <div className="px-5 sm:px-6 pt-6 pb-6">
                {submitted ? (
                    <div className="flex flex-col items-center text-center py-8">
                        <span className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                            <CheckCircle2 size={28} className="text-green-600" />
                        </span>
                        <p className="text-base font-semibold text-charcoal-deep">
                            Message sent
                        </p>
                        <p className="text-xs text-stone mt-1.5 max-w-[220px]">
                            {String(name).split(" ")[0]} will get back to you shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-charcoal-deep">
                                Send an Enquiry
                            </p>
                            <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">
                                Free
                            </span>
                        </div>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className={inputCls}
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            maxLength={15}
                            required
                            className={inputCls}
                        />

                        <label className="flex items-start gap-2.5 cursor-pointer select-none pt-0.5">
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                required
                                className="mt-0.5 w-4 h-4 shrink-0 accent-[#1E4C8C] cursor-pointer"
                            />
                            <span className="text-[11px] text-stone leading-relaxed">
                                I authorise Edge Mile Realty &amp; its representatives to
                                contact me with updates and notifications via
                                Email/SMS/WhatsApp/Call. This will override on DND/NDNC.{" "}
                                <a
                                    href="/contact"
                                    className="underline text-charcoal-deep font-medium hover:text-gold-dark"
                                >
                                    Know More
                                </a>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={submitting || !consent}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold-dark text-white font-semibold text-sm rounded-xl py-3.5 shadow-card transition-all disabled:opacity-70 active:scale-[0.98]"
                        >
                            {submitting ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )}
                            {submitting ? "Sending..." : "Send Message"}
                        </button>

                        <p className="text-[11px] text-stone text-center leading-relaxed">
                            Your contact details stay private and are only shared
                            with the listed agent.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
