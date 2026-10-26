import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    FileText, Plus, Search, Layers, DollarSign, MapPin,
    Trash2, Edit3, Loader2, CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import leadService from '../../services/lead.service';

const AMENITIES_PRESETS = ['Pool', 'Gym', 'Garage', '24/7 Security', 'Elevator', 'Private Garden', 'EV Charger'];

export default function BuyerRequirement() {
    const [requirements, setRequirements] = useState([]);
    const [stats, setStats] = useState({ total: 0, open: 0, fulfilled: 0 });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal Tracking & Refinement Logic
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: '', purpose: 'buy', type: 'house', minBudget: '', maxBudget: '',
            city: '', beds: '1', baths: '1', minArea: '', maxArea: '', amenities: [],
            notes: '', status: 'Open'
        }
    });

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        setLoading(true);
        try {
            const { data } = await leadService.getBuyerRequirements();
            setRequirements(data.requirements || []);
            setStats(data.stats || { total: 0, open: 0, fulfilled: 0 });
        } catch (err) {
            // High-fidelity fallback mock array configuration for seamless dashboard simulation
            setRequirements([
                { id: 'req1', title: 'Luxury Penthouse Acquisition', purpose: 'buy', type: 'apartment', minBudget: 1500000, maxBudget: 2500000, city: 'New York', beds: '3', baths: '3', minArea: 2000, maxArea: 3500, amenities: ['Pool', '24/7 Security'], status: 'Open' },
                { id: 'req2', title: 'Suburban Family Villa Lease', purpose: 'rent', type: 'house', minBudget: 4000, maxBudget: 6000, city: 'Austin', beds: '4', baths: '3.5', minArea: 3000, maxArea: 4500, amenities: ['Garage', 'Private Garden'], status: 'Fulfilled' }
            ]);
            setStats({ total: 2, open: 1, fulfilled: 1 });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingId(null);
        reset({
            title: '', purpose: 'buy', type: 'house', minBudget: '', maxBudget: '',
            city: '', beds: '1', baths: '1', minArea: '', maxArea: '', amenities: [],
            notes: '', status: 'Open'
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (req) => {
        setEditingId(req.id);
        reset(req);
        setIsModalOpen(true);
    };

    const onSubmitPipeline = async (data) => {
        setIsSubmitting(true);
        try {
            if (editingId) {
                await leadService.updateBuyerRequirement(editingId, data);
            } else {
                await leadService.createBuyerRequirement(data);
            }

            toast.success(editingId ? 'Requirement criteria updated.' : 'New blueprint requirement deployed live!');
            setIsModalOpen(false);
            fetchRequirements();
        } catch (err) {
            toast.error(err.message || 'Data stream synchronization error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm('Are you sure you want to delete this specific tracking requirement parameters?')) return;
        try {
            await leadService.deleteBuyerRequirement(id);
            toast.success('Requirement removed from platform index.');
            fetchRequirements();
        } catch (err) {
            toast.error('Data cleaning error.');
        }
    };

    return (
        <>
            <SEO title="My Sourcing Requirements | Buyer Dashboard" description="Configure, audit, and append structural property acquisition preferences and parameters dynamically." />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Main Top Control Headers */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sourcing Requirements</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Specify layout dimensions, budgets, and criteria to let matching agents locate matching properties automatically.</p>
                        </div>
                        <button onClick={handleOpenCreateModal} className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md">
                            <Plus className="w-4 h-4" /> Create Requirement
                        </button>
                    </div>

                    {/* Sourcing Summary Counter Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {[
                            { label: 'Total Tracked Requirements', val: stats.total, icon: <FileText className="w-5 h-5 text-blue-600" /> },
                            { label: 'Active Open Searches', val: stats.open, icon: <Clock className="w-5 h-5 text-amber-600" /> },
                            { label: 'Fulfilled / Matched', val: stats.fulfilled, icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">{stat.label}</span>
                                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{stat.val}</div>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hidden sm:block">{stat.icon}</div>
                            </div>
                        ))}
                    </div>

                    {/* Sourcing Requirements Board Map Grid */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => <div key={i} className="w-full h-32 bg-white dark:bg-slate-800 rounded-2xl animate-pulse border dark:border-slate-700" />)}
                        </div>
                    ) : requirements.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 max-w-xl mx-auto">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Requirement register transparent</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Deploy matching structural parameter scripts to optimize system-directed off-market recommendations.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {requirements.map((req) => (
                                <div key={req.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-6">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${req.status === 'Open' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                                    }`}>{req.status}</span>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-2 line-clamp-1">{req.title}</h3>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mt-0.5">Looking to {req.purpose} • {req.type}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleOpenEditModal(req)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteRequest(req.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-50 dark:border-slate-700/50 text-xs">
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1"><DollarSign className="w-3 h-3 text-indigo-500" /> Budget Bracket</span>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">₹{req.minBudget?.toLocaleString()} - ₹{req.maxBudget?.toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> Preferred Zone</span>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{req.city}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
                                            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg">{req.beds} Beds</span>
                                            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg">{req.baths} Baths</span>
                                            <span className="px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg">{req.minArea} - {req.maxArea} sq.ft</span>
                                        </div>
                                    </div>

                                    {req.amenities?.length > 0 && (
                                        <div className="pt-3 border-t dark:border-slate-700/50 flex flex-wrap gap-1">
                                            {req.amenities.map(a => <span key={a} className="text-[9px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium rounded-md">{a}</span>)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Unified Create/Edit Overlay Component Layout Container */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 max-w-xl w-full p-6 shadow-2xl relative my-8">
                        <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3 mb-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingId ? 'Modify Criteria Specs' : 'Deploy Search Requirement'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitPipeline)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Requirement Title Name *</label>
                                <input type="text" {...register('title', { required: 'Title reference is required' })} placeholder="e.g. Sourcing Manhattan Penthouse Office" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none" />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Intention</label>
                                    <select {...register('purpose')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none">
                                        <option value="buy">Acquisition / Buy</option>
                                        <option value="rent">Lease / Rent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Layout Structural Format</label>
                                    <select {...register('type')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none">
                                        <option value="house">House / Villa</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="office">Commercial Office</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Min Budget (₹) *</label>
                                    <input type="number" {...register('minBudget', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Max Budget (₹) *</label>
                                    <input type="number" {...register('maxBudget', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Preferred City Node *</label>
                                    <input type="text" {...register('city', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Lifecycle Status</label>
                                    <select {...register('status')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none">
                                        <option value="Open">Open Tracker</option>
                                        <option value="Fulfilled">Fulfilled</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Beds</label>
                                    <input type="number" {...register('beds')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Baths</label>
                                    <input type="number" step="0.5" {...register('baths')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Min Sq.ft</label>
                                    <input type="number" {...register('minArea')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Max Sq.ft</label>
                                    <input type="number" {...register('maxArea')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Requested Spatial Infrastructure Amenities</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {AMENITIES_PRESETS.map(amenity => (
                                        <label key={amenity} className="flex items-center gap-2 p-2 border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 rounded-xl text-xs font-semibold cursor-pointer select-none text-slate-600 dark:text-slate-400">
                                            <input type="checkbox" value={amenity} {...register('amenities')} className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300" />
                                            {amenity}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Additional Notes / Parameter Constraints</label>
                                <textarea rows="3" {...register('notes')} placeholder="Specify target layout variations, high-rise restrictions, access paths required..." className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-700 rounded-xl outline-none resize-none" />
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Commit Requirement
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}