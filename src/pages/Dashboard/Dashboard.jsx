import React, { useState, useEffect } from 'react';
import { Bell, Plus, Loader2, ArrowUpRight, MessageSquare, Clock, ShieldAlert } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';

// Folder-mapped components matching your exact workspace layout
import DashboardStats from '../../components/dashboard/DashboardStats';
import RecentProperty from '../../components/dashboard/RecentProperty';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    // 1. Initialize user state synchronously from localStorage to eliminate flicker/double renders
    const [user] = useState(() => {
        try {
            const storedUserRaw = localStorage.getItem('user');
            if (storedUserRaw) {
                const parsedUser = JSON.parse(storedUserRaw);
                return {
                    name: parsedUser.full_name || 'System Operator',
                    // Fallback to role_name converted to lowercase to match backend telemetry expectations
                    role: (parsedUser.role_name || 'buyer').toLowerCase(),
                    avatar: parsedUser.profile_image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
                };
            }
        } catch (error) {
            console.error("Failed to parse local session context:", error);
        }

        // Hard fallback if localStorage is empty
        return {
            name: 'Guest User',
            role: 'buyer',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
        };
    });

    // 2. Fetch telemetry nodes relying on the instantly initialized user role
    useEffect(() => {
        const fetchDashboardTelemetry = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v1/dashboard/analytics?role=${user.role}`);
                if (!response.ok) throw new Error('Failed to synchronize server analytical nodes.');
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                // High-fidelity fallback mocks to render effortlessly if endpoints aren't live yet
                setDashboardData({
                    stats: { total: '24', approved: '18', pending: '4', rejected: '2' },
                    recentProperties: [
                        { id: 1, title: 'Skyline Luxury Penthouse', price: 1250000, city: 'New York', status: 'publish' },
                        { id: 2, title: 'Waterfront Modern Villa', price: 3450000, city: 'Miami', status: 'pending' }
                    ],
                    recentLeads: [
                        { id: 101, name: 'Sophia Loren', email: 'sophia@example.com', target: 'Skyline Penthouse' },
                        { id: 102, name: 'Marcus Aurelius', email: 'marcus@example.com', target: 'Waterfront Villa' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardTelemetry();
    }, [user.role]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-sm font-semibold text-slate-500">Decrypting workspace environment...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Dynamic SEO Configuration targeted for Edge Mile Realty branding */}
            <SEO
                title={`${user.name}'s Console | Edge Mile Realty Control Center`}
                description="Manage listing status streams, monitor active luxury inventory pipelines, and parse buyer traffic metrics on Edge Mile Realty."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">

                {/* Profile Summary Header */}
                <header className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-black tracking-tight">Edge Mile Portal</h1>
                                    <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded bg-indigo-600 text-white shadow-sm">
                                        {user.role}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Operator: <span className="text-slate-200 font-bold">{user.name}</span></p>
                            </div>
                        </div>

                        {/* Quick Actions Shortcuts */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {user.role !== 'buyer' && (
                                <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md">
                                    <Plus className="w-4 h-4" /> Add Asset Listing
                                </button>
                            )}
                            <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 relative">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Core Layout Grid */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                    {/* Dashboard Statistics Cards Module Injection */}
                    <DashboardStats role={user.role} metrics={dashboardData?.stats} />

                    {/* Core Content Splitting Matrices */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* Left Data Column: Recent Listings Stream */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Real Estate Inventory</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Most recent updates across registered tracking records.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {dashboardData?.recentProperties.map((property) => (
                                    <RecentProperty key={property.id} data={property} />
                                ))}
                            </div>
                        </div>

                        {/* Right Data Column: Leads Tracking & Activity Feed */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Conditional UI Pipeline for Leads */}
                            {user.role !== 'buyer' && (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Acquired Leads</h3>
                                        <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded">Live Stream</span>
                                    </div>

                                    <div className="space-y-3">
                                        {dashboardData?.recentLeads.map((lead) => (
                                            <div key={lead.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/50 flex items-start gap-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-lg mt-0.5">
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{lead.name}</p>
                                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Inquired on: <span className="font-semibold">{lead.target}</span></p>
                                                </div>
                                                <button className="text-slate-400 hover:text-slate-600 p-1"><ArrowUpRight className="w-3.5 h-3.5" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Activity Logging Infrastructure */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">System Activity Logs</h3>

                                <div className="space-y-4 text-xs">
                                    <div className="flex gap-3 items-start">
                                        <div className="p-1 bg-emerald-50 text-emerald-600 rounded mt-0.5"><Clock className="w-3.5 h-3.5" /></div>
                                        <div className="flex-1">
                                            <p className="text-slate-600 dark:text-slate-300 font-medium">Metadata integrity pipeline synchronized successfully.</p>
                                            <span className="text-[10px] text-slate-400">4 mins ago</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="p-1 bg-amber-50 text-amber-600 rounded mt-0.5"><ShieldAlert className="w-3.5 h-3.5" /></div>
                                        <div className="flex-1">
                                            <p className="text-slate-600 dark:text-slate-300 font-medium">Listing #402 awaits compliance audit clearance.</p>
                                            <span className="text-[10px] text-slate-400">2 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}