import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Phone,
  Heart,
  Building2,
  Users,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import SEO from "../../components/Contact/SEO";

const MOCK_METRICS = [
  {
    title: "Total Views",
    value: "12,458",
    change: "+18.2%",
    up: true,
    icon: Eye,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Inquiries",
    value: "342",
    change: "+12.5%",
    up: true,
    icon: Phone,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Wishlists",
    value: "891",
    change: "+24.1%",
    up: true,
    icon: Heart,
    color: "from-rose-500 to-rose-600",
  },
  {
    title: "Site Visits",
    value: "156",
    change: "-3.2%",
    up: false,
    icon: Calendar,
    color: "from-amber-500 to-amber-600",
  },
];

const MOCK_MONTHLY = [
  { month: "May", views: 1800, leads: 42 },
  { month: "Jun", views: 2200, leads: 58 },
  { month: "Jul", views: 2600, leads: 65 },
  { month: "Aug", views: 3100, leads: 78 },
  { month: "Sep", views: 2900, leads: 71 },
  { month: "Oct", views: 3450, leads: 89 },
];

const MOCK_TOP_PROPERTIES = [
  { id: 1, title: "Skyline Luxury Penthouse", views: 2340, inquiries: 67, city: "Mumbai" },
  { id: 2, title: "Waterfront Modern Villa", views: 1890, inquiries: 45, city: "Goa" },
  { id: 3, title: "Green Valley Apartment", views: 1456, inquiries: 38, city: "Pune" },
  { id: 4, title: "Royal Heritage Bungalow", views: 1123, inquiries: 29, city: "Delhi" },
];

const RANGES = ["7d", "30d", "90d", "12m"];

export default function Reports() {
  const [range, setRange] = useState("30d");

  const maxViews = Math.max(...MOCK_MONTHLY.map((m) => m.views));

  return (
    <>
      <SEO
        title="Reports & Analytics | Edge Mile Realty"
        description="View performance analytics, traffic insights, and property metrics."
      />

      <div className="min-h-screen bg-[#F7FAFC] pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
              <path d="M0 160 L200 80 L400 130 L600 60 L800 100" stroke="#8BC53F" strokeWidth="2" />
              <circle cx="200" cy="80" r="6" fill="#8BC53F" />
              <circle cx="400" cy="130" r="6" fill="#8BC53F" />
              <circle cx="600" cy="60" r="6" fill="#8BC53F" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                  <BarChart3 size={14} className="text-[#8BC53F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                    Reports & Analytics
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                  Performance
                  <br />
                  Dashboard
                </h1>
              </div>
              <div className="flex gap-2">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      range === r
                        ? "bg-[#8BC53F] text-[#0F2D52] shadow-md"
                        : "bg-white/10 text-white/70 border border-white/15 hover:bg-white/20"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.title}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full ${
                        metric.up
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {metric.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{metric.title}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Monthly Views</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Property page views over time</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#153964]" />
                    Views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8BC53F]" />
                    Leads
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex items-end gap-2 sm:gap-4 h-48 min-w-[480px]">
                  {MOCK_MONTHLY.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          className="w-1/2 max-w-[20px] bg-gradient-to-t from-[#153964] to-[#1E4C8C] rounded-t-md transition-all duration-700 hover:opacity-80"
                          style={{ height: `${(m.views / maxViews) * 100}%` }}
                          title={`${m.views} views`}
                        />
                        <div
                          className="w-1/2 max-w-[20px] bg-gradient-to-t from-[#7CB93D] to-[#8BC53F] rounded-t-md transition-all duration-700 hover:opacity-80"
                          style={{ height: `${(m.leads / 100) * 100}%` }}
                          title={`${m.leads} leads`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Properties */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Top Properties</h3>
                  <p className="text-xs text-slate-400 mt-0.5">By views this period</p>
                </div>
                <Building2 size={18} className="text-slate-400" />
              </div>

              <div className="space-y-4">
                {MOCK_TOP_PROPERTIES.map((prop, i) => (
                  <div key={prop.id} className="flex items-center gap-3 group">
                    <span className="w-6 h-6 rounded-lg bg-[#EAF6DE] text-[#6FA82C] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#1E4C8C] transition-colors">
                        {prop.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {prop.city} · {prop.views.toLocaleString()} views · {prop.inquiries} leads
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-300 group-hover:text-[#7CB93D] transition-colors shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Row */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#153964] to-[#1E4C8C] rounded-2xl p-6 text-white shadow-lg">
              <Users size={22} className="text-[#8BC53F] mb-3" />
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-sm text-white/60 mt-1">Total Visitors</p>
              <p className="text-xs text-[#8BC53F] mt-2 font-semibold">↑ 22% vs last period</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)]">
              <Building2 size={22} className="text-[#153964] mb-3" />
              <p className="text-2xl font-bold text-slate-800">48</p>
              <p className="text-sm text-slate-500 mt-1">Active Listings</p>
              <p className="text-xs text-emerald-600 mt-2 font-semibold">↑ 4 new this month</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)]">
              <Phone size={22} className="text-[#7CB93D] mb-3" />
              <p className="text-2xl font-bold text-slate-800">89</p>
              <p className="text-sm text-slate-500 mt-1">Conversion Rate</p>
              <p className="text-xs text-emerald-600 mt-2 font-semibold">↑ 5.3% improvement</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
