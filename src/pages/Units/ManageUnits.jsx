import { useState } from "react";
import {
  Boxes,
  Search,
  Building2,
  BedDouble,
  Bath,
  Ruler,
  Tag,
  Filter,
  ChevronRight,
} from "lucide-react";
import SEO from "../../components/Contact/SEO";

const MOCK_UNITS = [
  {
    id: 1,
    unit: "A-1201",
    project: "Emerald Heights",
    type: "3 BHK",
    area: "1,450 sqft",
    floor: "12th",
    price: 18500000,
    status: "available",
    beds: 3,
    baths: 3,
  },
  {
    id: 2,
    unit: "A-1202",
    project: "Emerald Heights",
    type: "2 BHK",
    area: "1,100 sqft",
    floor: "12th",
    price: 13200000,
    status: "sold",
    beds: 2,
    baths: 2,
  },
  {
    id: 3,
    unit: "B-0805",
    project: "Emerald Heights",
    type: "4 BHK",
    area: "2,200 sqft",
    floor: "8th",
    price: 28500000,
    status: "available",
    beds: 4,
    baths: 4,
  },
  {
    id: 4,
    unit: "C-0301",
    project: "Lakeview Villas",
    type: "Villa",
    area: "3,500 sqft",
    floor: "Ground",
    price: 45000000,
    status: "reserved",
    beds: 5,
    baths: 5,
  },
  {
    id: 5,
    unit: "B-1503",
    project: "Emerald Heights",
    type: "3 BHK",
    area: "1,520 sqft",
    floor: "15th",
    price: 21000000,
    status: "available",
    beds: 3,
    baths: 3,
  },
  {
    id: 6,
    unit: "D-0102",
    project: "Lakeview Villas",
    type: "Villa",
    area: "3,200 sqft",
    floor: "Ground",
    price: 42000000,
    status: "sold",
    beds: 4,
    baths: 4,
  },
];

const STATUS_CONFIG = {
  available: { label: "Available", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  sold: { label: "Sold", classes: "bg-slate-100 text-slate-600 border-slate-200" },
  reserved: { label: "Reserved", classes: "bg-amber-50 text-amber-700 border-amber-200" },
};

const FILTERS = ["all", "available", "sold", "reserved"];

const formatINR = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
};

export default function ManageUnits() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  let units = filter === "all" ? MOCK_UNITS : MOCK_UNITS.filter((u) => u.status === filter);
  if (search.trim()) {
    const q = search.toLowerCase();
    units = units.filter(
      (u) =>
        u.unit.toLowerCase().includes(q) ||
        u.project.toLowerCase().includes(q) ||
        u.type.toLowerCase().includes(q)
    );
  }

  const available = MOCK_UNITS.filter((u) => u.status === "available").length;
  const sold = MOCK_UNITS.filter((u) => u.status === "sold").length;

  return (
    <>
      <SEO
        title="Manage Units | Edge Mile Realty"
        description="View and manage inventory units across your projects."
      />

      <div className="min-h-screen bg-[#F7FAFC] pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={i}
                  x={480 + i * 60}
                  y={40 + (i % 2) * 20}
                  width="45"
                  height={80 + (i % 3) * 30}
                  stroke="#8BC53F"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                  <Boxes size={14} className="text-[#8BC53F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                    Manage Units
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                  Inventory
                  <br />
                  Management
                </h1>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-2 sm:px-4 py-3.5 text-center">
                  <p className="text-base sm:text-2xl font-bold text-white">{MOCK_UNITS.length}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Total</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-2 sm:px-4 py-3.5 text-center">
                  <p className="text-base sm:text-2xl font-bold text-[#8BC53F]">{available}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Available</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-2 sm:px-4 py-3.5 text-center">
                  <p className="text-base sm:text-2xl font-bold text-white">{sold}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_32px_-8px_rgba(21,57,100,0.1)] p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by unit number, project, or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15 transition-all placeholder:text-slate-400"
              />
            </div>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={15} className="text-slate-400 hidden sm:block" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                    filter === f
                      ? "bg-[#153964] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "All Units" : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Units Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {units.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
              <Boxes size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No units found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {search ? "Try a different search term." : "No units match the current filter."}
              </p>
            </div>
          ) : (
            units.map((unit) => {
              const status = STATUS_CONFIG[unit.status];
              return (
                <div
                  key={unit.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300 group cursor-pointer"
                >
                  {/* Unit header */}
                  <div className="bg-gradient-to-r from-[#153964] to-[#1E4C8C] px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white text-xs font-bold">
                        {unit.unit.split("-")[0]}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white leading-none">{unit.unit}</p>
                        <p className="text-[11px] text-white/50 mt-0.5">{unit.project}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Unit body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={15} className="text-[#7CB93D]" />
                        <span className="text-sm font-bold text-slate-800">{unit.type}</span>
                      </div>
                      <span className="text-base font-bold text-[#153964]">
                        {formatINR(unit.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-50 rounded-lg py-2 flex flex-col items-center gap-0.5">
                        <BedDouble size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">{unit.beds} Beds</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg py-2 flex flex-col items-center gap-0.5">
                        <Bath size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">{unit.baths} Baths</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg py-2 flex flex-col items-center gap-0.5">
                        <Ruler size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">{unit.area}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Floor: <span className="font-semibold text-slate-700">{unit.floor}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E4C8C] group-hover:text-[#7CB93D] transition-colors">
                        Details
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
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
