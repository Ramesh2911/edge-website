import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    BadgeCheck,
    Building2,
} from "lucide-react";
import authService from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginMode, setLoginMode] = useState("email"); // "email" | "mobile"
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            identifier: "",
            password: "",
            rememberMe: false,
        },
    });

    // --------------------------------------------------------
    // Submit
    // --------------------------------------------------------
    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            const payload = {
                [loginMode === "email" ? "email" : "mobile"]: data.identifier.trim(),
                password: data.password,
            };

            const res = await authService.login(payload);

            const { token, user } = res.data.data;

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user.role_name);

            // Auth Context
            login(user, token);

            toast.success(`Welcome back, ${user.full_name}!`);

            reset();

            switch (user.role_name) {
                case "Owner":
                    navigate("/dashboard");
                    break;

                case "Broker":
                    navigate("/dashboard");
                    break;

                case "Developer":
                    navigate("/dashboard");
                    break;

                case "Buyer":
                    navigate("/dashboard");
                    break;

                default:
                    navigate("/");
            }

        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "We couldn't sign you in. Please check your details and try again.";

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSocialLogin = (provider) => {
        toast(`${provider} login is coming soon`, { icon: "🚧" });
    };

    return (
        <div className="h-[100dvh] overflow-hidden grid grid-rows-[minmax(0,1fr)] lg:grid-cols-2 bg-white">
            {/* ================================================================
          LEFT PANEL — brand / illustration (hidden on mobile)
      ================================================================ */}
            <div className="hidden lg:flex relative flex-col justify-between bg-gradient-to-br from-[#153964] to-[#1E4C8C] overflow-hidden px-10 xl:px-12 py-10">
                {/* Background illustration */}
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

                <div
                    className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#8BC53F]/15 blur-3xl"
                    aria-hidden="true"
                />

                {/* Logo */}
                <a href="/" className="relative animate-fade-in-up">
                    <div className="inline-flex bg-white rounded-2xl px-4 py-3 shadow-lg">
                        <img src={logo} alt="Edge Mile Realty" className="h-12 w-auto" />
                    </div>
                </a>

                {/* Headline + feature list */}
                <div className="relative animate-fade-in-up [animation-delay:120ms]">
                    <h1 className="font-display text-4xl xl:text-[2.75rem] text-white font-medium leading-tight max-w-md">
                        Find a home that feels like you.
                    </h1>
                    <p className="text-white/70 text-sm mt-4 max-w-sm leading-relaxed">
                        Sign in to track your saved properties, manage site visits, and pick up right where
                        you left off.
                    </p>

                    <div className="flex flex-col gap-4 mt-10">
                        {[
                            { icon: BadgeCheck, text: "100% verified listings, every time" },
                            { icon: Building2, text: "12,000+ premium homes across India" },
                            { icon: ShieldCheck, text: "Secure, encrypted account access" },
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
          RIGHT PANEL — login form
      ================================================================ */}
            <div className="auth-tight relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar min-h-0 px-6 sm:px-10 lg:px-12 xl:px-24 py-6 bg-gradient-to-br from-[#F7FAFC] via-white to-[#EAF6DE]/40">
                {/* Soft decorative glows */}
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#7CB93D]/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#1E4C8C]/10 blur-3xl" aria-hidden="true" />

                <div className="relative w-full max-w-[400px] mx-auto my-auto shrink-0 animate-fade-in-up">
                    {/* Mobile-only logo */}
                    <a href="/" className="auth-logo flex lg:hidden justify-center mb-5">
                        <img src={logo} alt="Edge Mile Realty" className="h-11 w-auto" />
                    </a>

                    <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#6FA82C]">
                        Edge Mile Realty
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-[#153964] font-medium text-center mt-1.5">
                        Welcome back
                    </h2>
                    <p className="auth-tagline text-slate-500 text-sm mt-1.5 text-center">
                        Sign in to continue to your account
                    </p>

                    {/* Form card */}
                    <div className="auth-card mt-5 bg-white rounded-3xl border border-slate-200/70 shadow-lift p-5 sm:p-6 relative overflow-hidden">
                        {/* Card top accent */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 rounded-b-full bg-gradient-to-r from-[#1E4C8C] via-[#7CB93D] to-[#1E4C8C]" aria-hidden="true" />
                    {/* Email / Mobile toggle */}
                    <div className="flex bg-[#EAF1FB] rounded-xl p-1">
                        {[
                            { key: "email", label: "Email", icon: Mail },
                            { key: "mobile", label: "Mobile Number", icon: Phone },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setLoginMode(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold rounded-lg py-2.5 transition-colors ${loginMode === key
                                    ? "bg-white text-[#153964] shadow-sm"
                                    : "text-slate-500 hover:text-[#153964]"
                                    }`}
                            >
                                <Icon size={14} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
                        {/* Identifier field */}
                        <div>
                            <label className="block text-sm font-medium text-[#153964] mb-1.5">
                                {loginMode === "email" ? "Email Address" : "Mobile Number"}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    {loginMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
                                </span>
                                <input
                                    type={loginMode === "email" ? "email" : "tel"}
                                    autoComplete={loginMode === "email" ? "email" : "tel"}
                                    placeholder={loginMode === "email" ? "you@example.com" : "98765 43210"}
                                    {...register("identifier", {
                                        required:
                                            loginMode === "email" ? "Email address is required" : "Mobile number is required",
                                        pattern: {
                                            value: loginMode === "email" ? EMAIL_PATTERN : MOBILE_PATTERN,
                                            message:
                                                loginMode === "email"
                                                    ? "Enter a valid email address"
                                                    : "Enter a valid 10-digit mobile number",
                                        },
                                    })}
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.identifier
                                        ? "border-red-400 focus:ring-red-200"
                                        : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
                                        }`}
                                />
                            </div>
                            {errors.identifier && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.identifier.message}</p>
                            )}
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-[#153964] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                                    })}
                                    className={`w-full border rounded-xl pl-10 pr-11 py-2.5 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:ring-2 transition-all ${errors.password
                                        ? "border-red-400 focus:ring-red-200"
                                        : "border-slate-200 focus:ring-[#7CB93D]/40 focus:border-[#7CB93D]"
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
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Remember me / Forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-[#153964] cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    {...register("rememberMe")}
                                    className="w-4 h-4 rounded border-slate-300 accent-[#7CB93D] focus:ring-[#7CB93D]"
                                />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-[#1E4C8C] hover:text-[#7CB93D] transition-colors"
                            >
                                Forgot Password?
                            </Link>
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
                            {submitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="auth-optional flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#1E4C8C]/20" />
                        <span className="text-xs text-slate-400">or continue with</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#1E4C8C]/20" />
                    </div>

                    {/* Social login placeholders */}
                    <div className="auth-optional grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("Google")}
                            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-[#8BC53F] hover:bg-[#EAF1FB] rounded-xl py-2.5 text-sm font-medium text-[#153964] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-2.98c-1.08.72-2.45 1.15-4.05 1.15-3.12 0-5.76-2.1-6.7-4.93H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.3 14.34A7.16 7.16 0 0 1 4.9 12c0-.81.14-1.6.4-2.34V6.57H1.29A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.29 5.43z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.57l4.01 3.09c.94-2.83 3.58-4.89 6.7-4.89z"
                                />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("Facebook")}
                            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-[#8BC53F] hover:bg-[#EAF1FB] rounded-xl py-2.5 text-sm font-medium text-[#153964] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.07C24 5.4 18.6 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-semibold text-[#1E4C8C] hover:text-[#7CB93D] transition-colors">
                            Create one
                        </Link>
                    </p>
                    </div>
                </div>
            </div>

            {/* Entrance animation keyframes + zero-scroll responsive rules */}
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        /* Short viewports: hide optional social section so the form never scrolls */
        @media (max-height: 760px) {
          .auth-optional { display: none !important; }
        }

        /* Very short viewports: compact mode — still no scroll */
        @media (max-height: 660px) {
          .auth-tight { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          .auth-card { padding: 0.75rem !important; margin-top: 0.625rem !important; }
          .auth-logo, .auth-tagline { display: none !important; }
        }

        /* Never allow horizontal overflow anywhere on the page */
        html, body, #root { overflow-x: hidden; }
      `}</style>
        </div>
    );
}