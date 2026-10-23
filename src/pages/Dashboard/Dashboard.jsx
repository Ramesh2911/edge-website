import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    Loader2,
    LayoutDashboard,
    Building2,
    Heart,
    MessageSquare,
    CalendarCheck,
    MapPin,
    ArrowUpRight,
    Eye,
    Plus,
    IndianRupee,
    Sparkles,
    ChevronRight,
    FolderKanban,
    Handshake,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import dashboardService from "../../services/dashboard.service";
import propertyService from "../../services/property.service";
import { getMenusForRole } from "../../data/roleMenus";
import { resolveImageUrl } from "../../utils/imageUrl";

const STAT_META = {
    total: { label: "Total Listings", icon: Building2, color: "from-[#153964] to-[#1E4C8C]" },
    approved: { label: "Approved", icon: Sparkles, color: "from-[#7CB93D] to-[#5A9E2B]" },
    pending: { label: "Pending", icon: CalendarCheck, color: "from-amber-500 to-amber-600" },
    rejected: { label: "Rejected", icon: MessageSquare, color: "from-rose-500 to-rose-600" },
};

const formatINR = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
};

const STATUS_BADGE = {
    publish: "bg-emerald-50 text-emerald-700 border-emerald-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentProperties, setRecentProperties] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);

    const [user] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const u = JSON.parse(raw);
                return {
                    name: u.full_name || "User",
                    role: (u.role_name || "buyer").toLowerCase(),
                    avatar: u.profile_image || null,
                    email: u.email || "",
                };
            }
        } catch {
            /* ignore */
        }
        return { name: "User", role: "buyer", avatar: null, email: "" };
    });

    const firstName = user.name.split(" ")[0];
    const isBuyer = user.role === "buyer";
    const quickLinks = getMenusForRole(user.role).filter(
        (m) => m.to !== "/dashboard" && m.to !== "/profile" && m.to !== "/change-password"
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [analyticsRes, propsRes] = await Promise.allSettled([
                dashboardService.getAnalytics(user.role),
                propertyService.getMyProperties(),
            ]);

            if (analyticsRes.status === "fulfilled") {
                const d = analyticsRes.value?.data;
                setStats(d?.stats || d || null);
                setRecentLeads(d?.recentLeads || d?.leads || []);
            }

            if (propsRes.status === "fulfilled") {
                const list =
                    propsRes.value?.data?.data ||
                    propsRes.value?.data?.properties ||
                    propsRes.value?.data ||
                    [];
                setRecentProperties(Array.isArray(list) ? list.slice(0, 4) : []);
            }
        } catch {
            /* silent — empty states will render */
        } finally {
            setLoading(false);
        }
    }, [user.role]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-9 h-9 animate-spin text-[#153964]" />
                    <p className="text-sm font-semibold text-slate-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const statEntries = stats
        ? Object.entries(stats).filter(([, v]) => typeof v === "number" || !isNaN(Number(v)))
        : [];

    return (
        <>
            <SEO
                title={`Dashboard | Edge Mile Realty`}
                description="View your listing performance, leads, and quick actions."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#F7FAFC] pb-16">
                {/* ============ Hero ============ */}
                <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 800 220" fill="none" className="w-full h-full">
                            <circle cx="650" cy="110" r="170" stroke="#8BC53F" strokeWidth="1" />
                            <circle cx="650" cy="110" r="120" stroke="#8BC53F" strokeWidth="1" />
                            <path d="M0 170 L160 110 L320 150 L480 90 L640 130 L800 80" stroke="#8BC53F" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                {user.avatar ? (
                                    <img
                                        src={resolveImageUrl(user.avatar)}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-2xl border-2 border-[#8BC53F] object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">
                                        {firstName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 backdrop-blur-sm mb-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#8BC53F] animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8BC53F]">
                                            {user.role}
                                        </span>
                                    </div>
                                    <h1 className="font-display text-2xl sm:text-3xl text-white font-medium leading-tight">
                                        Welcome back, {firstName}
                                    </h1>
                                    <p className="text-white/50 text-sm mt-1">
                                        Here's what's happening with your properties today.
                                    </p>
                                </div>
                            </div>

                            {!isBuyer && (
                                <Link
                                    to="/add-property"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#7CB93D] hover:bg-[#6FA82C] text-white text-sm font-bold rounded-xl transition shadow-lg shadow-[#7CB93D]/30 self-start sm:self-center"
                                >
                                    <Plus size={17} />
                                    Add New Property
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                    {/* ============ Stats ============ */}
                    {statEntries.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {statEntries.map(([key, value]) => {
                                const meta = STAT_META[key] || {
                                    label: key.charAt(0).toUpperCase() + key.slice(1),
                                    icon: LayoutDashboard,
                                    color: "from-slate-500 to-slate-600",
                                };
                                const Icon = meta.icon;
                                return (
                                    <div
                                        key={key}
                                        className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-md mb-3`}>
                                            <Icon size={18} />
                                        </div>
                                        <p className="text-2xl font-bold text-slate-800">{value}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{meta.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Total Listings", icon: Building2, color: "from-[#153964] to-[#1E4C8C]" },
                                { label: "Approved", icon: Sparkles, color: "from-[#7CB93D] to-[#5A9E2B]" },
                                { label: "Pending", icon: CalendarCheck, color: "from-amber-500 to-amber-600" },
                                { label: "Inquiries", icon: MessageSquare, color: "from-rose-500 to-rose-600" },
                            ].map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div
                                        key={s.label}
                                        className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md mb-3`}>
                                            <Icon size={18} />
                                        </div>
                                        <p className="text-2xl font-bold text-slate-800">0</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ============ Main Grid ============ */}
                    <div className="grid lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Recent Properties */}
                        <div className="lg:col-span-8 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Recent Properties</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Your latest listing activity
                                    </p>
                                </div>
                                {!isBuyer && (
                                    <Link
                                        to="/my-properties"
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E4C8C] hover:text-[#7CB93D] transition-colors"
                                    >
                                        View All
                                        <ChevronRight size={15} />
                                    </Link>
                                )}
                            </div>

                            {recentProperties.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center">
                                    <Building2 size={42} className="mx-auto text-slate-300 mb-3" />
                                    <h3 className="text-base font-semibold text-slate-700">No properties yet</h3>
                                    <p className="text-sm text-slate-400 mt-1 mb-4">
                                        {isBuyer
                                            ? "Start browsing properties to find your dream home."
                                            : "Create your first listing to get started."}
                                    </p>
                                    <Link
                                        to={isBuyer ? "/properties" : "/add-property"}
                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] px-5 py-2.5 rounded-xl hover:shadow-lg transition-all"
                                    >
                                        <Plus size={15} />
                                        {isBuyer ? "Browse Properties" : "Add Property"}
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {recentProperties.map((prop) => {
                                        const img =
                                            prop.images?.[0] ||
                                            prop.image ||
                                            prop.thumbnail ||
                                            null;
                                        const statusKey = String(prop.status || "draft").toLowerCase();
                                        return (
                                            <Link
                                                key={prop.id}
                                                to={`/properties/details/${prop.id}`}
                                                className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.14)] transition-all duration-300"
                                            >
                                                <div className="relative h-40 bg-gradient-to-br from-[#153964] to-[#1E4C8C] overflow-hidden">
                                                    {img ? (
                                                        <img
                                                            src={resolveImageUrl(img)}
                                                            alt={prop.property_title || prop.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Building2 size={36} className="text-white/30" />
                                                        </div>
                                                    )}
                                                    <span
                                                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                                                            STATUS_BADGE[statusKey] ||
                                                            "bg-white/90 text-slate-600 border-white"
                                                        }`}
                                                    >
                                                        {prop.status || "Draft"}
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-[#1E4C8C] transition-colors">
                                                        {prop.property_title || prop.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                                                        <MapPin size={12} className="shrink-0" />
                                                        {prop.city || prop.address || "—"}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-sm font-bold text-[#153964]">
                                                            {formatINR(prop.price)}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7CB93D] opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Eye size={13} />
                                                            View
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right column */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    {quickLinks.slice(0, 6).map(({ to, icon: Icon, label }) => (
                                        <Link
                                            key={to}
                                            to={to}
                                            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-600 hover:text-[#1E4C8C] hover:bg-[#EAF6DE]/60 transition-colors group"
                                        >
                                            <span className="w-8 h-8 rounded-lg bg-[#EAF0F8] text-[#153964] flex items-center justify-center shrink-0 group-hover:bg-[#7CB93D] group-hover:text-white transition-colors">
                                                <Icon size={15} />
                                            </span>
                                            <span className="font-medium">{label}</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-slate-300 group-hover:text-[#7CB93D] group-hover:translate-x-0.5 transition-all"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Leads (non-buyer) */}
                            {!isBuyer && (
                                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-800">Recent Leads</h3>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7CB93D] bg-[#EAF6DE] px-2 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7CB93D] animate-pulse" />
                                            Live
                                        </span>
                                    </div>

                                    {recentLeads.length === 0 ? (
                                        <div className="text-center py-6">
                                            <MessageSquare size={30} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-xs text-slate-400">No leads yet</p>
                                            <p className="text-[11px] text-slate-300 mt-0.5">
                                                Leads will appear here when buyers inquire.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            {recentLeads.slice(0, 5).map((lead) => (
                                                <div
                                                    key={lead.id}
                                                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 hover:border-[#8BC53F]/40 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#153964] to-[#1E4C8C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                        {(lead.name || "L").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-700 truncate">
                                                            {lead.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                            {lead.target || lead.property || lead.email}
                                                        </p>
                                                    </div>
                                                    <ArrowUpRight size={14} className="text-slate-300 shrink-0 mt-1" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Role-based shortcuts */}
                            <div className="bg-gradient-to-br from-[#153964] to-[#1E4C8C] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#7CB93D]/20 blur-2xl" />
                                <div className="relative">
                                    <h3 className="text-sm font-bold mb-1">Need help?</h3>
                                    <p className="text-xs text-white/50 mb-4 leading-relaxed">
                                        {isBuyer
                                            ? "Save properties you love and schedule site visits directly."
                                            : "Manage listings, track leads, and close deals faster."}
                                    </p>
                                    <Link
                                        to={isBuyer ? "/properties" : "/add-property"}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#7CB93D] hover:bg-[#6FA82C] text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {isBuyer ? (
                                            <>
                                                <Eye size={14} /> Browse Properties
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={14} /> New Listing
                                            </>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
