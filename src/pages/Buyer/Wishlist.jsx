import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Search,
    LayoutGrid,
    List,
    Trash2,
    Share2,
    Eye,
    Loader2,
    MapPin,
    BedDouble,
    Bath,
    Ruler,
    ArrowRight,
    Sparkles,
    Home,
    SlidersHorizontal,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import propertyService from "../../services/property.service";
import { resolveImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/formatPrice";

const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F8E8E8"/><stop offset="100%" stop-color="#F0D4D4"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><path d="M320 270 C290 240 250 215 250 185 C250 165 265 150 285 150 C300 150 312 158 320 170 C328 158 340 150 355 150 C375 150 390 165 390 185 C390 215 350 240 320 270 Z" fill="none" stroke="#D4A0A0" stroke-width="4" stroke-linejoin="round"/></svg>`
    );

const STATUS_META = {
    Approved: { label: "Live", badge: "bg-[#EAF6DE] text-[#4F7D1F] border-[#7CB93D]/30", dot: "bg-[#7CB93D]" },
    Pending: { label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    Rejected: { label: "Rejected", badge: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
};

const statusMeta = (s) =>
    STATUS_META[s] || {
        label: s || "Unknown",
        badge: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
    };

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

export default function Wishlist() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [purposeFilter, setPurposeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [maxPrice, setMaxPrice] = useState("");
    const [removeId, setRemoveId] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const fetchSavedWishlist = async () => {
        setLoading(true);
        try {
            const res = await propertyService.getWishlist();
            const list = res?.data?.data || [];
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to load wishlist.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedWishlist();
    }, []);

    const stats = useMemo(() => {
        const total = items.length;
        const sale = items.filter((i) => (i.property_for || "Sale") === "Sale").length;
        const rent = items.filter((i) => i.property_for === "Rent").length;
        const live = items.filter((i) => i.property_status === "Approved").length;
        return { total, sale, rent, live };
    }, [items]);

    const filteredItems = useMemo(() => {
        let list = items.slice();

        if (purposeFilter !== "all") {
            list = list.filter((i) => (i.property_for || "Sale") === purposeFilter);
        }
        if (statusFilter !== "all") {
            list = list.filter((i) => i.property_status === statusFilter);
        }

        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (i) =>
                    (i.property_title || "").toLowerCase().includes(q) ||
                    (i.city || "").toLowerCase().includes(q) ||
                    (i.address || "").toLowerCase().includes(q)
            );
        }

        const max = Number(maxPrice);
        if (maxPrice && !Number.isNaN(max)) {
            list = list.filter((i) => parseFloat(i.price || 0) <= max);
        }

        list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        return list;
    }, [items, purposeFilter, statusFilter, searchQuery, maxPrice]);

    const removeItem = async (id, title) => {
        setRemoveId(id);
        setIsRemoving(true);
        try {
            await propertyService.removeWishlist(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success(`"${title || "Property"}" removed from wishlist.`);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to remove.");
        } finally {
            setIsRemoving(false);
            setRemoveId(null);
        }
    };

    const sharePropertyLink = (id) => {
        const url = `${window.location.origin}/properties/details/${id}`;
        navigator.clipboard.writeText(url);
        toast.success("Property link copied!");
    };

    const coverOf = (prop) => {
        if (prop.images && prop.images.length) return resolveImageUrl(prop.images[0]);
        return PLACEHOLDER;
    };

    const statCards = [
        { key: "total", label: "Saved Homes", value: stats.total, icon: Heart, gradient: "from-[#0F2D52] via-[#153964] to-[#1E4C8C]" },
        { key: "sale", label: "For Sale", value: stats.sale, icon: Home, gradient: "from-[#7CB93D] to-[#5A9E2B]" },
        { key: "rent", label: "For Rent", value: stats.rent, icon: Sparkles, gradient: "from-amber-400 to-amber-500" },
        { key: "live", label: "Live Listings", value: stats.live, icon: Eye, gradient: "from-rose-400 to-rose-500" },
    ];

    return (
        <>
            <SEO
                title="My Wishlist | Edge Mile Realty"
                description="Review and manage your saved property shortlist."
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
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                                    <Heart size={14} className="text-rose-300 fill-rose-300" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-200">
                                        Shortlist Collection
                                    </span>
                                </div>
                                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                                    My Wishlist
                                </h1>
                                <p className="text-white/55 text-sm mt-3 max-w-lg">
                                    Properties you have saved — compare, share, or jump straight to details.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/properties")}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7CB93D] hover:bg-[#8BC53F] text-white text-sm font-bold rounded-xl shadow-[0_10px_30px_-8px_rgba(124,185,61,0.55)] transition-all active:scale-[0.98] shrink-0"
                            >
                                Browse More Properties
                                <ArrowRight size={16} />
                            </button>
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
                                    <Icon size={20} className={key === "total" ? "fill-white" : ""} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                                        {label}
                                    </p>
                                    <p className="text-2xl font-extrabold text-slate-800 leading-tight mt-0.5">
                                        {loading ? "—" : value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-4 sm:p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                            <div className="relative flex-1 min-w-0">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, city, or address…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15 transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="relative">
                                    <SlidersHorizontal
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    />
                                    <select
                                        value={purposeFilter}
                                        onChange={(e) => setPurposeFilter(e.target.value)}
                                        className="appearance-none pl-9 pr-8 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                    >
                                        <option value="all">All Intent</option>
                                        <option value="Sale">For Sale</option>
                                        <option value="Rent">For Rent</option>
                                    </select>
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Approved">Live</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                </select>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Max ₹"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-28 px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all placeholder:text-slate-400"
                                />

                                <div className="flex items-center border-2 border-slate-200 p-1 rounded-xl bg-[#F7FAFC]">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        aria-label="Grid view"
                                        className={`p-2 rounded-lg transition-all ${
                                            viewMode === "grid"
                                                ? "bg-white text-[#153964] shadow-sm"
                                                : "text-slate-400 hover:text-slate-600"
                                        }`}
                                    >
                                        <LayoutGrid size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("list")}
                                        aria-label="List view"
                                        className={`p-2 rounded-lg transition-all ${
                                            viewMode === "list"
                                                ? "bg-white text-[#153964] shadow-sm"
                                                : "text-slate-400 hover:text-slate-600"
                                        }`}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {!loading && (
                            <p className="text-xs text-slate-400 mt-3 font-medium">
                                Showing{" "}
                                <span className="text-slate-600 font-bold">{filteredItems.length}</span> of{" "}
                                <span className="text-slate-600 font-bold">{items.length}</span> saved{" "}
                                {items.length === 1 ? "property" : "properties"}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                                    : "space-y-3"
                            }
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden animate-pulse"
                                >
                                    <div className={viewMode === "grid" ? "aspect-[16/10] bg-slate-100" : "h-0"} />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 w-2/3 bg-slate-100 rounded-full" />
                                        <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                                        <div className="h-6 w-1/3 bg-slate-100 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-20 px-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white mx-auto shadow-lg mb-5">
                                <Heart size={26} className="fill-white" />
                            </div>
                            <h3 className="font-display text-xl text-slate-800 font-medium">
                                {items.length === 0 ? "Your wishlist is empty" : "No matching properties"}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                                {items.length === 0
                                    ? "Tap the heart on any property to save it here for later."
                                    : "Try adjusting search, intent, status, or max price filters."}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    items.length === 0
                                        ? navigate("/properties")
                                        : (setSearchQuery(""),
                                          setPurposeFilter("all"),
                                          setStatusFilter("all"),
                                          setMaxPrice(""))
                                }
                                className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#153964] to-[#1E4C8C] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_-6px_rgba(21,57,100,0.4)] transition-all active:scale-[0.98]"
                            >
                                {items.length === 0 ? (
                                    <>
                                        Explore Properties <ArrowRight size={16} />
                                    </>
                                ) : (
                                    "Clear Filters"
                                )}
                            </button>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredItems.map((prop) => {
                                const meta = statusMeta(prop.property_status);
                                const cover = coverOf(prop);
                                const isRemoval = removeId === prop.id && isRemoving;
                                return (
                                    <div
                                        key={prop.id}
                                        className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden hover:shadow-[0_12px_32px_-8px_rgba(21,57,100,0.16)] hover:-translate-y-0.5 transition-all group flex flex-col"
                                    >
                                        <div
                                            className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/properties/details/${prop.id}`)}
                                        >
                                            <img
                                                src={cover}
                                                alt={prop.property_title || "Property"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.src = PLACEHOLDER;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                                            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur text-[#153964] px-2.5 py-1 rounded-full shadow-sm">
                                                {prop.property_for || "Sale"}
                                            </span>

                                            <span
                                                className={`absolute top-3 right-14 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur ${meta.badge}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                {meta.label}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(prop.id, prop.property_title);
                                                }}
                                                disabled={isRemoval}
                                                title="Remove from wishlist"
                                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white shadow-md transition-all disabled:opacity-60"
                                            >
                                                {isRemoval ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={15} />
                                                )}
                                            </button>

                                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow">
                                                <span className="text-sm font-extrabold text-[#153964]">
                                                    {formatPrice(prop.price)}
                                                </span>
                                                {prop.property_for === "Rent" && (
                                                    <span className="text-[10px] text-slate-500 font-bold">/mo</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                                            <h3
                                                className="font-bold text-slate-800 line-clamp-1 cursor-pointer hover:text-[#153964] transition-colors"
                                                onClick={() => navigate(`/properties/details/${prop.id}`)}
                                            >
                                                {prop.property_title || "Untitled property"}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1 line-clamp-1">
                                                <MapPin size={12} className="shrink-0" />
                                                {prop.address ||
                                                    [prop.city, prop.state].filter(Boolean).join(", ") ||
                                                    "Location not set"}
                                            </p>

                                            <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 mt-3 text-[11px] font-semibold text-slate-500">
                                                {prop.area != null && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Ruler size={12} className="text-[#7CB93D]" />
                                                        {Number(prop.area).toLocaleString("en-IN")}{" "}
                                                        {prop.area_unit || "sq.ft"}
                                                    </span>
                                                )}
                                                {Number(prop.bedroom) > 0 && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <BedDouble size={12} className="text-[#7CB93D]" />
                                                        {prop.bedroom} Bed
                                                    </span>
                                                )}
                                                {Number(prop.bathroom) > 0 && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Bath size={12} className="text-[#7CB93D]" />
                                                        {prop.bathroom} Bath
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    Saved {formatDate(prop.created_at)}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => sharePropertyLink(prop.id)}
                                                        title="Share"
                                                        className="p-2 rounded-lg text-slate-500 hover:text-[#153964] hover:bg-[#153964]/8 transition-all"
                                                    >
                                                        <Share2 size={15} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/properties/details/${prop.id}`)}
                                                        title="View details"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] rounded-lg hover:from-[#0F2D52] hover:to-[#153964] transition-all"
                                                    >
                                                        <Eye size={13} /> View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {filteredItems.map((prop) => {
                                    const meta = statusMeta(prop.property_status);
                                    const isRemoval = removeId === prop.id && isRemoving;
                                    return (
                                        <div
                                            key={prop.id}
                                            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/70 transition-colors"
                                        >
                                            <div
                                                className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer"
                                                onClick={() => navigate(`/properties/details/${prop.id}`)}
                                            >
                                                <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                                                    <img
                                                        src={coverOf(prop)}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = PLACEHOLDER;
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-slate-800 line-clamp-1">
                                                            {prop.property_title || "Untitled property"}
                                                        </h3>
                                                        <span
                                                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badge}`}
                                                        >
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                                                        <MapPin size={11} className="shrink-0" />
                                                        {prop.city || "—"}
                                                        {prop.state ? `, ${prop.state}` : ""}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-slate-500">
                                                        <span className="font-extrabold text-[#153964] text-sm">
                                                            {formatPrice(prop.price)}
                                                            {prop.property_for === "Rent" && "/mo"}
                                                        </span>
                                                        {prop.area != null && (
                                                            <span>
                                                                {Number(prop.area).toLocaleString("en-IN")}{" "}
                                                                {prop.area_unit || "sq.ft"}
                                                            </span>
                                                        )}
                                                        {Number(prop.bedroom) > 0 && (
                                                            <span>{prop.bedroom} Bed</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:justify-end shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => sharePropertyLink(prop.id)}
                                                    title="Share"
                                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#153964] hover:border-[#153964]/30 transition-all"
                                                >
                                                    <Share2 size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/properties/details/${prop.id}`)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] rounded-xl hover:from-[#0F2D52] hover:to-[#153964] transition-all"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(prop.id, prop.property_title)}
                                                    disabled={isRemoval}
                                                    title="Remove"
                                                    className="p-2.5 rounded-xl border border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-60"
                                                >
                                                    {isRemoval ? (
                                                        <Loader2 size={15} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
