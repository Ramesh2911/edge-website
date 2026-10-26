import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    LayoutGrid,
    List,
    Eye,
    Pencil,
    Trash2,
    Loader2,
    Building2,
    CheckCircle2,
    Clock3,
    XCircle,
    MapPin,
    BedDouble,
    Bath,
    Ruler,
    Filter,
    ArrowDownUp,
    Sparkles,
    Home,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import propertyService from "../../services/property.service";
import { resolveImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/formatPrice";

const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E8EEF5"/><stop offset="100%" stop-color="#D5E0EC"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><g fill="none" stroke="#9BB0C7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M280 230 L320 195 L360 230 V275 H280 Z"/><rect x="305" y="245" width="30" height="30"/></g></svg>`
    );

const STATUS_META = {
    Approved: {
        label: "Live",
        badge: "bg-[#EAF6DE] text-[#4F7D1F] border-[#7CB93D]/30",
        dot: "bg-[#7CB93D]",
    },
    Pending: {
        label: "Pending",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
    },
    Rejected: {
        label: "Rejected",
        badge: "bg-red-50 text-red-600 border-red-200",
        dot: "bg-red-500",
    },
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

export default function MyProperties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState("newest");
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        propertyId: null,
        propertyTitle: "",
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await propertyService.getMyProperties();
            const list = res?.data?.data || [];
            setProperties(Array.isArray(list) ? list : []);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to load properties.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const stats = useMemo(() => {
        const total = properties.length;
        const approved = properties.filter((p) => p.property_status === "Approved").length;
        const pending = properties.filter((p) => p.property_status === "Pending").length;
        const rejected = properties.filter((p) => p.property_status === "Rejected").length;
        const views = properties.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
        return { total, approved, pending, rejected, views };
    }, [properties]);

    const filteredProperties = useMemo(() => {
        let list = properties.slice();

        if (statusFilter !== "all") {
            list = list.filter((p) => p.property_status === statusFilter);
        }

        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (p) =>
                    (p.property_title || "").toLowerCase().includes(q) ||
                    (p.city || "").toLowerCase().includes(q) ||
                    (p.address || "").toLowerCase().includes(q)
            );
        }

        if (sortKey === "price-high") {
            list.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
        } else if (sortKey === "price-low") {
            list.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
        } else if (sortKey === "oldest") {
            list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        } else {
            list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        return list;
    }, [properties, statusFilter, searchQuery, sortKey]);

    const triggerDelete = (id, title) => {
        setDeleteModal({ isOpen: true, propertyId: id, propertyTitle: title || "this property" });
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await propertyService.deleteProperty(deleteModal.propertyId);
            toast.success("Property deleted successfully.");
            setDeleteModal({ isOpen: false, propertyId: null, propertyTitle: "" });
            fetchInventory();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                    err.message ||
                    "Delete failed. Property may have related records."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const coverOf = (prop) => {
        if (prop.images && prop.images.length) return resolveImageUrl(prop.images[0]);
        return PLACEHOLDER;
    };

    const statCards = [
        {
            key: "total",
            label: "Total Listings",
            value: stats.total,
            icon: Building2,
            gradient: "from-[#0F2D52] via-[#153964] to-[#1E4C8C]",
            ring: "ring-white/20",
        },
        {
            key: "approved",
            label: "Live & Approved",
            value: stats.approved,
            icon: CheckCircle2,
            gradient: "from-[#7CB93D] to-[#5A9E2B]",
            ring: "ring-white/25",
        },
        {
            key: "pending",
            label: "Pending Review",
            value: stats.pending,
            icon: Clock3,
            gradient: "from-amber-400 to-amber-500",
            ring: "ring-white/25",
        },
        {
            key: "rejected",
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            gradient: "from-rose-500 to-rose-600",
            ring: "ring-white/25",
        },
    ];

    const renderActions = (prop, compact = false) => {
        const meta = statusMeta(prop.property_status);
        return (
            <div className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}>
                <button
                    type="button"
                    onClick={() => navigate(`/properties/details/${prop.id}`)}
                    title="View details"
                    className="p-2 rounded-lg text-slate-500 hover:text-[#153964] hover:bg-[#153964]/8 transition-all"
                >
                    <Eye size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => navigate(`/edit-property/${prop.id}`)}
                    title="Edit"
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                >
                    <Pencil size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => triggerDelete(prop.id, prop.property_title)}
                    title="Delete"
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        );
    };

    return (
        <>
            <SEO
                title="My Properties | Edge Mile Realty"
                description="Manage, edit, and track your property listings in one place."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#F7FAFC] pb-16">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
                            <circle cx="680" cy="100" r="160" stroke="#8BC53F" strokeWidth="1" />
                            <circle cx="680" cy="100" r="110" stroke="#8BC53F" strokeWidth="1" />
                            <path
                                d="M0 150 L200 90 L400 130 L600 70 L800 110"
                                stroke="#8BC53F"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                                    <Sparkles size={14} className="text-[#8BC53F]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                                        Portfolio Manager
                                    </span>
                                </div>
                                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                                    My Properties
                                </h1>
                                <p className="text-white/55 text-sm mt-3 max-w-lg">
                                    Track approvals, edit listings, and manage every property you have published.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/add-property")}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7CB93D] hover:bg-[#8BC53F] text-white text-sm font-bold rounded-xl shadow-[0_10px_30px_-8px_rgba(124,185,61,0.55)] transition-all active:scale-[0.98] shrink-0"
                            >
                                <Plus size={17} />
                                Add New Property
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
                                    <Icon size={20} />
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
                                <Search
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
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
                                    <Filter
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="appearance-none pl-9 pr-8 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Approved">Live / Approved</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <ArrowDownUp
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    />
                                    <select
                                        value={sortKey}
                                        onChange={(e) => setSortKey(e.target.value)}
                                        className="appearance-none pl-9 pr-8 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price-high">Price: High → Low</option>
                                        <option value="price-low">Price: Low → High</option>
                                    </select>
                                </div>

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
                                <span className="text-slate-600 font-bold">
                                    {filteredProperties.length}
                                </span>{" "}
                                of <span className="text-slate-600 font-bold">{properties.length}</span>{" "}
                                listings
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
                    ) : filteredProperties.length === 0 ? (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-20 px-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white mx-auto shadow-lg mb-5">
                                <Home size={26} />
                            </div>
                            <h3 className="font-display text-xl text-slate-800 font-medium">
                                {properties.length === 0
                                    ? "No properties yet"
                                    : "No matching properties"}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                                {properties.length === 0
                                    ? "Start building your portfolio — create your first listing in minutes."
                                    : "Try adjusting your search or status filter."}
                            </p>
                            {properties.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/add-property")}
                                    className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#153964] to-[#1E4C8C] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_-6px_rgba(21,57,100,0.4)] transition-all active:scale-[0.98]"
                                >
                                    <Plus size={16} /> Add First Property
                                </button>
                            )}
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredProperties.map((prop) => {
                                const meta = statusMeta(prop.property_status);
                                const cover = coverOf(prop);
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
                                                className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur ${meta.badge}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                {meta.label}
                                            </span>

                                            {prop.featured == 1 && (
                                                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#C8972E] text-white px-2.5 py-1 rounded-full shadow">
                                                    <Sparkles size={10} /> Featured
                                                </span>
                                            )}

                                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow">
                                                <span className="text-sm font-extrabold text-[#153964]">
                                                    {formatPrice(prop.price)}
                                                </span>
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

                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    {formatDate(prop.created_at)}
                                                </span>
                                                {renderActions(prop)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[420px] md:min-w-[720px]">
                                    <thead>
                                        <tr className="bg-[#F7FAFC] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                            <th className="px-5 py-3.5">Property</th>
                                            <th className="hidden md:table-cell px-4 py-3.5">Type</th>
                                            <th className="px-4 py-3.5">Price</th>
                                            <th className="px-4 py-3.5">Status</th>
                                            <th className="hidden md:table-cell px-4 py-3.5">Added</th>
                                            <th className="px-5 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {filteredProperties.map((prop) => {
                                            const meta = statusMeta(prop.property_status);
                                            return (
                                                <tr
                                                    key={prop.id}
                                                    className="hover:bg-slate-50/70 transition-colors"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3.5 min-w-0">
                                                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
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
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(`/properties/details/${prop.id}`)
                                                                    }
                                                                    className="font-bold text-slate-800 line-clamp-1 hover:text-[#153964] transition-colors text-left"
                                                                >
                                                                    {prop.property_title || "Untitled property"}
                                                                </button>
                                                                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 line-clamp-1">
                                                                    <MapPin size={11} className="shrink-0" />
                                                                    {prop.city || "—"}
                                                                    {prop.state ? `, ${prop.state}` : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-4 py-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#153964]/8 text-[#153964] px-2.5 py-1 rounded-full">
                                                            {prop.property_for || "—"}
                                                        </span>
                                                        <div className="text-[11px] text-slate-400 mt-1.5 font-medium">
                                                            {prop.property_type || ""}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-extrabold text-slate-800 whitespace-nowrap">
                                                        {formatPrice(prop.price)}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.badge}`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}
                                                            />
                                                            {meta.label}
                                                        </span>
                                                    </td>
                                                    <td className="hidden md:table-cell px-4 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                                                        {formatDate(prop.created_at)}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {renderActions(prop, true)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-50 rounded-xl">
                                <Trash2 size={20} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Delete Property</h3>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Permanently delete{" "}
                            <span className="font-bold text-slate-800">
                                "{deleteModal.propertyTitle}"
                            </span>
                            ? This cannot be undone.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() =>
                                    setDeleteModal({
                                        isOpen: false,
                                        propertyId: null,
                                        propertyTitle: "",
                                    })
                                }
                                className="flex-1 py-2.5 bg-slate-100 text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting && <Loader2 size={15} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
