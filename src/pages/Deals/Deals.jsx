import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  DollarSign,
  Clock,
  Building2,
  User,
  ChevronRight,
  Filter,
  Plus,
  X,
  Trash2,
  Loader2,
  Phone,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import dealService from "../../services/deal.service";
import propertyService from "../../services/property.service";

const STAGE_CONFIG = {
  initial: { label: "Initial Contact", color: "bg-slate-100 text-slate-600 border-slate-200" },
  offer: { label: "Offer Made", color: "bg-blue-50 text-blue-700 border-blue-200" },
  negotiation: { label: "Negotiation", color: "bg-amber-50 text-amber-700 border-amber-200" },
  closed: { label: "Closed Won", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const STAGE_PROGRESS = { initial: 15, offer: 40, negotiation: 65, closed: 100 };

const FILTERS = ["all", "initial", "offer", "negotiation", "closed"];

const formatCurrency = (val) => {
  const v = Number(val) || 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)} L`;
  return `₹${v.toLocaleString("en-IN")}`;
};

const relTime = (d) => {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-[#F7FAFC] px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15 transition-all";
const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

const EMPTY_FORM = { propertyId: "", buyerName: "", buyerPhone: "", dealValue: "", stage: "initial", notes: "" };

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [showAdd, setShowAdd] = useState(false);
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [savingId, setSavingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDeals = async () => {
    try {
      const res = await dealService.getDeals();
      setDeals(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setDeals([]);
      toast.error(err?.response?.data?.message || "Failed to load deals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const openAdd = async () => {
    setShowAdd(true);
    if (myProperties.length || loadingProps) return;
    setLoadingProps(true);
    try {
      const res = await propertyService.getMyProperties();
      setMyProperties(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load your properties.");
    } finally {
      setLoadingProps(false);
    }
  };

  const closeAdd = () => {
    setShowAdd(false);
    setForm(EMPTY_FORM);
  };

  const submitDeal = async (e) => {
    e.preventDefault();
    if (!form.propertyId) return toast.error("Select a property.");
    if (!form.buyerName.trim()) return toast.error("Buyer name is required.");
    if (!(Number(form.dealValue) > 0)) return toast.error("Enter a valid deal value.");
    setSubmitting(true);
    try {
      await dealService.createDeal({
        propertyId: Number(form.propertyId),
        buyerName: form.buyerName.trim(),
        buyerPhone: form.buyerPhone.trim() || null,
        dealValue: Number(form.dealValue),
        stage: form.stage,
        notes: form.notes.trim() || null,
      });
      toast.success("Deal created successfully.");
      closeAdd();
      fetchDeals();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create deal.");
    } finally {
      setSubmitting(false);
    }
  };

  const changeStage = async (id, stage) => {
    setSavingId(id);
    try {
      await dealService.updateDealStage(id, stage);
      setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
      toast.success(`Moved to ${STAGE_CONFIG[stage]?.label || stage}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update stage.");
    } finally {
      setSavingId(null);
    }
  };

  const removeDeal = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await dealService.removeDeal(confirmDelete.id);
      toast.success("Deal removed.");
      setConfirmDelete(null);
      fetchDeals();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove deal.");
    } finally {
      setDeleting(false);
    }
  };

  const dealsToShow = filter === "all" ? deals : deals.filter((d) => d.stage === filter);
  const closedDeals = deals.filter((d) => d.stage === "closed").length;
  const pipelineValue = deals
    .filter((d) => d.stage !== "closed")
    .reduce((s, d) => s + (Number(d.deal_value) || 0), 0);

  return (
    <>
      <SEO
        title="Deal Management | Edge Mile Realty"
        description="Track and manage your real estate deals from offer to close."
      />

      <div className="min-h-screen bg-[#F7FAFC] pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
              <circle cx="150" cy="100" r="160" stroke="#8BC53F" strokeWidth="1" />
              <path d="M0 140 L200 90 L400 130 L600 70 L800 110" stroke="#8BC53F" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                  <Handshake size={14} className="text-[#8BC53F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                    Deal Management
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                  Track Every Deal
                  <br />
                  From Offer to Close
                </h1>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3.5 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">{loading ? "…" : deals.length}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Total</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3.5 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-[#8BC53F]">{loading ? "…" : closedDeals}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Closed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3.5 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {loading ? "…" : formatCurrency(pipelineValue)}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Pipeline</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + New Deal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_32px_-8px_rgba(21,57,100,0.1)] p-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={16} className="text-slate-400 mr-1 hidden sm:block" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                    filter === f
                      ? "bg-[#153964] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "All Deals" : STAGE_CONFIG[f]?.label || f}
                </button>
              ))}
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:shadow-lg hover:shadow-[#1E4C8C]/25 transition-all"
            >
              <Plus size={16} />
              New Deal
            </button>
          </div>
        </div>

        {/* Deal Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-56 bg-slate-200 rounded-lg" />
                    <div className="h-3 w-72 bg-slate-100 rounded-lg" />
                    <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : dealsToShow.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
              <Handshake size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">
                {deals.length === 0 ? "No deals yet" : "No deals found"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {deals.length === 0
                  ? "Create your first deal to start tracking it from offer to close."
                  : "No deals match the current filter."}
              </p>
              {deals.length === 0 && (
                <button
                  onClick={openAdd}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  New Deal
                </button>
              )}
            </div>
          ) : (
            dealsToShow.map((deal) => {
              const stage = STAGE_CONFIG[deal.stage] || STAGE_CONFIG.initial;
              const progress = STAGE_PROGRESS[deal.stage] ?? 15;
              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-6 hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white shadow-md shrink-0">
                      <Building2 size={22} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-800 truncate">
                          {deal.property_title || "Property"}
                        </h3>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${stage.color}`}>
                          {stage.label}
                        </span>
                        {deal.city && (
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                            {deal.city}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400" />
                          {deal.buyer_name}
                        </span>
                        {deal.buyer_phone && (
                          <a
                            href={`tel:${deal.buyer_phone}`}
                            className="flex items-center gap-1.5 hover:text-[#7CB93D] transition-colors"
                          >
                            <Phone size={14} className="text-slate-400" />
                            {deal.buyer_phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1.5 font-semibold text-[#1E4C8C]">
                          <DollarSign size={14} className="text-[#7CB93D]" />
                          {formatCurrency(deal.deal_value)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {relTime(deal.updated_at)}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              progress === 100
                                ? "bg-emerald-500"
                                : progress >= 50
                                ? "bg-amber-400"
                                : "bg-blue-400"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500 w-9 text-right">{progress}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <select
                          value={deal.stage}
                          disabled={savingId === deal.id}
                          onChange={(e) => changeStage(deal.id, e.target.value)}
                          className="rounded-xl border border-slate-200 bg-[#F7FAFC] px-2.5 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-[#7CB93D] focus:ring-2 focus:ring-[#7CB93D]/15 cursor-pointer disabled:opacity-60"
                          aria-label="Change deal stage"
                        >
                          {Object.entries(STAGE_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setConfirmDelete(deal)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Remove deal"
                        >
                          <Trash2 size={15} />
                        </button>
                        {savingId === deal.id && <Loader2 size={14} className="animate-spin text-[#1E4C8C]" />}
                      </div>
                      <Link
                        to={`/properties/details/${deal.property_id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E4C8C] hover:text-[#7CB93D] transition-colors"
                      >
                        View
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* New Deal Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#0F2D52] to-[#1E4C8C] px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-2.5">
                  <Handshake size={18} className="text-[#8BC53F]" />
                  <h3 className="font-display text-lg text-white">New Deal</h3>
                </div>
                <button onClick={closeAdd} className="text-white/70 hover:text-white transition-colors" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={submitDeal} className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Property *</label>
                  {loadingProps ? (
                    <div className={`${inputCls} animate-pulse`}>&nbsp;</div>
                  ) : myProperties.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
                      You have no properties yet.{" "}
                      <Link to="/add-property" className="font-bold text-[#1E4C8C] hover:text-[#7CB93D]">
                        Add a property
                      </Link>{" "}
                      first.
                    </div>
                  ) : (
                    <select
                      className={inputCls}
                      value={form.propertyId}
                      onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                    >
                      <option value="">Select property…</option>
                      {myProperties.map((p) => (
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
                    <label className={labelCls}>Buyer Name *</label>
                    <input
                      className={inputCls}
                      value={form.buyerName}
                      onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                      placeholder="e.g. Rajesh Mehta"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Buyer Phone</label>
                    <input
                      className={inputCls}
                      value={form.buyerPhone}
                      onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Deal Value (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      className={inputCls}
                      value={form.dealValue}
                      onChange={(e) => setForm({ ...form, dealValue: e.target.value })}
                      placeholder="e.g. 12500000"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Stage</label>
                    <select
                      className={inputCls}
                      value={form.stage}
                      onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    >
                      {Object.entries(STAGE_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Notes</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Negotiation notes…"
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
                    disabled={submitting || loadingProps || myProperties.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting && <Loader2 size={15} className="animate-spin" />}
                    Create Deal
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
              <h3 className="text-lg font-bold text-slate-800">Remove this deal?</h3>
              <p className="text-sm text-slate-500 mt-1.5">
                “{confirmDelete.property_title}” deal with {confirmDelete.buyer_name} will be permanently removed.
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={removeDeal}
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
