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
    Camera,
    X,
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
    const [profileImage, setProfileImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [imageError, setImageError] = useState("");

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
    // Profile image handling
    // --------------------------------------------------------
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Please select a valid image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setImageError("Image must be under 5MB");
            return;
        }

        setImageError("");
        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setProfileImage(null);
        setProfilePreview(null);
    };

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
            if (profileImage) formData.append("profileImage", profileImage);

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
            <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-12">
                <div className="w-full max-w-xl mx-auto animate-fade-in-up">
                    {/* Mobile-only logo */}
                    <a href="/" className="flex lg:hidden mb-8">
                        <img src={logo} alt="Edge Mile Realty" className="h-11 w-auto" />
                    </a>

                    <h2 className="font-display text-2xl sm:text-3xl text-[#153964] font-medium">
                        Create your account
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        Fill in your details to get started
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-7" noValidate>
                        {/* ============== Role selection ============== */}
                        <div>
                            <label className="block text-sm font-semibold text-[#153964] mb-3">
                                I am a...
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map(({ value, label, icon: Icon, desc }) => (
                                    <label
                                        key={value}
                                        className={`flex items-start gap-2.5 border rounded-xl px-3.5 py-3 cursor-pointer transition-colors ${selectedRole === value
                                            ? "border-[#7CB93D] bg-[#7CB93D]/10"
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

                        {/* ============== Profile image upload ============== */}
                        <div>
                            <label className="block text-sm font-semibold text-[#153964] mb-3">
                                Profile Photo <span className="font-normal text-slate-500">(optional)</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-full bg-[#EAF1FB] border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {profilePreview ? (
                                        <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={22} className="text-slate-400" />
                                    )}
                                </div>

                                <label className="flex items-center gap-2 border border-slate-200 hover:border-[#8BC53F] rounded-lg px-4 py-2.5 text-sm font-medium text-[#153964] cursor-pointer transition-colors">
                                    <Camera size={15} />
                                    {profilePreview ? "Change Photo" : "Upload Photo"}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>

                                {profilePreview && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        aria-label="Remove photo"
                                        className="w-8 h-8 rounded-full bg-[#EAF1FB] hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                            {imageError && <p className="text-red-500 text-xs mt-2">{imageError}</p>}
                        </div>

                        {/* ============== Basic details ============== */}
                        <div className="grid sm:grid-cols-2 gap-5">
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
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.fullName ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.email ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.mobile ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.password ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                        className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                            <div className="grid sm:grid-cols-2 gap-5 bg-[#EAF1FB]/60 rounded-xl p-4 sm:p-5 animate-fade-in-up">
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
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${errors.companyName ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${errors.reraNumber ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Street address"
                                            {...register("address", { required: "Address is required" })}
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.address ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.city ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.state ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.country ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${errors.pincode ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-[#8BC53F] focus:border-[#8BC53F]"
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
                        >
                            {submitting ? "Creating your account..." : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-7">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#1E4C8C] hover:text-[#7CB93D]">
                            Sign in
                        </Link>
                    </p>
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
      `}</style>
        </div>
    );
}