import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Grid, List, Eye, Edit3, Trash2,
    Copy, Zap, Loader2, AlertTriangle, Building, CheckCircle, Clock, XCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import propertyService from '../../services/property.service'; // Integrated API Service

export default function MyProperties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortKey, setSortKey] = useState('newest');

    // Deletion Modal Configuration
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, propertyId: null, propertyTitle: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUserInventory();
    }, [statusFilter, sortKey]);

    const fetchUserInventory = async () => {
        setLoading(true);
        try {
            // 1. Fetch data directly using your custom api service integration
            const propertiesResponse = await propertyService.getMyProperties();
            const statsResponse = await propertyService.dashboardStats();

            // Extract listings matching the database columns structure
            let listings = propertiesResponse.data.data || [];

            // 2. Perform frontend filtering to match state filters seamlessly
            if (statusFilter !== 'all') {
                listings = listings.filter(prop => {
                    const status = prop.property_status?.toLowerCase();
                    if (statusFilter === 'publish') return status === 'approved';
                    if (statusFilter === 'pending') return status === 'pending';
                    if (statusFilter === 'draft') return status === 'rejected';
                    return true;
                });
            }

            // 3. Perform sorting mapping on database keys
            if (sortKey === 'price-high') {
                listings.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
            } else if (sortKey === 'price-low') {
                listings.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
            } else {
                // newest first using created_at timestamp string comparisons
                listings.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            }

            setProperties(listings);

            // Handle dashboard analytics hydration maps safely from aggregated backend response
            if (statsResponse.data) {
                setStats({
                    total: statsResponse.data.data.total || 0,
                    approved: statsResponse.data.approved || 0,
                    pending: Math.max(0, (statsResponse.data.total || 0) - (statsResponse.data.approved || 0)),
                    rejected: 0 // structural zero fallback unless extended explicitly
                });
            }
        } catch (err) {
            toast.error(err.message || 'Error tracking user asset map rows.');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = async (id) => {
        // Simple client placeholder alert wrapper matching available service map endpoints
        toast.error('Duplication architecture pipeline requires server side cloning models.');
    };

    const triggerDeleteRequest = (id, title) => {
        setDeleteModal({ isOpen: true, propertyId: id, propertyTitle: title });
    };

    const confirmDeleteAction = async () => {
        setIsDeleting(true);
        try {
            // Wires up directly to deleteProperty endpoint parameter mapping context
            await propertyService.deleteProperty(deleteModal.propertyId);

            toast.success('Property removed from global directory.');
            setDeleteModal({ isOpen: false, propertyId: null, propertyTitle: '' });
            fetchUserInventory();
        } catch (err) {
            toast.error(err.message || 'Asset elimination sequence failed.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBoostListing = (title) => {
        toast(`Payment & placement infrastructure coming soon for: ${title}`, { icon: '🚀' });
    };

    // Filters properties instantaneously on matching key strings based on database columns mapping
    const filteredProperties = properties.filter(prop =>
        (prop.property_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.city || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <SEO title="My Properties Directory | Management Panel" description="Monitor real estate application metrics, listing approvals, modifications, and visibility parameters." />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Properties</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Supervise, update, upgrade, and audit your listed real estate portfolio holdings.</p>
                        </div>
                        <button
                            onClick={() => navigate('/add-property')}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" /> Create Listing
                        </button>
                    </div>

                    {/* Quick Analytics Cards Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Inventory', val: stats.total, icon: <Building className="w-5 h-5" />, color: 'bg-blue-50 border-blue-200 dark:bg-slate-800 dark:border-slate-700 text-blue-600' },
                            { label: 'Approved Live', val: stats.approved, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-emerald-50 border-emerald-200 dark:bg-slate-800 dark:border-slate-700 text-emerald-600' },
                            { label: 'Awaiting Audit', val: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-50 border-amber-200 dark:bg-slate-800 dark:border-slate-700 text-amber-600' },
                            { label: 'Rejected Flag', val: stats.rejected, icon: <XCircle className="w-5 h-5" />, color: 'bg-rose-50 border-rose-200 dark:bg-slate-800 dark:border-slate-700 text-rose-600' },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-5 rounded-2xl border flex items-center justify-between shadow-sm bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</div>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
                            </div>
                        ))}
                    </div>

                    {/* Command Block Filters */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search matching title strings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="publish">Live / Approved</option>
                                <option value="pending">Pending Audit</option>
                                <option value="draft">Rejected Flag</option>
                            </select>

                            <select
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                            >
                                <option value="newest">Sort: Newest First</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="price-low">Price: Low to High</option>
                            </select>

                            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 p-1 rounded-xl">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600' : 'text-slate-400'}`}>
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600' : 'text-slate-400'}`}>
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering Outputs Matrix */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-full h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-700" />
                            ))}
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg font-bold text-slate-900 dark:text-white">No active property layouts found</p>
                            <p className="text-sm text-slate-400 mt-1">Adjust search metrics or deploy an updated marketplace record placeholder.</p>
                        </div>
                    ) : viewMode === 'list' ? (
                        /* List / Table Grid Layout */
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                                            <th className="p-4">Property</th>
                                            <th className="p-4">Strategy</th>
                                            <th className="p-4">Value</th>
                                            <th className="p-4">Audit Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                                        {filteredProperties.map((prop) => (
                                            <tr key={prop.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                                                <td className="p-4 flex items-center gap-3">
                                                    <div className="w-14 h-10 object-cover rounded-lg border bg-slate-100 flex items-center justify-center text-slate-400 dark:bg-slate-900 dark:border-slate-700">
                                                        <Building className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{prop.property_title}</div>
                                                        <div className="text-xs text-slate-400 font-medium mt-0.5">{prop.city || 'City N/A'}, {prop.state || 'State N/A'}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 uppercase text-xs font-bold text-slate-500">{prop.property_for}</td>
                                                <td className="p-4 font-bold text-slate-900 dark:text-white">₹{Number(prop.price || 0).toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-full ${prop.property_status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                                                            prop.property_status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                                                        }`}>
                                                        {prop.property_status === 'Approved' ? 'Live' : prop.property_status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                                    <button onClick={() => navigate(`/properties/details/${prop.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 transition" title="View"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => navigate(`/properties/edit/${prop.id}`)} className="p-2 text-slate-400 hover:text-amber-500 transition" title="Edit"><Edit3 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDuplicate(prop.id)} className="p-2 text-slate-400 hover:text-blue-500 transition" title="Duplicate"><Copy className="w-4 h-4" /></button>
                                                    <button onClick={() => handleBoostListing(prop.property_title)} className="p-2 text-slate-400 hover:text-purple-500 transition" title="Boost"><Zap className="w-4 h-4" /></button>
                                                    <button onClick={() => triggerDeleteRequest(prop.id, prop.property_title)} className="p-2 text-slate-400 hover:text-rose-600 transition" title="Purge"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Grid View Structural Core Layout */
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((prop) => (
                                <div key={prop.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                                    <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:border-slate-700 border-b">
                                        <Building className="w-12 h-12" />
                                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">For {prop.property_for}</span>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{prop.property_title}</h3>
                                            <p className="text-xs text-slate-400 mt-1">{prop.address || `${prop.city || 'City'}, ${prop.state || 'State'}`}</p>
                                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-3">${Number(prop.price || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="flex justify-end gap-1 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <button onClick={() => navigate(`/properties/edit/${prop.id}`)} className="p-2 text-slate-400 hover:text-amber-500 transition"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => triggerDeleteRequest(prop.id, prop.property_title)} className="p-2 text-slate-400 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Shared Delete Confirmation Modal Layer */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 max-w-sm w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-600">
                            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Removal</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Are you sure you want to permanently delete <span className="font-bold text-slate-800 dark:text-slate-200">"{deleteModal.propertyTitle}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                disabled={isDeleting}
                                onClick={() => setDeleteModal({ isOpen: false, propertyId: null, propertyTitle: '' })}
                                className="flex-1 py-2.5 bg-slate-50 dark:bg-slate-900 border text-sm font-bold text-slate-500 rounded-xl transition hover:bg-slate-100 outline-none"
                            >
                                Retain
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={confirmDeleteAction}
                                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 outline-none"
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}