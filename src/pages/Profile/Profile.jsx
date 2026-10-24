import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    ShieldCheck,
    Mail,
    Phone,
    Calendar,
    Loader2,
    MapPin,
    Building2,
    BadgeCheck,
    Pencil,
    KeyRound,
    Heart,
    Home,
    Inbox,
    Sparkles,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
    LogIn,
    LogOut,
    PlusCircle,
    FileText,
    ArrowRight,
    UserRound,
    IdCard,
    Globe,
    Navigation,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import profileService from "../../services/profile.service";
import propertyService from "../../services/property.service";
import authService from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { resolveImageUrl } from "../../utils/imageUrl";

import EditProfileForm from "../../components/profile/EditProfileForm";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";

const formatDate = (d) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
};

const timeAgo = (d) => {
    if (!d) return "";
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(d);
};

const ACTION_META = {
    LOGIN: { label: "Signed in", icon: LogIn, tone: "bg-sky-50 text-sky-600" },
    PROPERTY_CREATED: { label: "Listed a property", icon: PlusCircle, tone: "bg-[#EAF6DE] text-[#4F7D1F]" },
    PROPERTY_INTEREST: { label: "Showed interest in a property", icon: Heart, tone: "bg-rose-50 text-rose-500" },
    BUYER_REQUIREMENT_CREATED: { label: "Posted a buyer requirement", icon: FileText, tone: "bg-amber-50 text-amber-600" },
};

