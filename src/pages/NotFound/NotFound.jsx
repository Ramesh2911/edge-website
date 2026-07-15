import { useNavigate, Link } from "react-router-dom";
import { Home, Search, ArrowLeft, MapPinOff } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* ================= Top bar / logo ================= */}
            <div className="px-6 sm:px-10 py-6">
                <Link to="/" className="inline-flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full bg-gold-light flex items-center justify-center">
                        <Home size={18} className="text-charcoal-deep" />
                    </span>
                    <span className="font-display text-lg text-charcoal-deep font-semibold tracking-tight">
                        EDGE MILE REALTY
                    </span>
                </Link>
            </div>

            {/* ================= Main content ================= */}
            <div className="flex-1 relative overflow-hidden flex items-center">
                {/* Background illustration */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
                    viewBox="0 0 1200 800"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                >
                    <circle cx="1000" cy="150" r="260" stroke="#B8894A" strokeWidth="1" />
                    <circle cx="1000" cy="150" r="190" stroke="#B8894A" strokeWidth="1" />
                    <circle cx="120" cy="700" r="220" stroke="#B8894A" strokeWidth="1" />
                    <path d="M0 600 L150 500 L280 570 L420 430 L560 520 L700 400 L900 480 L1200 380" stroke="#B8894A" strokeWidth="1.5" />
                </svg>

                <div
                    className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-gold-light/20 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative max-w-2xl mx-auto text-center px-6 py-16 animate-fade-in-up">
                    {/* 404 mark */}
                    <div className="relative inline-flex items-center justify-center mb-8">
                        <span className="font-display text-[6.5rem] sm:text-[9rem] leading-none font-semibold text-cream-deep select-none">
                            404
                        </span>
                        <span className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-light flex items-center justify-center shadow-sm">
                            <MapPinOff size={28} className="text-charcoal-deep" />
                        </span>
                    </div>

                    <h1 className="font-display text-2xl sm:text-3xl text-charcoal-deep font-medium">
                        This address doesn't exist
                    </h1>
                    <p className="text-stone text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
                        The page you're looking for may have been moved, sold, or the listing has expired.
                        Let's get you back on track.
                    </p>

                    {/* Quick search */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = new FormData(e.currentTarget).get("q");
                            if (query) navigate(`/properties?location=${encodeURIComponent(query)}`);
                        }}
                        className="flex items-center gap-2 max-w-md mx-auto mt-8 bg-cream-deep rounded-xl p-1.5"
                    >
                        <Search size={16} className="text-stone ml-3 shrink-0" />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search properties by city or locality"
                            className="flex-1 bg-transparent text-sm px-1 py-2.5 focus:outline-none placeholder:text-stone"
                        />
                        <button
                            type="submit"
                            className="bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors shrink-0"
                        >
                            Search
                        </button>
                    </form>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 border border-charcoal/15 hover:border-gold text-charcoal-deep font-semibold text-sm rounded-xl px-6 py-3 transition-colors w-full sm:w-auto justify-center"
                        >
                            <ArrowLeft size={15} />
                            Go Back
                        </button>
                        <Link
                            to="/"
                            className="flex items-center gap-2 bg-charcoal-deep hover:bg-charcoal text-cream font-semibold text-sm rounded-xl px-6 py-3 transition-colors w-full sm:w-auto justify-center"
                        >
                            <Home size={15} />
                            Back to Home
                        </Link>
                    </div>

                    {/* Helpful links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-charcoal/5">
                        {[
                            { label: "Buy Property", to: "/buy" },
                            { label: "Rent Property", to: "/rent" },
                            { label: "New Launch", to: "/new-launch" },
                            { label: "Contact Us", to: "/contact" },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-sm text-stone hover:text-gold-dark transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
        </div>
    );
}