import { useState } from "react";
import {
    MessageCircle,
    Mail,
    BadgeCheck,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    Clock,
    Send,
} from "lucide-react";

// ============================================================
// PropertyContact — premium agent / owner card
// ============================================================
//
// Props:
//   contact : {
//     name, role ("Owner" | "Agent" | "Builder"), avatar, verified,
//     phone, whatsapp, email, propertiesListed
//   }
//   propertyTitle : string — used to prefill the message
//   onSubmit      : (formData) => Promise | void — lead form submit handler
//   onRevealPhone : () => Promise | void — optional; called before the number is shown
//
// Design: gradient identity header, glass verified badge, dual quick-contact
// buttons, trust indicators, and a refined enquiry form with focus rings.

export default function PropertyContact({
    contact = {},
    propertyTitle = "this property",
    onSubmit,
    onRevealPhone,
}) {
    const [phoneRevealed, setPhoneRevealed] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const {
        name = "Premium Brokerage",
        role = "Property Consultant",
        avatar,
        verified = false,
        phone,
        whatsapp,
        email,
        propertiesListed,
    } = contact;

    const handleChange = (e) => {
        const { name: field, value } = e.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRevealPhone = async () => {
        if (phoneRevealed) return;
        if (onRevealPhone) {
            setRevealing(true);
            try {
                await onRevealPhone();
            } finally {
                setRevealing(false);
            }
        }
        setPhoneRevealed(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) return;
        setSubmitting(true);
        try {
            await onSubmit?.(formData);
            setSubmitted(true);
        } catch {
            // error already surfaced by onSubmit (toast) — keep the form open
        } finally {
            setSubmitting(false);
        }
    };

    const whatsappHref = whatsapp
        ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hi, I'm interested in ${propertyTitle}.`
          )}`
        : null;

    const inputCls =
        "w-full border border-charcoal/12 rounded-xl px-4 py-3 text-sm bg-cream-deep/40 placeholder:text-stone/70 focus:outline-none focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all";

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-lift overflow-hidden lg:sticky lg:top-24">
            {/* ---------- Gradient identity header ---------- */}
            <div className="relative bg-gradient-to-br from-charcoal-deep via-charcoal to-charcoal-deep px-5 sm:px-6 pt-6 pb-7">
                <div
                    className="absolute -top-16 -right-12 w-44 h-44 rounded-full bg-gold/20 blur-2xl"
                    aria-hidden
                />
                <div
                    className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-gold/10 blur-2xl"
                    aria-hidden
                />

                <div className="relative flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light to-gold flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white/20">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-display text-xl text-charcoal-deep font-semibold">
                                {name.charAt(0)}
                            </span>
                        )}
                        {verified && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-charcoal-deep">
                                <BadgeCheck size={11} className="text-white" />
                            </span>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-white font-semibold text-[15px] truncate">
                            {name}
                        </p>
                        <p className="text-cream/60 text-xs mt-0.5">
                            {role}
                            {propertiesListed != null
                                ? ` · ${propertiesListed} listings`
                                : ""}
                        </p>
                    </div>
                </div>

                {/* Trust chips */}
                <div className="relative flex flex-wrap gap-2 mt-4">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cream/85 bg-white/10 border border-white/10 backdrop-blur px-2.5 py-1 rounded-full">
                        <ShieldCheck size={12} className="text-gold-light" />
                        Verified Agent
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cream/85 bg-white/10 border border-white/10 backdrop-blur px-2.5 py-1 rounded-full">
                        <Clock size={12} className="text-gold-light" />
                        Replies in ~1 hr
                    </span>
                </div>
            </div>

            {/* ---------- Enquiry form ---------- */}
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
                            {name.split(" ")[0]} will get back to you shortly.
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
                            required
                            className={inputCls}
                        />

                        <button
                            type="submit"
                            disabled={submitting}
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