const actionMeta = (action) =>
    ACTION_META[action] || {
        label: String(action || "Activity").replace(/_/g, " ").toLowerCase(),
        icon: Activity,
        tone: "bg-slate-100 text-slate-500",
    };

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [propStats, setPropStats] = useState({ total: 0, approved: 0 });
    const [wishlistCount, setWishlistCount] = useState(0);
    const [leadsCount, setLeadsCount] = useState(0);
    const [activities, setActivities] = useState([]);
    const [activeModal, setActiveModal] = useState(null); // 'edit-profile' | 'change-password' | null

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // token already invalid — ignore
        }
        logout();
        navigate("/");
    };

    const loadAll = async () => {
        setLoading(true);
        const [prof, stats, wish, inq, acts] = await Promise.allSettled([
            profileService.getProfile(),
            propertyService.dashboardStats(),
            propertyService.getWishlist(),
            propertyService.getInterestedProperty(),
            profileService.getActivities(),
        ]);

        if (prof.status === "fulfilled") {
            setProfile(prof.value?.data?.data || null);
        } else {
            toast.error("Could not load your profile.");
            setProfile(null);
        }
        if (stats.status === "fulfilled") {
            const d = stats.value?.data?.data || {};
            setPropStats({ total: d.total || 0, approved: d.approved || 0 });
        }
        if (wish.status === "fulfilled") {
            const list = wish.value?.data?.data || [];
            setWishlistCount(Array.isArray(list) ? list.length : 0);
        }
        if (inq.status === "fulfilled") {
            const list = inq.value?.data?.data || [];
            setLeadsCount(
                Array.isArray(list) ? list.filter((i) => i.direction === "received").length : 0
            );
        }
        if (acts.status === "fulfilled") {
            const list = acts.value?.data?.data || [];
            setActivities(Array.isArray(list) ? list : []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAll();
    }, []);

    const completion = useMemo(() => {
        if (!profile) return 0;
        const fields = [
            profile.full_name,
            profile.mobile,
            profile.address,
            profile.city,
            profile.state,
            profile.country,
            profile.pincode,
            profile.profile_image,
        ];
        const filled = fields.filter((f) => String(f || "").trim()).length;
        return Math.round((filled / fields.length) * 100);
    }, [profile]);

    const missingFields = useMemo(() => {
        if (!profile) return [];
        const checks = [
            { key: "full_name", label: "Full name", ok: !!profile.full_name },
            { key: "mobile", label: "Mobile number", ok: !!profile.mobile },
            { key: "profile_image", label: "Profile photo", ok: !!profile.profile_image },
            { key: "address", label: "Address", ok: !!profile.address },
            { key: "city", label: "City", ok: !!profile.city },
            { key: "pincode", label: "Pincode", ok: !!profile.pincode },
        ];
        return checks.filter((c) => !c.ok);
    }, [profile]);

    const handleUpdateProfile = async (formData) => {
        setSaving(true);
        try {
            await profileService.updateProfile(formData);
            toast.success("Profile updated successfully.");
            setActiveModal(null);
            await loadAll();
        } catch (err) {
            const data = err?.response?.data;
            toast.error(data?.errors?.[0]?.msg || data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (data) => {
        setSaving(true);
        try {
            await profileService.changePassword(data);
            toast.success("Password changed successfully.");
            setActiveModal(null);
        } catch (err) {
            const body = err?.response?.data;
            toast.error(body?.errors?.[0]?.msg || body?.message || "Failed to change password.");
        } finally {
            setSaving(false);
        }
    };

    const statCards = [
        { key: "props", label: "Total Properties", value: propStats.total, icon: Home, gradient: "from-[#0F2D52] via-[#153964] to-[#1E4C8C]" },
        { key: "live", label: "Live Listings", value: propStats.approved, icon: BadgeCheck, gradient: "from-[#7CB93D] to-[#5A9E2B]" },
        { key: "leads", label: "Leads Received", value: leadsCount, icon: Inbox, gradient: "from-amber-400 to-amber-500" },
        { key: "saved", label: "Saved Homes", value: wishlistCount, icon: Heart, gradient: "from-rose-400 to-rose-500" },
    ];

    const detailItems = profile
        ? [
              { icon: Mail, label: "Email", value: profile.email },
              { icon: Phone, label: "Mobile", value: profile.mobile },
              { icon: Building2, label: "Company", value: profile.company_name || "—" },
              { icon: IdCard, label: "RERA Number", value: profile.rera_number || "—" },
              { icon: MapPin, label: "Address", value: [profile.address, profile.city].filter(Boolean).join(", ") || "—", wide: true },
              { icon: Navigation, label: "City", value: profile.city || "—" },
              { icon: Globe, label: "State / Country", value: [profile.state, profile.country].filter(Boolean).join(", ") || "—" },
              { icon: BadgeCheck, label: "Pincode", value: profile.pincode || "—" },
          ]
        : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7FAFC]">
                <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] h-56 animate-pulse" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 animate-pulse">
                                <div className="h-4 w-24 bg-slate-100 rounded-full" />
                                <div className="h-7 w-16 bg-slate-100 rounded-full mt-3" />
                            </div>
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-2xl h-40 animate-pulse border border-slate-200/60" />
                            <div className="bg-white rounded-2xl h-72 animate-pulse border border-slate-200/60" />
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl h-64 animate-pulse border border-slate-200/60" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3 pt-8 text-slate-400 text-sm font-medium">
                    <Loader2 className="w-5 h-5 animate-spin text-[#153964]" />
                    Loading your profile…
                </div>
            </div>
        );
    }

    const avatarSrc = profile?.profile_image ? resolveImageUrl(profile.profile_image) : null;
    const initials = (profile?.full_name || "U")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <>
            <SEO
                title="My Profile | Edge Mile Realty"
                description="Manage your account details, security, and view your activity on Edge Mile Realty."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#F7FAFC] pb-16">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
                            <circle cx="680" cy="100" r="160" stroke="#8BC53F" strokeWidth="1" />
                            <circle cx="680" cy="100" r="110" stroke="#8BC53F" strokeWidth="1" />
                            <path d="M0 150 L200 90 L400 130 L600 70 L800 110" stroke="#8BC53F" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="relative shrink-0">
                                    {avatarSrc ? (
                                        <img
                                            src={avatarSrc}
                                            alt={profile?.full_name || "Profile"}
                                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl bg-white/10"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#7CB93D] to-[#5A9E2B] flex items-center justify-center ring-4 ring-white/20 shadow-xl">
                                            <span className="font-display text-3xl sm:text-4xl text-white font-semibold">
                                                {initials}
                                            </span>
                                        </div>
                                    )}
                                    <span
                                        className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-[#153964] ${
                                            profile?.is_verified ? "bg-[#7CB93D]" : "bg-amber-500"
                                        }`}
                                        title={profile?.is_verified ? "Verified account" : "Verification pending"}
                                    >
                                        <ShieldCheck size={15} className="text-white" />
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h1 className="font-display text-2xl sm:text-3xl text-white font-medium truncate">
                                            {profile?.full_name || "Your Profile"}
                                        </h1>
                                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#8BC53F]">
                                            {profile?.role_name || "Member"}
                                        </span>
                                        <span
                                            className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                                                profile?.is_verified
                                                    ? "bg-[#7CB93D]/20 border border-[#7CB93D]/40 text-[#A8E063]"
                                                    : "bg-amber-400/15 border border-amber-400/40 text-amber-200"
                                            }`}
                                        >
                                            {profile?.is_verified ? "Verified" : "Unverified"}
                                        </span>
                                    </div>
                                    <p className="text-white/55 text-sm mt-2 flex items-center gap-1.5 truncate">
                                        <Mail size={13} className="shrink-0" />
                                        {profile?.email || "—"}
                                    </p>
                                    <p className="text-white/40 text-xs mt-1.5 flex items-center gap-1.5">
                                        <Calendar size={13} />
                                        Member since {formatDate(profile?.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal("edit-profile")}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#7CB93D] hover:bg-[#8BC53F] text-white text-sm font-bold rounded-xl shadow-[0_10px_30px_-8px_rgba(124,185,61,0.55)] transition-all active:scale-[0.98]"
                                >
                                    <Pencil size={15} /> Edit Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal("change-password")}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-bold rounded-xl backdrop-blur transition-all active:scale-[0.98]"
                                >
                                    <KeyRound size={15} /> Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-400/40 text-white hover:text-red-100 text-sm font-bold rounded-xl backdrop-blur transition-all active:scale-[0.98]"
                                >
                                    <LogOut size={15} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {statCards.map(({ key, label, value, icon: Icon, gradient }) => (
                            <div
                                key={key}
                                className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-4 sm:p-5 flex items-center gap-3.5 hover:shadow-[0_8px_28px_-6px_rgba(21,57,100,0.12)] transition-shadow"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md shrink-0`}
                                >
                                    <Icon size={20} className={key === "saved" ? "fill-white" : ""} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                        {label}
                                    </p>
                                    <p className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 items-start">
                        {/* Left column */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Completion */}
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-6">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div>
                                        <h3 className="font-bold text-slate-800">Profile Completion</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {completion === 100
                                                ? "Your profile is fully complete."
                                                : "Complete your profile to build trust with buyers and owners."}
                                        </p>
                                    </div>
                                    <span className="text-2xl font-extrabold text-[#153964]">{completion}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                            completion === 100
                                                ? "bg-[#7CB93D]"
                                                : "bg-gradient-to-r from-[#153964] to-[#1E4C8C]"
                                        }`}
                                        style={{ width: `${completion}%` }}
                                    />
                                </div>
                                {missingFields.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {missingFields.map((f) => (
                                            <span
                                                key={f.key}
                                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full"
                                            >
                                                <XCircle size={12} /> {f.label}
                                            </span>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setActiveModal("edit-profile")}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] px-3 py-1 rounded-full hover:from-[#0F2D52] hover:to-[#153964] transition-all"
                                        >
                                            Complete now <ArrowRight size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Personal details */}
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F2D52] to-[#1E4C8C] flex items-center justify-center text-white">
                                            <UserRound size={16} />
                                        </span>
                                        <h3 className="font-bold text-slate-800">Personal Details</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModal("edit-profile")}
                                        className="text-xs font-bold text-[#153964] hover:text-[#0F2D52] inline-flex items-center gap-1"
                                    >
                                        <Pencil size={13} /> Edit
                                    </button>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                                    {detailItems.map(({ icon: Icon, label, value, wide }) => (
                                        <div
                                            key={label}
                                            className={`flex items-start gap-3 ${wide ? "sm:col-span-2" : ""}`}
                                        >
                                            <span className="w-9 h-9 rounded-xl bg-[#F7FAFC] border border-slate-100 flex items-center justify-center text-[#153964] shrink-0">
                                                <Icon size={15} />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                    {label}
                                                </p>
                                                <p className="text-sm font-semibold text-slate-700 mt-0.5 break-words">
                                                    {value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-6">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CB93D] to-[#5A9E2B] flex items-center justify-center text-white">
                                        <Activity size={16} />
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Recent Activity</h3>
                                        <p className="text-[11px] text-slate-400">Latest actions on your account</p>
                                    </div>
                                </div>
                                {activities.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Activity size={28} className="text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400 font-medium">No activity recorded yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {activities.map((act, idx) => {
                                            const meta = actionMeta(act.action);
                                            const Icon = meta.icon;
                                            return (
                                                <div
                                                    key={act.id ?? idx}
                                                    className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0"
                                                >
                                                    <span
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.tone}`}
                                                    >
                                                        <Icon size={14} />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-slate-700 font-medium leading-snug">
                                                            {act.details || meta.label}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                                            {meta.label} · {timeAgo(act.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Account status */}
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden">
                                <div className="bg-gradient-to-r from-[#0F2D52] to-[#1E4C8C] px-5 py-4">
                                    <h3 className="font-bold text-white text-sm">Account Status</h3>
                                    <p className="text-white/50 text-[11px] mt-0.5">Security & membership overview</p>
                                </div>
                                <div className="p-5 space-y-3.5">
                                    {[
                                        {
                                            label: "Account",
                                            value: profile?.status === 1 ? "Active" : "Inactive",
                                            ok: profile?.status === 1,
                                        },
                                        {
                                            label: "Identity",
                                            value: profile?.is_verified ? "Verified" : "Pending verification",
                                            ok: !!profile?.is_verified,
                                        },
                                        { label: "Role", value: profile?.role_name || "—", ok: true },
                                        { label: "Member since", value: formatDate(profile?.created_at), ok: true },
                                        {
                                            label: "Last login",
                                            value: profile?.last_login ? timeAgo(profile.last_login) : "This session",
                                            ok: true,
                                        },
                                    ].map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex items-center justify-between gap-3 text-sm"
                                        >
                                            <span className="text-slate-400 font-medium">{row.label}</span>
                                            <span className="font-bold text-slate-700 text-right inline-flex items-center gap-1.5">
                                                {row.ok ? (
                                                    <CheckCircle2 size={14} className="text-[#7CB93D] shrink-0" />
                                                ) : (
                                                    <XCircle size={14} className="text-amber-500 shrink-0" />
                                                )}
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-slate-100 grid grid-cols-1 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setActiveModal("edit-profile")}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] rounded-xl hover:from-[#0F2D52] hover:to-[#153964] transition-all"
                                        >
                                            <Pencil size={14} /> Edit Profile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveModal("change-password")}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#153964] bg-[#F7FAFC] border border-slate-200 rounded-xl hover:border-[#153964]/30 transition-all"
                                        >
                                            <KeyRound size={14} /> Change Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 hover:border-red-200 transition-all"
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick tips */}
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                                        <Sparkles size={16} />
                                    </span>
                                    <h3 className="font-bold text-slate-800 text-sm">Why complete it?</h3>
                                </div>
                                <ul className="space-y-2.5 text-xs text-slate-500 leading-relaxed">
                                    <li className="flex gap-2">
                                        <CheckCircle2 size={14} className="text-[#7CB93D] shrink-0 mt-0.5" />
                                        Verified profiles get more responses on enquiries.
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 size={14} className="text-[#7CB93D] shrink-0 mt-0.5" />
                                        A photo and RERA number build buyer trust instantly.
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 size={14} className="text-[#7CB93D] shrink-0 mt-0.5" />
                                        Accurate location helps leads reach you faster.
                                    </li>
                                </ul>
                                <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                    <Clock size={12} /> Last login:{" "}
                                    {profile?.last_login ? timeAgo(profile.last_login) : "this session"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit profile modal */}
            {activeModal === "edit-profile" && profile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="bg-gradient-to-r from-[#0F2D52] to-[#1E4C8C] px-6 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5 text-white">
                                <Pencil size={16} className="text-[#8BC53F]" />
                                <h3 className="font-bold text-sm">Edit Profile</h3>
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-white/60 hover:text-white text-xs font-bold"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <EditProfileForm
                                user={profile}
                                onSubmit={handleUpdateProfile}
                                loading={saving}
                                onCancel={() => setActiveModal(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Change password modal */}
            {activeModal === "change-password" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="bg-gradient-to-r from-[#0F2D52] to-[#1E4C8C] px-6 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5 text-white">
                                <KeyRound size={16} className="text-[#8BC53F]" />
                                <h3 className="font-bold text-sm">Change Password</h3>
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-white/60 hover:text-white text-xs font-bold"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <ChangePasswordForm
                                onSubmit={handleChangePassword}
                                loading={saving}
                                onCancel={() => setActiveModal(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
