import { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
  Building2,
  User,
  Calendar,
} from "lucide-react";
import SEO from "../../components/Contact/SEO";

const MOCK_COMMISSIONS = [
  {
    id: 1,
    property: "Skyline Luxury Penthouse",
    client: "Rajesh Mehta",
    dealValue: 12500000,
    rate: 2,
    amount: 250000,
    status: "paid",
    date: "2026-10-15",
    method: "Bank Transfer",
  },
  {
    id: 2,
    property: "Waterfront Modern Villa",
    client: "Anita Desai",
    dealValue: 34500000,
    rate: 1.5,
    amount: 517500,
    status: "pending",
    date: "2026-11-05",
    method: "—",
  },
  {
    id: 3,
    property: "Green Valley Apartment",
    client: "Vikram Singh",
    dealValue: 8750000,
    rate: 2,
    amount: 175000,
    status: "paid",
    date: "2026-10-01",
    method: "UPI",
  },
  {
    id: 4,
    property: "Royal Heritage Bungalow",
    client: "Meera Iyer",
    dealValue: 56000000,
    rate: 1,
    amount: 560000,
    status: "processing",
    date: "2026-10-28",
    method: "Bank Transfer",
  },
];

const STATUS_CONFIG = {
  paid: { label: "Paid", icon: CheckCircle2, classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", icon: Clock, classes: "bg-amber-50 text-amber-700 border-amber-200" },
  processing: { label: "Processing", icon: TrendingUp, classes: "bg-blue-50 text-blue-700 border-blue-200" },
};

const FILTERS = ["all", "paid", "pending", "processing"];

const formatINR = (val) => `₹${val.toLocaleString("en-IN")}`;

export default function Commissions() {
  const [filter, setFilter] = useState("all");

  const list =
    filter === "all"
      ? MOCK_COMMISSIONS
      : MOCK_COMMISSIONS.filter((c) => c.status === filter);

  const totalEarned = MOCK_COMMISSIONS.filter((c) => c.status === "paid")
    .reduce((s, c) => s + c.amount, 0);
  const totalPending = MOCK_COMMISSIONS.filter((c) => c.status !== "paid")
    .reduce((s, c) => s + c.amount, 0);

  return (
    <>
      <SEO
        title="Commission Management | Edge Mile Realty"
        description="Track your commission earnings, pending payouts, and payment history."
      />

      <div className="min-h-screen bg-[#F7FAFC] pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
              <circle cx="700" cy="80" r="150" stroke="#8BC53F" strokeWidth="1" />
              <circle cx="700" cy="80" r="100" stroke="#8BC53F" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                  <IndianRupee size={14} className="text-[#8BC53F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                    Commission
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                  Your Earnings
                  <br />
                  & Payouts
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3.5 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-[#8BC53F]">{formatINR(totalEarned)}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Earned</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3.5 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">{formatINR(totalPending)}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_32px_-8px_rgba(21,57,100,0.1)] p-4 flex flex-wrap gap-2">
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
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Commission Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-4">
          {list.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
              <Wallet size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No commissions found</h3>
              <p className="text-sm text-slate-500 mt-1">Nothing matches the current filter.</p>
            </div>
          ) : (
            list.map((item) => {
              const status = STATUS_CONFIG[item.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-6 hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Amount */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1 sm:w-32 shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7CB93D] to-[#5A9E2B] flex items-center justify-center text-white shadow-md">
                        <IndianRupee size={24} />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-lg font-bold text-slate-800 leading-none">
                          {formatINR(item.amount)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.rate}% of deal</p>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-16 bg-slate-100" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-slate-800 truncate">
                          {item.property}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.classes}`}
                        >
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400" />
                          {item.client}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Building2 size={14} className="text-slate-400" />
                          Deal: {formatINR(item.dealValue)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          {item.date}
                        </span>
                        {item.method !== "—" && (
                          <span className="flex items-center gap-1.5">
                            <Wallet size={14} className="text-slate-400" />
                            {item.method}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
