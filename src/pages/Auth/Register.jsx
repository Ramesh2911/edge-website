import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Building2,
    KeyRound,
    MapPin,
    Landmark,
    Globe2,
    Hash,
    UserCheck,
    Briefcase,
    Building,
    CheckCircle2,
    ChevronDown,
} from "lucide-react";

import authService from "../../services/auth.service";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

// ============================================================
// Static option sets
// ============================================================

const ROLES = [
    { value: "buyer", label: "Buyer / Seller", icon: UserCheck, desc: "Buy, sell or rent properties" },
    { value: "broker", label: "Broker", icon: Briefcase, desc: "I represent buyers & sellers" },
    { value: "developer", label: "Developer", icon: Building, desc: "I build & sell projects" },
];

const COMPANY_ROLES = ["broker", "developer"];

const ROLE_IDS = { buyer: 7, broker: 5, developer: 6 };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const PINCODE_PATTERN = /^\d{6}$/;
const NAME_PATTERN = /^[A-Za-z\s.'-]+$/;

const COUNTRY_OPTIONS = ["India"];

const INDIA_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal",
];

const STATE_CITIES = {
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"],
    "Chandigarh": ["Chandigarh"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Bhilai", "Korba", "Durg", "Rajnandgaon"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa", "Diu"],
    "Delhi": ["New Delhi"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal", "Rohtak"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Kullu"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Ballari", "Vijayapura"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Kottayam"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Chhatrapati Sambhajinagar", "Kolhapur", "Solapur"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
    "Meghalaya": ["Shillong", "Tura", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailshahar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Bareilly", "Noida", "Ghaziabad"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Kharagpur", "Malda"],
};

export default function RegisterPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
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
    const selectedState = watch("state");
    const password = watch("password");
    const requiresCompanyFields = COMPANY_ROLES.includes(selectedRole);

    const cityOptions = (selectedState && STATE_CITIES[selectedState]) || [];

    // Fields needing custom onChange (digit filtering / dependent reset) — chain RHF's handler
    const mobileField = register("mobile", {
        required: "Mobile number is required",
        pattern: { value: MOBILE_PATTERN, message: "Enter a valid 10-digit mobile number" },
    });
    const pincodeField = register("pincode", {
        validate: (value) =>
            !value || PINCODE_PATTERN.test(value) || "Enter a valid 6-digit pincode",
    });
    const stateField = register("state");

    // Shared input class for premium look
    const inputCls = (hasError) =>
        `w-full border-2 rounded-xl pl-11 pr-3 py-2.5 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${
            hasError
                ? "border-red-400 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15"
        }`;

    const pwInputCls = (hasError) =>
        `w-full border-2 rounded-xl pl-11 pr-10 py-2.5 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${
            hasError
                ? "border-red-400 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15"
        }`;

    const selectCls = (hasError) =>
        `w-full border-2 rounded-xl pl-11 pr-10 py-2.5 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none transition-all appearance-none disabled:opacity-60 disabled:cursor-not-allowed ${
            hasError
                ? "border-red-400 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15"
        }`;

    // --------------------------------------------------------
    // Submit
    // --------------------------------------------------------
    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await authService.register({
                role_id: ROLE_IDS[data.role],
                full_name: data.fullName,
                email: data.email,
                mobile: data.mobile,
                password: data.password,
                company_name: data.companyName,
                rera_number: data.reraNumber,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                pincode: data.pincode,
            });

            toast.success("Registration successful! Please log in.");
            navigate("/login");
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
        <>
            <Toaster position="top-right" />
            <div className="min-h-[100dvh] grid lg:grid-cols-2 overflow-hidden">
            {/* ============================================================
                LEFT PANEL — Brand showcase (hidden on mobile)
            ============================================================ */}
            <div className="hidden lg:flex relative flex-col bg-gradient-to-br from-[#0F2D52] via-[#153964] to-[#1E4C8C] overflow-hidden px-10 xl:px-14 py-8">
                {/* Decorative SVG pattern */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.06]"
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

                {/* Glow orbs */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#7CB93D]/15 blur-3xl" aria-hidden="true" />
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#1E4C8C]/40 blur-3xl" aria-hidden="true" />

                {/* Logo */}
                <a href="/" className="relative z-10 animate-fade-in-up shrink-0">
                    <div className="inline-flex bg-white rounded-2xl px-4 py-3 shadow-lg">
                        <img src={logo} alt="Edge Mile Realty" className="h-12 w-auto" />
                    </div>
                </a>

                {/* Headline + features */}
                <div className="relative z-10 flex-1 flex flex-col justify-center animate-fade-in-up [animation-delay:120ms] max-w-xl py-6">
                    <span className="inline-block w-fit text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F] bg-white/10 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
                        Join Edge Mile Realty
                    </span>
                    <h1 className="font-display text-3xl xl:text-[2.1rem] text-white font-medium leading-snug max-w-md mt-4">
                        Join thousands finding their perfect place.
                    </h1>
                    <p className="text-white/55 text-sm mt-3 max-w-sm leading-relaxed">
                        Whether you're buying your first home or listing your tenth project, your account
                        keeps everything organized in one place.
                    </p>

                    <div className="flex flex-col gap-3 mt-6">
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
                                <span className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                                    <Icon size={15} className="text-[#8BC53F]" />
                                </span>
                                <span className="text-sm text-white/75">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-white/30 text-xs animate-fade-in-up [animation-delay:500ms] shrink-0">
                    © {new Date().getFullYear()} Edge Mile Realty. All Rights Reserved.
                </p>
            </div>

            {/* ============================================================
                RIGHT PANEL — Registration form
            ============================================================ */}
            <div className="auth-scroll relative flex flex-col overflow-y-auto overflow-x-hidden min-h-0 px-6 sm:px-10 lg:px-14 xl:px-20 bg-gradient-to-br from-[#F7FAFC] via-white to-[#EAF6DE]/50">
                {/* Soft decorative glows */}
                <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#7CB93D]/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#1E4C8C]/8 blur-3xl" aria-hidden="true" />

                <div className="relative w-full max-w-xl mx-auto shrink-0 py-8 my-auto animate-fade-in-up">
                    {/* Mobile-only logo */}
                    <a href="/" className="flex lg:hidden justify-center mb-6">
                        <div className="inline-flex bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100">
                            <img src={logo} alt="Edge Mile Realty" className="h-10 w-auto" />
                        </div>
                    </a>

                    {/* Heading */}
                    <div className="text-center mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7CB93D]">
                            Edge Mile Realty
                        </p>
                        <h2 className="font-display text-2xl sm:text-[1.75rem] text-[#153964] font-medium mt-1.5">
                            Create your account
                        </h2>
                        <p className="text-slate-500 text-[13px] mt-1.5">
                            Fill in your details to get started
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="auth-card bg-white rounded-2xl border border-slate-200/60 shadow-[0_16px_48px_-12px_rgba(21,57,100,0.15)] p-5 sm:p-6 relative overflow-hidden">
                        {/* Card top accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#153964] via-[#7CB93D] to-[#1E4C8C]" aria-hidden="true" />

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4" noValidate>
                            {/* ============== Role selection ============== */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#153964] mb-2">
                                    I am a...
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {ROLES.map(({ value, label, icon: Icon, desc }) => {
                                        const active = selectedRole === value;
                                        return (
                                            <label
                                                key={value}
                                                className={`relative flex flex-col items-center text-center gap-1.5 border-2 rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 ${
                                                    active
                                                        ? "border-[#7CB93D] bg-gradient-to-b from-[#7CB93D]/10 to-[#7CB93D]/5 shadow-[0_4px_16px_-4px_rgba(124,185,61,0.3)]"
                                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={value}
                                                    {...register("role", { required: true })}
                                                    className="sr-only"
                                                />

                                                {active && (
                                                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#7CB93D] flex items-center justify-center shadow-md animate-fade-in-up">
                                                        <CheckCircle2 size={12} className="text-white" />
                                                    </span>
                                                )}

                                                <span
                                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                                                        active
                                                            ? "bg-gradient-to-br from-[#7CB93D] to-[#5A9E2B] text-white shadow-md"
                                                            : "bg-[#EAF1FB] text-[#153964]"
                                                    }`}
                                                >
                                                    <Icon size={17} />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-[13px] font-bold text-[#153964]">
                                                        {label}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                                                        {desc}
                                                    </span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ============== Personal details ============== */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-[13px] font-medium text-[#153964] mb-1">
                                        Full Name<span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                        <input
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Your full name"
                                            {...register("fullName", {
                                                required: "Full name is required",
                                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                                pattern: { value: NAME_PATTERN, message: "Full name must contain only letters" },
                                            })}
                                            className={inputCls(errors.fullName)}
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-[#153964] mb-1">
                                        Email Address<span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                        <input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
                                            })}
                                            className={inputCls(errors.email)}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-[#153964] mb-1">
                                        Mobile Number<span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                        <input
                                            type="tel"
                                            autoComplete="tel"
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholder="9876543210"
                                            {...mobileField}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                mobileField.onChange(e);
                                            }}
                                            className={inputCls(errors.mobile)}
                                        />
                                    </div>
                                    {errors.mobile && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.mobile.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-[#153964] mb-1">
                                        Password<span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Create a password"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 8, message: "Password must be at least 8 characters" },
                                            })}
                                            className={pwInputCls(errors.password)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#153964] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-[#153964] mb-1">
                                        Confirm Password<span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Re-enter your password"
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: (value) => value === password || "Passwords do not match",
                                            })}
                                            className={pwInputCls(errors.confirmPassword)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#153964] transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* ============== Conditional: Broker / Developer fields ============== */}
                            {requiresCompanyFields && (
                                <div className="grid sm:grid-cols-2 gap-3 bg-[#EAF1FB]/60 border border-[#1E4C8C]/10 rounded-xl p-4 animate-fade-in-up">
                                    <div className="sm:col-span-2">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7CB93D] mb-1">
                                            {selectedRole === "developer" ? "Developer" : "Brokerage"} Details
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-medium text-[#153964] mb-1">Company Name</label>
                                        <div className="relative">
                                            <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <input
                                                type="text"
                                                placeholder="Your company name"
                                                {...register("companyName")}
                                                className={inputCls(errors.companyName).replace("bg-[#F7FAFC]", "bg-white")}
                                            />
                                        </div>
                                        {errors.companyName && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.companyName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-medium text-[#153964] mb-1">RERA Number</label>
                                        <div className="relative">
                                            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <input
                                                type="text"
                                                placeholder="e.g. WB/RERA/2026/00123"
                                                {...register("reraNumber")}
                                                className={inputCls(errors.reraNumber).replace("bg-[#F7FAFC]", "bg-white")}
                                            />
                                        </div>
                                        {errors.reraNumber && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.reraNumber.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ============== Address details ============== */}
                            <div>
                                <p className="text-[13px] font-semibold text-[#153964] mb-2">Address</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2">
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <input
                                                type="text"
                                                placeholder="Street address"
                                                {...register("address")}
                                                className={inputCls(errors.address)}
                                            />
                                        </div>
                                        {errors.address && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.address.message}</p>}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <Landmark size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <select
                                                {...stateField}
                                                onChange={(e) => {
                                                    stateField.onChange(e);
                                                    setValue("city", "");
                                                }}
                                                className={selectCls(errors.state)}
                                            >
                                                <option value="">Select state</option>
                                                {INDIA_STATES.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#153964]/40 pointer-events-none" />
                                        </div>
                                        {errors.state && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.state.message}</p>}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <select
                                                {...register("city")}
                                                disabled={!selectedState}
                                                className={selectCls(errors.city)}
                                            >
                                                <option value="">
                                                    {selectedState ? "Select city" : "Select state first"}
                                                </option>
                                                {cityOptions.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#153964]/40 pointer-events-none" />
                                        </div>
                                        {errors.city && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.city.message}</p>}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <Globe2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <select
                                                {...register("country")}
                                                className={selectCls(errors.country)}
                                            >
                                                {COUNTRY_OPTIONS.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#153964]/40 pointer-events-none" />
                                        </div>
                                        {errors.country && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.country.message}</p>}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#153964]/40" />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="Pincode"
                                                {...pincodeField}
                                                onChange={(e) => {
                                                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                    pincodeField.onChange(e);
                                                }}
                                                className={inputCls(errors.pincode)}
                                            />
                                        </div>
                                        {errors.pincode && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.pincode.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-0.5">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={submitting}
                                    className="!rounded-xl !py-3 !text-sm !font-bold bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:from-[#0F2D52] hover:to-[#153964] text-white shadow-[0_8px_24px_-6px_rgba(21,57,100,0.4)] hover:shadow-[0_12px_32px_-6px_rgba(21,57,100,0.5)] transition-all active:scale-[0.98]"
                                >
                                    {submitting ? "Creating your account..." : "Create Account"}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-[13px] text-slate-500 mt-4">
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

                /* Never allow horizontal overflow anywhere on the page */
                html, body, #root { overflow-x: hidden; }
            `}</style>
            </div>
        </>
    );
}