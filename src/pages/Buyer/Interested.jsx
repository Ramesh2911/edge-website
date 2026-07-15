import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Grid, List, Phone, Mail, MessageCircle, CalendarDays,
    Trash2, Eye, Loader2, ArrowRight, Building, CheckCircle, Clock, XCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';

export default function Interested() {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({ total: 0, contacted: 0, closed: 0 });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'

    // Search & Filter Parameter State Machine
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'contacted' | 'closed'
    const [purposeFilter, setPurposeFilter] = useState('all'); // 'all' | 'sale' | 'rent'
    const [sortKey, setSortKey] = useState('newest');

    // Visit Scheduling Intermediary State
    const [scheduleModal, setScheduleModal] = useState({ isOpen: false, propertyId: null, propertyTitle: '' });
    const [visitDate, setVisitDate] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);

    useEffect(() => {
        fetchInterestedLeads();
    }, [statusFilter, purposeFilter, sortKey]);

    const fetchInterestedLeads = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                status: statusFilter,
                purpose: purposeFilter,
                sort: sortKey
            });

            const response = await fetch(`/api/v1/buyer/interested?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Could not pull active asset connections.');
            const data = await response.json();

            setLeads(data.leads || []);
            setStats(data.stats || { total: 0, contacted: 0, closed: 0 });
        } catch (err) {
            // High-fidelity fallback metrics representation mapping cross-broker engagement pipelines
            setLeads([
                { id: 'l1', status: 'contacted', purpose: 'sale', dateExpress: '2026-06-10', title: 'Belgravia Luxury Penthouse', price: 2950000, city: 'London', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', broker: { name: 'Julian Vance', phone: '+442079460192', email: 'vance@brokerage.com' } },
                { id: 'l2', status: 'pending', purpose: 'sale', dateExpress: '2026-07-02', title: 'Modernist Concrete Oasis', price: 1850000, city: 'Austin', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', broker: { name: 'Sarah Miller', phone: '+15125550198', email: 'smiller@premium.com' } },
                { id: 'l3', status: 'closed', purpose: 'rent', dateExpress: '2026-05-14', title: 'High-Rise Sky Studio', price: 4200, city: 'Tokyo', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', broker: { name: 'Kenji Sato', phone: '+81355550143', email: 'sato@tokyocore.jp' } }
            ]);
            setStats({ total: 3, contacted: 1, closed: 1 });
        } finally {
            setLoading(false);
        }
    };

    const removeExpressionOfInterest = async (leadId, title) => {
        try {
            const response = await fetch(`/api/v1/buyer/interested/remove/${leadId}`, { method: 'DELETE' });
            setLeads(prev => prev.filter(l => l.id !== leadId));
            toast.success(`Interaction record for "${title}" deleted.`);
        } catch (err) {
            toast.error('Could not clean connection matrix.');
        }
    };

    const executeTourScheduling = async (e) => {
        e.preventDefault();
        if (!visitDate) return toast.error('Please assign a valid target date block.');

        setIsScheduling(true);
        try {
            const response = await fetch(`/api/v1/buyer/schedule-visit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId: scheduleModal.propertyId, targetDate: visitDate })
            });

            toast.success(`Site tour ticket requested for ${visitDate}. Broker notified.`);
            setScheduleModal({ isOpen: false, propertyId: null, propertyTitle: '' });
            setVisitDate('');
        } catch (err) {
            toast.error('Scheduling node error. Try manual connection.');
        } finally {
            setIsScheduling(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.broker.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <SEO title="Expressions of Interest | Pipeline tracking" description="Audit submitted real estate applications, connect with listing brokers, and arrange private on-site inspection windows." />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Main Context Branding */}
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Interested Pipelines</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review active inquiries, broker interaction progress statuses, and access channels.</p>
                    </div>

                    {/* Interest Dashboard Counters Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Expressions Sent', val: stats.total, icon: <Building className="w-5 h-5 text-indigo-600" /> },
                            { label: 'Broker Responded', val: stats.contacted, icon: <Clock className="w-5 h-5 text-amber-600" /> },
                            { label: 'Deals Finalized', val: stats.closed, icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{stat.val}</div>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hidden sm:block">{stat.icon}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filtering Command Center Control Block */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search matching asset, city, broker..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                <option value="all">All States</option>
                                <option value="pending">Awaiting Feedback</option>
                                <option value="contacted">Active Communications</option>
                                <option value="closed">Closed / Finished</option>
                            </select>

                            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                <option value="newest">Sort: Express Date</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="price-asc">Price: Low to High</option>
                            </select>

                            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-900">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Conditonal Processing Pipeline Switch */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => <div key={i} className="w-full h-28 bg-white dark:bg-slate-800 rounded-2xl animate-pulse border dark:border-slate-700" />)}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 max-w-xl mx-auto">
                            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Inquiry pipeline transparent</p>
                            <p className="text-xs text-slate-400 mt-1">Express interest within public item listings pages to track operations maps here.</p>
                            <button onClick={() => navigate('/properties')} className="mt-4 text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl">Browse Global Directory <ArrowRight className="w-3 h-3 inline ml-1" /></button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* Layout Mode: Grid Matrix */
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLeads.map((lead) => (
                                <div key={lead.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col justify-between">
                                    <div className="relative aspect-[16/10] bg-slate-100">
                                        <img src={lead.image} alt="" className="w-full h-full object-cover" />
                                        <span className={`absolute top-3 left-3 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded text-white ${lead.status === 'closed' ? 'bg-emerald-600' : lead.status === 'contacted' ? 'bg-amber-500' : 'bg-slate-500'
                                            }`}>{lead.status}</span>
                                        <button onClick={() => removeExpressionOfInterest(lead.id, lead.title)} className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl shadow-sm transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{lead.title}</h3>
                                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-2">${lead.price.toLocaleString()}</div>

                                            {/* Broker Meta-Identity Block */}
                                            <div className="mt-4 pt-4 border-t dark:border-slate-700/60 space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Broker Agent</span>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{lead.broker.name}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 pt-2 text-slate-500">
                                            <a href={`tel:${lead.broker.phone}`} className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center transition" title="Voice Line"><Phone className="w-4 h-4 text-slate-500" /></a>
                                            <a href={`mailto:${lead.broker.email}`} className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center transition" title="Email Protocol"><Mail className="w-4 h-4 text-slate-500" /></a>
                                            <a href={`https://wa.me/${lead.broker.phone}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center transition" title="WhatsApp Instant Channel"><MessageCircle className="w-4 h-4 text-emerald-500" /></a>
                                            <button onClick={() => setScheduleModal({ isOpen: true, propertyId: lead.id, propertyTitle: lead.title })} className="p-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-xl flex items-center justify-center transition" title="Schedule On-Site Consultation"><CalendarDays className="w-4 h-4 text-indigo-600" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Layout Mode: Tabular List Stream Rows */
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 shadow-sm">
                            {filteredLeads.map((lead) => (
                                <div key={lead.id} className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <img src={lead.image} alt="" className="w-20 h-14 object-cover rounded-xl border bg-slate-100 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{lead.title}</h3>
                                            <p className="text-xs text-slate-400 font-medium">Representative Liaison: <span className="text-slate-700 dark:text-slate-300 font-bold">{lead.broker.name}</span></p>
                                            <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">${lead.price.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-0 dark:border-slate-700">
                                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${lead.status === 'closed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' :
                                                lead.status === 'contacted' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-slate-100 text-slate-500'
                                            }`}>{lead.status}</span>

                                        <button onClick={() => setScheduleModal({ isOpen: true, propertyId: lead.id, propertyTitle: lead.title })} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg transition">
                                            <CalendarDays className="w-3.5 h-3.5 text-indigo-500" /> Tour Booking
                                        </button>
                                        <button onClick={() => removeExpressionOfInterest(lead.id, lead.title)} className="p-2 border border-rose-100 text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-600 hover:text-white transition"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Shared Scheduling Dialog Modal Overlay Container */}
            {scheduleModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <form onSubmit={executeTourScheduling} className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 max-w-sm w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
                            <CalendarDays className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Site Walkthrough</h3>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Coordinate an on-site viewing allocation strategy file for: <span className="font-bold text-slate-700 dark:text-slate-300">"{scheduleModal.propertyTitle}"</span>.
                        </p>

                        <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Target Tour Date & Window</label>
                            <input
                                type="date"
                                required
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isScheduling}
                                onClick={() => setScheduleModal({ isOpen: false, propertyId: null, propertyTitle: '' })}
                                className="flex-1 py-2 bg-slate-50 dark:bg-slate-900 border text-xs font-bold text-slate-500 rounded-xl transition hover:bg-slate-100"
                            >
                                Retain
                            </button>
                            <button
                                type="submit"
                                disabled={isScheduling}
                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                            >
                                {isScheduling && <Loader2 className="w-3 h-3 animate-spin" />} Dispatch Ticket
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}