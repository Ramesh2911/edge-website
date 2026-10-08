import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Building2,
    Briefcase,
    KeyRound,
    MapPin,
    Landmark,
    Globe2,
    Hash,
    UserCheck,
    Building,
    UserSquare2,
} from "lucide-react";

import authService from "../../services/auth.service";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

// ============================================================
// Static option sets
// ============================================================

const ROLES = [
    { value: "buyer", label: "Buyer / Tenant", icon: UserSquare2, desc: "Looking to buy or rent" },
    { value: "owner", label: "Owner", icon: UserCheck, desc: "Listing my own property" },
    { value: "broker", label: "Broker", icon: Briefcase, desc: "I represent buyers & sellers" },
    { value: "developer", label: "Developer", icon: Building, desc: "I build & sell projects" },
];

const COMPANY_ROLES = ["broker", "developer"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const PINCODE_PATTERN = /^\d{6}$/;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            role: "buyer",
            fullName: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
            companyName: "",
            reraNumber: "",
            address: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",
        },
    });

    const selectedRole = watch("role");
    const password = watch("password");
    const requiresCompanyFields = COMPANY_ROLES.includes(selectedRole);

    // --------------------------------------------------------
    // Submit
    // --------------------------------------------------------
    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "confirmPassword") return;
                formData.append(key, value ?? "");
            });

            const res = await authService.register(formData);
            const { user, token } = res.data;

            login(user, token);

            toast.success(`Welcome to Edge Mile Realty, ${data.fullName.split(" ")[0]}!`);
            navigate("/");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "We couldn't create your account. Please check your details and try again.";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-[100dvh] overflow-hidden grid grid-rows-[minmax(0,1fr)] lg:grid-cols-2 bg-white">
            {/* ================================================================
          LEFT PANEL — brand / illustration (hidden on mobile)
      ================================================================ */}
            <div className="hidden lg:flex relative flex-col justify-between bg-gradient-to-br from-[#153964] to-[#1E4C8C] overflow-hidden px-10 xl:px-12 py-10">
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.08]"
                    viewBox="0 0 600 800"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                >
                    <circle cx="480" cy="120" r="220" stroke="#8BC53F" strokeWidth="1" />
                    <circle cx="480" cy="120" r="160" stroke="#8BC53F" strokeWidth="1" />
                    <circle cx="60" cy="700" r="180" stroke="#8BC53F" strokeWidth="1" />
                    <path d="M0 620 L120 520 L220 580 L340 460 L460 540 L600 440" stroke="#8BC53F" strokeWidth="1.5" />
                    <path d="M0 700 L140 600 L260 660 L380 540 L500 620 L600 520" stroke="#8BC53F" strokeWidth="1.5" />
                </svg>

                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#8BC53F]/15 blur-3xl" aria-hidden="true" />

                <a href="/" className="relative animate-fade-in-up">
                    <div className="inline-flex bg-white rounded-2xl px-4 py-3 shadow-lg">
                        <img src={logo} alt="Edge Mile Realty" className="h-12 w-auto" />
                    </div>
                </a>

                <div className="relative animate-fade-in-up [animation-delay:120ms]">
                    <h1 className="font-display text-4xl xl:text-[2.75rem] text-white font-medium leading-tight max-w-md">
                        Join thousands finding their perfect place.
                    </h1>
                    <p className="text-white/70 text-sm mt-4 max-w-sm leading-relaxed">
                        Whether you're buying your first home or listing your tenth project, your account
                        keeps everything organized in one place.
                    </p>

                    <div className="flex flex-col gap-4 mt-10">
                        {[
                            { icon: UserCheck, text: "Personalized recommendations from day one" },
                            { icon: Building2, text: "List and manage properties effortlessly" },
                            { icon: KeyRound, text: "Your data stays private and secure" },
                        ].map(({ icon: Icon, text }, i) => (
                            <div
                                key={text}
                                className="flex items-center gap-3 animate-fade-in-up"
                                style={{ animationDelay: `${200 + i * 90}ms` }}
                            >
                                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon size={16} className="text-[#8BC53F]" />
                                </span>
                                <span className="text-sm text-white/85">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-white/40 text-xs animate-fade-in-up [animation-delay:500ms]">
                    © {new Date().getFullYear()} Edge Mile Realty. All Rights Reserved.
                </p>
            </div>

            {/* ================================================================
          RIGHT PANEL — registration form
      ================================================================ */}
            <div className="auth-scroll relative flex flex-col overflow-y-auto overflow-x-hidden min-h-0 px-6 sm:px-10 lg:px-12 xl:px-24 bg-gradient-to-br from-[#F7FAFC] via-white to-[#EAF6DE]/40">
                {/* Soft decorative glows (kept inside vertical bounds to avoid phantom scroll) */}
                <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#7CB93D]/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-[#1E4C8C]/10 blur-3xl" aria-hidden="true" />

                <div className="relative w-full max-w-xl mx-auto min-h-full shrink-0 flex flex-col justify-center py-6 animate-fade-in-up">
                    {/* Mobile-only logo */}
                    <a href="/" className="auth-logo flex lg:hidden justify-center mb-4">
                        <img src={logo} alt="Edge Mile Realty" className="h-11 w-auto" />
                    </a>

                    <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#6FA82C]">
                        Edge Mile Realty
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-[#153964] font-medium text-center mt-1.5">
                        Create your account
                    </h2>
                    <p className="text-slate-500 text-sm mt-1.5 text-center">
                        Fill in your details to get started
                    </p>

                    {/* Form card */}
                    <div className="auth-card mt-5 shrink-0 bg-white rounded-3xl border border-slate-200/70 shadow-lift p-5 sm:p-6 relative overflow-hidden">
                        {/* Card top accent */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 rounded-b-full bg-gradient-to-r from-[#1E4C8C] via-[#7CB93D] to-[#1E4C8C]" aria-hidden="true" />

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5" noValidate>
                        {/* ============== Role selection ============== */}
                        <div>
                            <label className="block text-sm font-semibold text-[#153964] mb-3">
                                I am a...
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map(({ value, label, icon: Icon, desc }) => (
                                    <label
                                        key={value}
                                        className={`flex items-start gap-2.5 border rounded-xl px-3 py-2.5 cursor-pointer transition-all ${selectedRole === value
                                            ? "border-[#7CB93D] bg-[#7CB93D]/10 shadow-sm"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={value}
                                            {...register("role", { required: true })}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedRole === value ? "bg-[#7CB93D] text-white" : "bg-[#EAF1FB] text-[#153964]"
                                                }`}
                                        >
                                            <Icon size={15} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold text-[#153964]">{label}</span>
                                            <span className="block text-xs text-slate-500 leading-snug">{desc}</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* ============== Basic details ============== */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-[#153964] mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Your full name"
                                        {...register("fullName", {
                                            required: "Full name is required",
                                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                                        })}
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.fullName ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                            }`}
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#153964] mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
                                        })}
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                            }`}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#153964] mb-1.5">Mobile Number</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="98765 43210"
                                        {...register("mobile", {
                                            required: "Mobile number is required",
                                            pattern: { value: MOBILE_PATTERN, message: "Enter a valid 10-digit mobile number" },
                                        })}
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.mobile ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                            }`}
                                    />
                                </div>
                                {errors.mobile && <p className="text-red-500 text-xs mt-1.5">{errors.mobile.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#153964] mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                                        })}
                                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#153964]"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#153964] mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Re-enter your password"
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) => value === password || "Passwords do not match",
                                        })}
                                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#153964]"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        {/* ============== Conditional: Broker / Developer fields ============== */}
                        {requiresCompanyFields && (
                            <div className="grid sm:grid-cols-2 gap-4 bg-[#EAF1FB]/60 rounded-xl p-4 sm:p-5 animate-fade-in-up">
                                <div className="sm:col-span-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#7CB93D] mb-1">
                                        {selectedRole === "developer" ? "Developer" : "Brokerage"} Details
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#153964] mb-1.5">Company Name</label>
                                    <div className="relative">
                                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Your company name"
                                            {...register("companyName", {
                                                required: requiresCompanyFields ? "Company name is required" : false,
                                            })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${errors.companyName ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.companyName && (
                                        <p className="text-red-500 text-xs mt-1.5">{errors.companyName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#153964] mb-1.5">RERA Number</label>
                                    <div className="relative">
                                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="e.g. WB/RERA/2026/00123"
                                            {...register("reraNumber", {
                                                required: requiresCompanyFields ? "RERA number is required" : false,
                                            })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${errors.reraNumber ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.reraNumber && (
                                        <p className="text-red-500 text-xs mt-1.5">{errors.reraNumber.message}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ============== Address details ============== */}
                        <div>
                            <p className="text-sm font-semibold text-[#153964] mb-3">Address</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Street address"
                                            {...register("address", { required: "Address is required" })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.address ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Landmark size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="City"
                                            {...register("city", { required: "City is required" })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.city ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Landmark size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="State"
                                            {...register("state", { required: "State is required" })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.state ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.state && <p className="text-red-500 text-xs mt-1.5">{errors.state.message}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Globe2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            {...register("country", { required: "Country is required" })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.country ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.country && <p className="text-red-500 text-xs mt-1.5">{errors.country.message}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Pincode"
                                            {...register("pincode", {
                                                required: "Pincode is required",
                                                pattern: { value: PINCODE_PATTERN, message: "Enter a valid 6-digit pincode" },
                                            })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.pincode ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                                }`}
                                        />
                                    </div>
                                    {errors.pincode && <p className="text-red-500 text-xs mt-1.5">{errors.pincode.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={submitting}
                            className="shadow-lg shadow-[#1E4C8C]/30 hover:shadow-xl hover:shadow-[#1E4C8C]/40"
                        >
                            {submitting ? "Creating your account..." : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#1E4C8C] hover:text-[#7CB93D] transition-colors">
                            Sign in
                        </Link>
                    </p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        /* Slim visible scrollbar so long form stays discoverable */
        .auth-scroll {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }
        .auth-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .auth-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .auth-scroll::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 999px;
        }
        .auth-scroll::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
        </div>
    );
}