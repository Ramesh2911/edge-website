import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    Search,
    LayoutGrid,
    List,
    Trash2,
    Eye,
    Loader2,
    MapPin,
    ArrowRight,
    Clock,
    CheckCircle2,
    Send,
    Phone,
    Mail,
    MessageCircle,
    User,
    SlidersHorizontal,
    Inbox,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import propertyService from "../../services/property.service";
import { resolveImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/formatPrice";

const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E8EEF6"/><stop offset="100%" stop-color="#D7E2F0"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><rect x="200" y="130" width="240" height="150" rx="16" fill="none" stroke="#9BB4D4" stroke-width="5"/><path d="M200 160 L320 230 L440 160" fill="none" stroke="#9BB4D4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    );

const STATUS_META = {
    New: { label: "Awaiting Reply", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    Contacted: { label: "Contacted", badge: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
    Converted: { label: "Converted", badge: "bg-[#EAF6DE] text-[#4F7D1F] border-[#7CB93D]/30", dot: "bg-[#7CB93D]" },
    Lost: { label: "Lost", badge: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
};

const statusMeta = (s) =>
    STATUS_META[s] || {
        label: s || "Unknown",
        badge: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
    };

const DIRECTION_META = {
    sent: { label: "You Inquired", badge: "bg-white/95 text-[#153964] border-white" },
    received: { label: "Lead Received", badge: "bg-[#7CB93D] text-white border-[#7CB93D]" },
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

export default function Interested() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [directionFilter, setDirectionFilter] = useState("all");
    const [sortKey, setSortKey] = useState("newest");
    const [busyId, setBusyId] = useState(null);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await propertyService.getInterestedProperty();
            const list = res?.data?.data || [];
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to load inquiries.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const stats = useMemo(() => {
        const total = items.length;
        const awaiting = items.filter((i) => i.status === "New").length;
        const contacted = items.filter((i) => i.status === "Contacted").length;
        const converted = items.filter((i) => i.status === "Converted").length;
        return { total, awaiting, contacted, converted };
    }, [items]);

    const filteredItems = useMemo(() => {
        let list = items.slice();

        if (directionFilter !== "all") {
            list = list.filter((i) => i.direction === directionFilter);
        }
        if (statusFilter !== "all") {
            list = list.filter((i) => i.status === statusFilter);
        }

        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter((i) => {
                const other =
                    i.direction === "sent"
                        ? i.owner_name || ""
                        : i.sender_name || "";
                return (
                    (i.property_title || "").toLowerCase().includes(q) ||
                    (i.city || "").toLowerCase().includes(q) ||
                    (i.message || "").toLowerCase().includes(q) ||
                    String(other).toLowerCase().includes(q)
                );
            });
        }

        list.sort((a, b) => {
            const diff = new Date(b.created_at || 0) - new Date(a.created_at || 0);
            return sortKey === "oldest" ? -diff : diff;
        });
        return list;
    }, [items, directionFilter, statusFilter, searchQuery, sortKey]);

    const removeItem = async (id, title) => {
        setBusyId(id);
        try {
            await propertyService.removeInquiry(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success(`Inquiry for "${title || "property"}" removed.`);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to remove inquiry.");
        } finally {
            setBusyId(null);
        }
    };

    const changeStatus = async (id, status) => {
        const prev = items;
        setItems((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
        try {
            await propertyService.updateInquiryStatus(id, status);
            toast.success(`Marked as ${statusMeta(status).label}.`);
        } catch (err) {
            setItems(prev);
            toast.error(err?.response?.data?.message || err.message || "Failed to update status.");
        }
    };

    const counterpartyOf = (item) =>
        item.direction === "sent"
            ? {
                  name: item.owner_name || "Property owner",
                  mobile: item.owner_mobile,
                  email: item.owner_email,
              }
            : {
                  name: item.sender_name || "Interested buyer",
                  mobile: item.sender_mobile,
                  email: item.sender_email,
              };

    const coverOf = (item) => {
        if (item.images && item.images.length) return resolveImageUrl(item.images[0]);
        return PLACEHOLDER;
    };

    const statCards = [
        { key: "total", label: "Total Inquiries", value: stats.total, icon: MessageSquare, gradient: "from-[#0F2D52] via-[#153964] to-[#1E4C8C]" },
        { key: "awaiting", label: "Awaiting Reply", value: stats.awaiting, icon: Clock, gradient: "from-amber-400 to-amber-500" },
        { key: "contacted", label: "Contacted", value: stats.contacted, icon: Send, gradient: "from-sky-400 to-sky-500" },
        { key: "converted", label: "Converted", value: stats.converted, icon: CheckCircle2, gradient: "from-[#7CB93D] to-[#5A9E2B]" },
    ];

    const renderStatusControl = (item) =>
        item.direction === "received" ? (
            <select
                value={item.status}
                onChange={(e) => changeStatus(item.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                aria-label="Update inquiry status"
                className="appearance-none px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] text-slate-600 cursor-pointer"
            >
                <option value="New">Awaiting Reply</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
            </select>
        ) : (
            <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusMeta(item.status).badge}`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta(item.status).dot}`} />
                {statusMeta(item.status).label}
            </span>
        );

    const renderContactActions = (item) => {
        const other = counterpartyOf(item);
        const digits = other.mobile ? String(other.mobile).replace(/\D/g, "") : "";
        return (
            <div className="flex items-center gap-1.5">
                {digits && (
                    <a
                        href={`tel:${other.mobile}`}
                        title={`Call ${other.name}`}
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-[#153964] hover:border-[#153964]/30 transition-all"
                    >
                        <Phone size={14} />
                    </a>
                )}
                {digits && (
                    <a
                        href={`https://wa.me/${digits}`}
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp"
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-[#7CB93D] hover:border-[#7CB93D]/40 transition-all"
                    >
                        <MessageCircle size={14} />
                    </a>
                )}
                {other.email && (
                    <a
                        href={`mailto:${other.email}`}
                        title="Email"
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-[#153964] hover:border-[#153964]/30 transition-all"
                    >
                        <Mail size={14} />
                    </a>
                )}
            </div>
        );
    };

    return (
        <>
            <SEO
                title="My Inquiries | Edge Mile Realty"
                description="Track every property enquiry you have sent and every lead received on your listings."
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
                                    <MessageSquare size={14} className="text-[#8BC53F]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                                        Inquiry Desk
                                    </span>
                                </div>
                                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                                    My Inquiries
                                </h1>
                                <p className="text-white/55 text-sm mt-3 max-w-lg">
                                    Every enquiry you have sent — and every lead on your listings — tracked in one place.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/properties")}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7CB93D] hover:bg-[#8BC53F] text-white text-sm font-bold rounded-xl shadow-[0_10px_30px_-8px_rgba(124,185,61,0.55)] transition-all active:scale-[0.98] shrink-0"
                            >
                                Browse Properties
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
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by property, city, person, or message…"
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
                                        value={directionFilter}
                                        onChange={(e) => setDirectionFilter(e.target.value)}
                                        className="appearance-none pl-9 pr-8 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="sent">Sent by Me</option>
                                        <option value="received">Received</option>
                                    </select>
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="New">Awaiting Reply</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>

                                <select
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value)}
                                    className="appearance-none px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium bg-[#F7FAFC] focus:bg-white focus:outline-none focus:border-[#7CB93D] transition-all text-slate-700 cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>

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
                                <span className="text-slate-600 font-bold">{items.length}</span>{" "}
                                {items.length === 1 ? "inquiry" : "inquiries"}
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
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F2D52] to-[#1E4C8C] flex items-center justify-center text-white mx-auto shadow-lg mb-5">
                                <Inbox size={26} />
                            </div>
                            <h3 className="font-display text-xl text-slate-800 font-medium">
                                {items.length === 0 ? "No inquiries yet" : "No matching inquiries"}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                                {items.length === 0
                                    ? "Open any property and send an enquiry — it will show up here. Leads on your listings land here too."
                                    : "Try adjusting search, type, or status filters."}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    items.length === 0
                                        ? navigate("/properties")
                                        : (setSearchQuery(""),
                                          setDirectionFilter("all"),
                                          setStatusFilter("all"))
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
                            {filteredItems.map((item) => {
                                const meta = statusMeta(item.status);
                                const dir = DIRECTION_META[item.direction] || DIRECTION_META.sent;
                                const other = counterpartyOf(item);
                                const isBusy = busyId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden hover:shadow-[0_12px_32px_-8px_rgba(21,57,100,0.16)] hover:-translate-y-0.5 transition-all group flex flex-col"
                                    >
                                        <div
                                            className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/properties/details/${item.property_id}`)}
                                        >
                                            <img
                                                src={coverOf(item)}
                                                alt={item.property_title || "Property"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.src = PLACEHOLDER;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                                            <span
                                                className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm backdrop-blur ${dir.badge}`}
                                            >
                                                {dir.label}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(item.id, item.property_title);
                                                }}
                                                disabled={isBusy}
                                                title="Remove inquiry"
                                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white shadow-md transition-all disabled:opacity-60"
                                            >
                                                {isBusy ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={15} />
                                                )}
                                            </button>

                                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow">
                                                <span className="text-sm font-extrabold text-[#153964]">
                                                    {formatPrice(item.price)}
                                                </span>
                                                {item.property_for === "Rent" && (
                                                    <span className="text-[10px] text-slate-500 font-bold">/mo</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3
                                                    className="font-bold text-slate-800 line-clamp-1 cursor-pointer hover:text-[#153964] transition-colors"
                                                    onClick={() => navigate(`/properties/details/${item.property_id}`)}
                                                >
                                                    {item.property_title || "Untitled property"}
                                                </h3>
                                                <span
                                                    className={`shrink-0 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badge}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                    {meta.label}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1 line-clamp-1">
                                                <MapPin size={12} className="shrink-0" />
                                                {item.city || item.address || "Location not set"}
                                            </p>

                                            {item.message && (
                                                <p className="text-[13px] text-slate-600 italic leading-relaxed mt-3 bg-[#F7FAFC] border border-slate-100 rounded-xl px-3 py-2.5 line-clamp-2">
                                                    “{item.message}”
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2.5 mt-3.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white shrink-0">
                                                    <User size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-700 truncate">
                                                        {other.name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 font-medium">
                                                        {item.direction === "sent" ? "Owner" : "Buyer"} ·{" "}
                                                        {formatDate(item.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                                {renderStatusControl(item)}
                                                <div className="flex items-center gap-1.5">
                                                    {renderContactActions(item)}
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/properties/details/${item.property_id}`)}
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
                                {filteredItems.map((item) => {
                                    const meta = statusMeta(item.status);
                                    const dir = DIRECTION_META[item.direction] || DIRECTION_META.sent;
                                    const other = counterpartyOf(item);
                                    const isBusy = busyId === item.id;
                                    return (
                                        <div
                                            key={item.id}
                                            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/70 transition-colors"
                                        >
                                            <div
                                                className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer"
                                                onClick={() => navigate(`/properties/details/${item.property_id}`)}
                                            >
                                                <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                                                    <img
                                                        src={coverOf(item)}
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
                                                            {item.property_title || "Untitled property"}
                                                        </h3>
                                                        <span
                                                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${dir.badge}`}
                                                        >
                                                            {dir.label}
                                                        </span>
                                                        <span
                                                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badge}`}
                                                        >
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                                                        <MapPin size={11} className="shrink-0" />
                                                        {item.city || item.address || "—"}
                                                        {item.message ? ` · “${item.message}”` : ""}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-slate-500">
                                                        <span className="font-extrabold text-[#153964] text-sm">
                                                            {formatPrice(item.price)}
                                                            {item.property_for === "Rent" && "/mo"}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-slate-400">
                                                            <User size={11} /> {other.name}
                                                        </span>
                                                        <span className="text-slate-400">
                                                            {formatDate(item.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:justify-end shrink-0 flex-wrap">
                                                {renderStatusControl(item)}
                                                {renderContactActions(item)}
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/properties/details/${item.property_id}`)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] rounded-xl hover:from-[#0F2D52] hover:to-[#153964] transition-all"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id, item.property_title)}
                                                    disabled={isBusy}
                                                    title="Remove"
                                                    className="p-2.5 rounded-xl border border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-60"
                                                >
                                                    {isBusy ? (
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
