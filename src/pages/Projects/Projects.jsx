import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  MapPin,
  Calendar,
  TrendingUp,
  Building2,
  HardHat,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";
import SEO from "../../components/Contact/SEO";

const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Emerald Heights",
    location: "Whitefield, Bangalore",
    type: "Residential Towers",
    units: 240,
    sold: 186,
    status: "under-construction",
    completion: "Dec 2026",
    progress: 72,
    value: "₹180 Cr",
  },
  {
    id: 2,
    name: "Riverside Business Park",
    location: "Hinjewadi, Pune",
    type: "Commercial Complex",
    units: 85,
    sold: 52,
    status: "under-construction",
    completion: "Jun 2027",
    progress: 45,
    value: "₹220 Cr",
  },
  {
    id: 3,
    name: "Lakeview Villas",
    location: "Gachibowli, Hyderabad",
    type: "Premium Villas",
    units: 48,
    sold: 48,
    status: "completed",
    completion: "Mar 2026",
    progress: 100,
    value: "₹95 Cr",
  },
  {
    id: 4,
    name: "Metro Square",
    location: "Salt Lake, Kolkata",
    type: "Mixed Use",
    units: 120,
    sold: 31,
    status: "planning",
    completion: "Mar 2028",
    progress: 10,
    value: "₹310 Cr",
  },
];

const STATUS_CONFIG = {
  planning: { label: "Planning", icon: Clock, classes: "bg-slate-100 text-slate-600 border-slate-200" },
  "under-construction": { label: "Under Construction", icon: HardHat, classes: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completed", icon: CheckCircle2, classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const FILTERS = ["all", "planning", "under-construction", "completed"];

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const projects =
    filter === "all"
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter((p) => p.status === filter);

  const totalUnits = MOCK_PROJECTS.reduce((s, p) => s + p.units, 0);
  const totalSold = MOCK_PROJECTS.reduce((s, p) => s + p.sold, 0);

  return (
    <>
      <SEO
        title="My Projects | Edge Mile Realty"
        description="Manage your real estate development projects and track progress."
      />

      <div className="min-h-screen bg-[#F7FAFC] pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
              <rect x="550" y="40" width="60" height="120" stroke="#8BC53F" strokeWidth="1" />
              <rect x="630" y="70" width="60" height="90" stroke="#8BC53F" strokeWidth="1" />
              <rect x="710" y="20" width="60" height="140" stroke="#8BC53F" strokeWidth="1" />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                  <FolderKanban size={14} className="text-[#8BC53F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                    My Projects
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                  Development
                  <br />
                  Projects
                </h1>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-white">{MOCK_PROJECTS.length}</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Projects</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-[#8BC53F]">{totalSold}</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">
                    Sold / {totalUnits}
                  </p>
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
                {f === "all" ? "All Projects" : STATUS_CONFIG[f]?.label || f}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid sm:grid-cols-2 gap-5">
          {projects.length === 0 ? (
            <div className="sm:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
              <FolderKanban size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No projects found</h3>
              <p className="text-sm text-slate-500 mt-1">No projects match the current filter.</p>
            </div>
          ) : (
            projects.map((project) => {
              const status = STATUS_CONFIG[project.status];
              const StatusIcon = status.icon;
              const soldPercent = Math.round((project.sold / project.units) * 100);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] overflow-hidden hover:shadow-[0_8px_32px_-8px_rgba(21,57,100,0.12)] transition-all duration-300 group"
                >
                  {/* Card header gradient */}
                  <div className="bg-gradient-to-r from-[#153964] to-[#1E4C8C] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                        <Building2 size={18} className="text-[#8BC53F]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{project.name}</h3>
                        <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} />
                          {project.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${status.classes}`}
                    >
                      <StatusIcon size={10} />
                      {status.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-50 rounded-xl py-3">
                        <p className="text-lg font-bold text-slate-800">{project.units}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Units</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl py-3">
                        <p className="text-lg font-bold text-[#7CB93D]">{project.sold}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Sold</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl py-3">
                        <p className="text-lg font-bold text-[#153964]">{project.value}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Value</p>
                      </div>
                    </div>

                    {/* Sales progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-600">Sales Progress</span>
                        <span className="font-bold text-[#7CB93D]">{soldPercent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7CB93D] to-[#8BC53F] rounded-full transition-all duration-700"
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Construction progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-600">Construction</span>
                        <span className="font-bold text-[#153964]">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#153964] to-[#1E4C8C] rounded-full transition-all duration-700"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={13} className="text-slate-400" />
                        Completion: {project.completion}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E4C8C] group-hover:text-[#7CB93D] transition-colors cursor-pointer">
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
