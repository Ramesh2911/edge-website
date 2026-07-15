import { useState } from "react";
import {
    Phone,
    MessageCircle,
    Mail,
    BadgeCheck,
    Loader2,
    CheckCircle2,
} from "lucide-react";

// ============================================================
// PropertyContact
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
//                   (e.g. to log a lead or check auth). If omitted, the number
//                   shows immediately on click.

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
        message: `Hi, I'm interested in ${propertyTitle}. Please share more details.`,
    });

    const {
        name = "Property Consultant",
        role = "Agent",
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
        } finally {
            setSubmitting(false);
        }
    };

    const whatsappHref = whatsapp
        ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
            `Hi, I'm interested in ${propertyTitle}.`
        )}`
        : null;

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 shadow-sm p-5 sm:p-6 sticky top-4">
            {/* Agent / Owner identity */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gold-light/40 flex items-center justify-center overflow-hidden shrink-0">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-display text-lg text-gold-dark font-semibold">
                            {name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-semibold text-charcoal-deep truncate">
                        {name}
                        {verified && <BadgeCheck size={14} className="text-blue-600 shrink-0" />}
                    </p>
                    <p className="text-xs text-stone">
                        {role}
                        {propertiesListed != null ? ` · ${propertiesListed} listings` : ""}
                    </p>
                </div>
            </div>

            {/* Quick contact actions */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                    type="button"
                    onClick={handleRevealPhone}
                    disabled={revealing}
                    className="flex items-center justify-center gap-1.5 bg-charcoal-deep hover:bg-charcoal text-cream text-sm font-semibold rounded-xl px-3 py-3 transition-colors disabled:opacity-70"
                >
                    {revealing ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <Phone size={15} />
                    )}
                    {phoneRevealed && phone ? phone : "Show Number"}
                </button>

                {whatsappHref ? (
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl px-3 py-3 transition-colors"
                    >
                        <MessageCircle size={15} />
                        WhatsApp
                    </a>
                ) : (
                    <a
                        href={email ? `mailto:${email}` : "#"}
                        className="flex items-center justify-center gap-1.5 bg-cream-deep hover:bg-gold-light/30 text-charcoal-deep text-sm font-semibold rounded-xl px-3 py-3 transition-colors"
                    >
                        <Mail size={15} />
                        Email
                    </a>
                )}
            </div>

            {/* Lead form */}
            {submitted ? (
                <div className="flex flex-col items-center text-center py-6">
                    <CheckCircle2 size={32} className="text-green-600 mb-3" />
                    <p className="text-sm font-semibold text-charcoal-deep">Message sent</p>
                    <p className="text-xs text-stone mt-1">
                        {name.split(" ")[0]} will get back to you shortly.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <p className="text-sm font-semibold text-charcoal-deep">Send a Message</p>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="w-full border border-charcoal/15 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="w-full border border-charcoal/15 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email (optional)"
                        className="w-full border border-charcoal/15 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-charcoal/15 rounded-lg px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold text-sm rounded-xl py-3 transition-colors disabled:opacity-70"
                    >
                        {submitting && <Loader2 size={15} className="animate-spin" />}
                        {submitting ? "Sending..." : "Send Message"}
                    </button>
                </form>
            )}
        </div>
    );
}