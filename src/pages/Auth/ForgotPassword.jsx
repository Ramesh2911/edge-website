import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Phone,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    ShieldCheck,
    KeyRound,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

import authService from "../../services/auth.service";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

// ============================================================
// Static data
// ============================================================

const COUNTRY_CODES = [
    { code: "+91", country: "India", flag: "🇮🇳" }
];

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const STEPS = {
    MOBILE: "mobile",
    OTP: "otp",
    RESET: "reset",
    SUCCESS: "success",
};

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState(STEPS.MOBILE);
    const [submitting, setSubmitting] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [country, setCountry] = useState(COUNTRY_CODES[0]);
    const [mobileNumber, setMobileNumber] = useState("");
    const [resetToken, setResetToken] = useState(null);

    // --------------------------------------------------------
    // STEP 1 — Mobile number form
    // --------------------------------------------------------
    const {
        register: registerMobile,
        handleSubmit: handleMobileSubmit,
        formState: { errors: mobileErrors },
    } = useForm({ mode: "onTouched" });

    const requestOtp = async (data) => {
        setSubmitting(true);
        try {
            const fullMobile = `${country.code}${data.mobile}`;
            await authService.requestOtp({ mobile: fullMobile });
            setMobileNumber(fullMobile);
            toast.success(`OTP sent to ${fullMobile}`);
            setStep(STEPS.OTP);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Couldn't send OTP. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // --------------------------------------------------------
    // STEP 2 — OTP verification
    // --------------------------------------------------------
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [otpError, setOtpError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const otpRefs = useRef([]);

    useEffect(() => {
        if (step !== STEPS.OTP) return;
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [step, secondsLeft]);

    useEffect(() => {
        if (step === STEPS.OTP) {
            setOtp(Array(OTP_LENGTH).fill(""));
            setSecondsLeft(RESEND_SECONDS);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }
    }, [step]);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        setOtpError("");
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((digit, i) => (next[i] = digit));
        setOtp(next);
        otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const verifyOtp = async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            setOtpError("Please enter the complete 6-digit code");
            return;
        }

        setSubmitting(true);
        try {
            const res = await authService.verifyOtp({
                mobile: mobileNumber,
                otp: code,
            });
            setResetToken(res.data?.resetToken || null);
            toast.success("OTP verified");
            setStep(STEPS.RESET);
        } catch (err) {
            setOtpError(err?.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setSubmitting(false);
        }
    };

    const resendOtp = useCallback(async () => {
        if (secondsLeft > 0) return;
        setSubmitting(true);
        try {
            await authService.requestOtp({ mobile: mobileNumber });
            toast.success("A new OTP has been sent");
            setOtp(Array(OTP_LENGTH).fill(""));
            setSecondsLeft(RESEND_SECONDS);
            otpRefs.current[0]?.focus();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Couldn't resend OTP. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }, [secondsLeft, mobileNumber]);

    // --------------------------------------------------------
    // STEP 3 — Reset password form
    // --------------------------------------------------------
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register: registerReset,
        handleSubmit: handleResetSubmit,
        watch,
        formState: { errors: resetErrors },
    } = useForm({ mode: "onTouched" });

    const newPassword = watch("newPassword");

    const resetPassword = async (data) => {
        setSubmitting(true);
        try {
            await authService.resetPassword({
                mobile: mobileNumber,
                resetToken,
                newPassword: data.newPassword,
            });
            toast.success("Password reset successfully");
            setStep(STEPS.SUCCESS);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Couldn't reset your password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // --------------------------------------------------------
    // Step meta (for the progress indicator)
    // --------------------------------------------------------
    const stepIndex = { [STEPS.MOBILE]: 0, [STEPS.OTP]: 1, [STEPS.RESET]: 2, [STEPS.SUCCESS]: 3 }[step];

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* ================================================================
          LEFT PANEL — brand / illustration (hidden on mobile)
      ================================================================ */}
            <div className="hidden lg:flex relative flex-col justify-between bg-gradient-to-br from-[#153964] to-[#1E4C8C] overflow-hidden px-12 py-12">
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
                        Let's get you back in.
                    </h1>
                    <p className="text-white/70 text-sm mt-4 max-w-sm leading-relaxed">
                        Verify your mobile number and you'll have a new password set up in under a minute.
                    </p>

                    <div className="flex flex-col gap-4 mt-10">
                        {[
                            { icon: ShieldCheck, text: "Your number is only used for verification" },
                            { icon: KeyRound, text: "One-time code, expires automatically" },
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
          RIGHT PANEL — form
      ================================================================ */}
            <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-12">
                <div className="w-full max-w-sm mx-auto animate-fade-in-up" key={step}>
                    {/* Mobile-only logo */}
                    <a href="/" className="flex lg:hidden mb-8">
                        <img src={logo} alt="Edge Mile Realty" className="h-11 w-auto" />
                    </a>

                    {/* Progress indicator */}
                    {step !== STEPS.SUCCESS && (
                        <div className="flex items-center gap-2 mb-7">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full flex-1 transition-colors ${i <= stepIndex ? "bg-[#7CB93D]" : "bg-slate-200"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* ============================================================
              STEP 1 — Mobile number
          ============================================================ */}
                    {step === STEPS.MOBILE && (
                        <>
                            <h2 className="font-display text-2xl sm:text-3xl text-[#153964] font-medium">
                                Forgot your password?
                            </h2>
                            <p className="text-slate-500 text-sm mt-2">
                                Enter your registered mobile number and we'll send you a verification code.
                            </p>

                            <form onSubmit={handleMobileSubmit(requestOtp)} className="mt-7 space-y-5" noValidate>
                                <div>
                                    <label className="block text-sm font-medium text-[#153964] mb-1.5">
                                        Mobile Number
                                    </label>
                                    <div className="flex gap-2">
                                        {/* Country code selector */}
                                        <div className="relative shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setCountryOpen((v) => !v)}
                                                className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium text-[#153964] h-full hover:border-[#8BC53F] transition-colors"
                                            >
                                                <span>{country.flag}</span>
                                                <span>{country.code}</span>
                                                <ChevronDown size={13} className={`transition-transform ${countryOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            {countryOpen && (
                                                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20">
                                                    {COUNTRY_CODES.map((c) => (
                                                        <button
                                                            key={c.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setCountry(c);
                                                                setCountryOpen(false);
                                                            }}
                                                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-[#EAF1FB] transition-colors"
                                                        >
                                                            <span>{c.flag}</span>
                                                            <span className="text-[#153964]">{c.country}</span>
                                                            <span className="text-slate-400 ml-auto">{c.code}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile input */}
                                        <div className="relative flex-1">
                                            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="tel"
                                                autoComplete="tel-national"
                                                placeholder="98765 43210"
                                                {...registerMobile("mobile", {
                                                    required: "Mobile number is required",
                                                    pattern: { value: MOBILE_PATTERN, message: "Enter a valid 10-digit mobile number" },
                                                })}
                                                className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${mobileErrors.mobile
                                                    ? "border-red-400 focus:ring-red-200"
                                                    : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    {mobileErrors.mobile && (
                                        <p className="text-red-500 text-xs mt-1.5">{mobileErrors.mobile.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={submitting}
                                >
                                    {submitting ? "Sending code..." : "Send Verification Code"}
                                </Button>
                            </form>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#153964] mt-6"
                            >
                                <ArrowLeft size={14} />
                                Back to Sign In
                            </Link>
                        </>
                    )}

                    {/* ============================================================
              STEP 2 — OTP verification
          ============================================================ */}
                    {step === STEPS.OTP && (
                        <>
                            <h2 className="font-display text-2xl sm:text-3xl text-[#153964] font-medium">
                                Enter verification code
                            </h2>
                            <p className="text-slate-500 text-sm mt-2">
                                We've sent a 6-digit code to <span className="font-medium text-[#153964]">{mobileNumber}</span>
                            </p>

                            <div className="mt-7">
                                <div className="flex gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => (otpRefs.current[i] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className={`w-full aspect-square text-center text-lg font-semibold border rounded-xl focus:outline-none focus:ring-2 transition-colors ${otpError
                                                ? "border-red-400 focus:ring-red-200"
                                                : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
                                                }`}
                                        />
                                    ))}
                                </div>
                                {otpError && <p className="text-red-500 text-xs mt-2">{otpError}</p>}

                                <Button
                                    type="button"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={submitting}
                                    onClick={verifyOtp}
                                    className="mt-6"
                                >
                                    {submitting ? "Verifying..." : "Verify Code"}
                                </Button>

                                <div className="flex items-center justify-center gap-1.5 text-sm mt-5">
                                    <span className="text-slate-500">Didn't receive the code?</span>
                                    {secondsLeft > 0 ? (
                                        <span className="font-semibold text-[#153964]">
                                            Resend in {secondsLeft}s
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={resendOtp}
                                            className="font-semibold text-[#1E4C8C] hover:text-[#7CB93D]"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(STEPS.MOBILE)}
                                className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#153964] mt-6 mx-auto"
                            >
                                <ArrowLeft size={14} />
                                Change mobile number
                            </button>
                        </>
                    )}

                    {/* ============================================================
              STEP 3 — Reset password
          ============================================================ */}
                    {step === STEPS.RESET && (
                        <>
                            <h2 className="font-display text-2xl sm:text-3xl text-[#153964] font-medium">
                                Set a new password
                            </h2>
                            <p className="text-slate-500 text-sm mt-2">
                                Choose a strong password you haven't used before.
                            </p>

                            <form onSubmit={handleResetSubmit(resetPassword)} className="mt-7 space-y-5" noValidate>
                                <div>
                                    <label className="block text-sm font-medium text-[#153964] mb-1.5">New Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                            {...registerReset("newPassword", {
                                                required: "New password is required",
                                                minLength: { value: 8, message: "Password must be at least 8 characters" },
                                            })}
                                            className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${resetErrors.newPassword
                                                ? "border-red-400 focus:ring-red-200"
                                                : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                    {resetErrors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1.5">{resetErrors.newPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#153964] mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Re-enter new password"
                                            {...registerReset("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: (value) => value === newPassword || "Passwords do not match",
                                            })}
                                            className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${resetErrors.confirmPassword
                                                ? "border-red-400 focus:ring-red-200"
                                                : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                    {resetErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1.5">{resetErrors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={submitting}
                                >
                                    {submitting ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    )}

                    {/* ============================================================
              STEP 4 — Success
          ============================================================ */}
                    {step === STEPS.SUCCESS && (
                        <div className="flex flex-col items-center text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-[#7CB93D]/10 flex items-center justify-center mb-5">
                                <CheckCircle2 size={30} className="text-[#7CB93D]" />
                            </div>
                            <h2 className="font-display text-2xl text-[#153964] font-medium">
                                Password Reset
                            </h2>
                            <p className="text-slate-500 text-sm mt-2 max-w-xs">
                                Your password has been updated successfully. You can now sign in with your new password.
                            </p>
                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => navigate("/login")}
                                className="mt-7"
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out both;
        }
      `}</style>
        </div>
    );
}