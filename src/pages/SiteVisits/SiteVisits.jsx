import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import siteVisitService from "../../services/siteVisit.service";
import propertyService from "../../services/property.service";

const STATUS_CONFIG = {
  Confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Pending: {
    label: "Pending",
    icon: Clock3,
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Completed: {
    label: "Completed",
    icon: CheckCircle2,
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Cancelled: {
    label: "Cancelled",
    icon: XCircle,
    classes: "bg-red-50 text-red-700 border-red-200",
  },
};

const STATUS_KEYS = ["Confirmed", "Pending", "Completed", "Cancelled"];
const FILTERS = ["all", "Confirmed", "Pending", "Completed", "Cancelled"];
const DIRECTIONS = ["all", "sent", "received"];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-[#F7FAFC] px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15 transition-all";
const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

const todayStr = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const to12h = (t) => {
  if (!t || !t.includes(":")) return t || "";
  const [hStr, m] = t.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const dateParts = (dateVal) => {
  if (!dateVal) return { day: "—", month: "" };
  const dt = new Date(dateVal);
  if (Number.isNaN(dt.getTime())) return { day: "—", month: "" };
  return {
    day: dt.getDate(),
    month: dt.toLocaleString("en", { month: "short" }),
  };
};

const fmtDate = (dateVal) => {
  if (!dateVal) return "";
  const dt = new Date(dateVal);
  if (Number.isNaN(dt.getTime())) return String(dateVal);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const EMPTY_FORM = { propertyId: "", visitDate: "", visitTime: "", notes: "" };

export default function SiteVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [direction, setDirection] = useState("all");

  const [showAdd, setShowAdd] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [savingId, setSavingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVisits = async () => {
    try {
      const res = await siteVisitService.getVisits();
      setVisits(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setVisits([]);
      toast.error(err?.response?.data?.message || "Failed to load site visits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const openAdd = async () => {
    setShowAdd(true);
    if (properties.length || loadingProps) return;
    setLoadingProps(true);
    try {
      const res = await propertyService.propertyList({ limit: 200 });
      setProperties(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load properties.");
    } finally {
      setLoadingProps(false);
    }
  };

  const closeAdd = () => {
    setShowAdd(false);
    setForm(EMPTY_FORM);
  };

  const submitVisit = async (e) => {
    e.preventDefault();
    if (!form.propertyId) return toast.error("Select a property.");
    if (!form.visitDate) return toast.error("Pick a visit date.");
    if (!form.visitTime) return toast.error("Pick a visit time.");
    setSubmitting(true);
    try {
      await siteVisitService.scheduleVisit({
        propertyId: Number(form.propertyId),
        visitDate: form.visitDate,
        visitTime: to12h(form.visitTime),
        notes: form.notes.trim() || null,
      });
      toast.success("Site visit scheduled. Awaiting confirmation.");
      closeAdd();
      fetchVisits();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to schedule visit.");
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (id, status) => {
    setSavingId(id);
    try {
      await siteVisitService.updateVisitStatus(id, status);
      setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      toast.success(`Visit marked as ${status.toLowerCase()}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingId(null);
    }
  };

  const removeVisit = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await siteVisitService.removeVisit(confirmDelete.id);
      toast.success("Site visit removed.");
      setConfirmDelete(null);
      fetchVisits();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove visit.");
    } finally {
      setDeleting(false);
    }
  };

  const visitsToShow = visits.filter(
    (v) =>
      (filter === "all" || v.status === filter) &&
      (direction === "all" || v.direction === direction)
  );
  const confirmedCount = visits.filter((v) => v.status === "Confirmed").length;
  const pendingCount = visits.filter((v) => v.status === "Pending").length;

  return (
    <>
      <SEO
        title="Site Visits | Edge Mile Realty"
        description="Manage your scheduled property site visits and track visit status."
      />

      <div className="min-h-screen bg-[#F7FAFC] pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
              <circle cx="650" cy="100" r="180" stroke="#8BC53F" strokeWidth="1" />
              <circle cx="650" cy="100" r="130" stroke="#8BC53F" strokeWidth="1" />
              <path d="M0 160 L150 100 L300 140 L450 80 L600 120 L800 60" stroke="#8BC53F" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                  <CalendarCheck size={14} className="text-[#8BC53F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                    Site Visits
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                  Schedule & Track
                  <br />
                  Property Visits
                </h1>
                <p className="text-white/60 text-sm mt-3 max-w-md">
                  Manage all your site visit appointments in one place. Confirm, reschedule, or track completed visits.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-white">{loading ? "…" : visits.length}</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Total</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-[#8BC53F]">{loading ? "…" : confirmedCount}</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Confirmed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-white">{loading ? "…" : pendingCount}</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Schedule */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_32px_-8px_rgba(21,57,100,0.1)] p-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filter === f
                      ? "bg-[#153964] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "All Visits" : STATUS_CONFIG[f]?.label || f}
                </button>
              ))}
              <span className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    direction === d
                      ? "bg-[#7CB93D]/15 text-[#3F6B12] border border-[#7CB93D]/40"
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {d === "all" ? "Any" : d === "sent" ? "Sent" : "Received"}
                </button>
              ))}
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:shadow-lg hover:shadow-[#1E4C8C]/25 transition-all"
            >
              <Plus size={16} />
              Schedule Visit
            </button>
          </div>
        </div>

        {/* Visit Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-56 bg-slate-200 rounded-lg" />
                    <div className="h-3 w-72 bg-slate-100 rounded-lg" />
                  </div>
                </div>
              </div>
            ))
          ) : visitsToShow.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
              <CalendarCheck size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">
                {visits.length === 0 ? "No site visits yet" : "No site visits found"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {visits.length === 0
                  ? "Schedule your first property visit to see it here."
                  : "No visits match the current filters."}
              </p>
              {visits.length === 0 && (
                <button
                  onClick={openAdd}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  Schedule Visit
                </button>
              )}
            </div>
          ) : (
            visitsToShow.map((visit) => {
              const status = STATUS_CONFIG[visit.status] || STATUS_CONFIG.Pending;
              const StatusIcon = status.icon;
              const { day, month } = dateParts(visit.visit_date);
              const isSent = visit.direction === "sent";
              const counterparty = isSent
                ? { name: visit.owner_name, mobile: visit.owner_mobile, role: "Owner" }
                : { name: visit.requester_name, mobile: visit.requester_mobile, role: "Visitor" };
              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-6 hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Date block */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1 sm:w-20 shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex flex-col items-center justify-center text-white shadow-md">
                        <span className="text-lg font-bold leading-none">{day}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">{month}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 sm:mt-1">
                        <Clock size={12} />
                        {visit.visit_time}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-20 bg-slate-100" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-slate-800 truncate">
                          {visit.property_title || "Property"}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.classes}`}
                        >
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border ${
                            isSent
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-violet-50 text-violet-700 border-violet-200"
                          }`}
                        >
                          {isSent ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                          {isSent ? "Sent" : "Received"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin size={14} className="shrink-0 text-slate-400" />
                          {[visit.address, visit.city].filter(Boolean).join(", ") || "Address not set"}
                        </span>
                        {counterparty.name && (
                          <span className="flex items-center gap-1.5">
                            <User size={14} className="shrink-0 text-slate-400" />
                            {counterparty.name}
                            <span className="text-[11px] font-semibold text-slate-400">({counterparty.role})</span>
                          </span>
                        )}
                        {counterparty.mobile && (
                          <a
                            href={`tel:${counterparty.mobile}`}
                            className="flex items-center gap-1.5 hover:text-[#7CB93D] transition-colors"
                          >
                            <Phone size={14} className="shrink-0 text-slate-400" />
                            {counterparty.mobile}
                          </a>
                        )}
                      </div>
                      {visit.notes && (
                        <p className="mt-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 italic truncate">
                          “{visit.notes}”
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        {isSent ? (
                          visit.status !== "Cancelled" && visit.status !== "Completed" ? (
                            <button
                              onClick={() => changeStatus(visit.id, "Cancelled")}
                              disabled={savingId === visit.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-60"
                            >
                              {savingId === visit.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                              Cancel Visit
                            </button>
                          ) : null
                        ) : (
                          <select
                            value={visit.status}
                            disabled={savingId === visit.id}
                            onChange={(e) => changeStatus(visit.id, e.target.value)}
                            className="rounded-xl border border-slate-200 bg-[#F7FAFC] px-2.5 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-[#7CB93D] focus:ring-2 focus:ring-[#7CB93D]/15 cursor-pointer disabled:opacity-60"
                            aria-label="Change visit status"
                          >
                            {STATUS_KEYS.map((k) => (
                              <option key={k} value={k}>
                                {STATUS_CONFIG[k].label}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          onClick={() => setConfirmDelete(visit)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Remove visit"
                        >
                          <Trash2 size={15} />
                        </button>
                        {savingId === visit.id && <Loader2 size={14} className="animate-spin text-[#1E4C8C]" />}
                      </div>
                      <Link
                        to={`/properties/details/${visit.property_id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E4C8C] hover:text-[#7CB93D] transition-colors"
                      >
                        View Property
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Schedule Visit Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#0F2D52] to-[#1E4C8C] px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-2.5">
                  <CalendarCheck size={18} className="text-[#8BC53F]" />
                  <h3 className="font-display text-lg text-white">Schedule a Visit</h3>
                </div>
                <button onClick={closeAdd} className="text-white/70 hover:text-white transition-colors" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={submitVisit} className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Property *</label>
                  {loadingProps ? (
                    <div className={`${inputCls} animate-pulse`}>&nbsp;</div>
                  ) : properties.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                      No properties available right now.
                    </div>
                  ) : (
                    <select
                      className={inputCls}
                      value={form.propertyId}
                      onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                    >
                      <option value="">Select property…</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.property_title}
                          {p.city ? ` — ${p.city}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Visit Date *</label>
                    <input
                      type="date"
                      min={todayStr()}
                      className={inputCls}
                      value={form.visitDate}
                      onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Visit Time *</label>
                    <input
                      type="time"
                      className={inputCls}
                      value={form.visitTime}
                      onChange={(e) => setForm({ ...form, visitTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Notes</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Anything the owner should know…"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAdd}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || loadingProps || properties.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting && <Loader2 size={15} className="animate-spin" />}
                    Schedule Visit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Remove this site visit?</h3>
              <p className="text-sm text-slate-500 mt-1.5">
                “{confirmDelete.property_title}” visit on {fmtDate(confirmDelete.visit_date)} will be permanently
                removed.
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={removeVisit}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {deleting && <Loader2 size={15} className="animate-spin" />}
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toaster position="top-right" />
    </>
  );
}
