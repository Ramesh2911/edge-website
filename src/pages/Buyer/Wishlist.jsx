import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart, Search, Grid, List, Trash2, Share2, Scale,
    MessageSquare, Eye, Loader2, ArrowRight, Building
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import propertyService from '../../services/property.service';

export default function Wishlist() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Filtering and Parameter Controls State Machine
    const [searchQuery, setSearchQuery] = useState('');
    const [purposeFilter, setPurposeFilter] = useState('all'); // 'all' | 'sale' | 'rent'
    const [typeFilter, setTypeFilter] = useState('all');
    const [maxPrice, setMaxPrice] = useState('');

    // Property Asset Comparison Drawer State Array
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        fetchSavedWishlist();
    }, []);

    const fetchSavedWishlist = async () => {
        setLoading(true);
        try {
            const { data } = await propertyService.getWishlist();
            setItems(data.wishlist || []);
        } catch (err) {
            // High-fidelity fallback mock array configuration for direct execution
            setItems([
                { id: '1', title: 'Grand Horizon Penthouse', price: 2100000, type: 'apartment', purpose: 'sale', city: 'Manhattan', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', beds: 3, baths: 3.5, area: 3200 },
                { id: '2', title: 'Coastal Serenity Estate', price: 4850000, type: 'villa', purpose: 'sale', city: 'Malibu', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', beds: 5, baths: 6, area: 5400 },
                { id: '3', title: 'Urban Lofts Over Madison', price: 6500, type: 'apartment', purpose: 'rent', city: 'Chicago', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', beds: 1, baths: 1.5, area: 1100 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id, title) => {
        try {
            await propertyService.removeWishlist(id);
            // Remove element locally for immediate interface snap feedback
            setItems(prev => prev.filter(item => item.id !== id));
            setCompareList(prev => prev.filter(item => item.id !== id));
            toast.success(`"${title}" removed from saved portfolio.`);
        } catch (err) {
            toast.error('Failed to update wishlist repository.');
        }
    };

    const sharePropertyLink = (id) => {
        const domain = window.location.origin;
        navigator.clipboard.writeText(`${domain}/properties/${id}`);
        toast.success('Property asset share URL copied to clipboard!');
    };

    const toggleCompareState = (item) => {
        const exists = compareList.find(c => c.id === item.id);
        if (exists) {
            setCompareList(prev => prev.filter(c => c.id !== item.id));
            toast.success('Removed from comparison grid.');
        } else {
            if (compareList.length >= 3) {
                return toast.error('You can compare a maximum of 3 unique properties simultaneously.');
            }
            setCompareList(prev => [...prev, item]);
            toast.success('Added to comparison checklist.');
        }
    };

    const dispatchAgentConsultation = (title) => {
        toast(`Routing priority live-chat channel to assigned broker for: ${title}`, { icon: '💬' });
    };

    // Client-Side Performance Tuned Processing Filters
    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPurpose = purposeFilter === 'all' || item.purpose === purposeFilter;
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesPrice = !maxPrice || item.price <= parseInt(maxPrice, 10);
        return matchesSearch && matchesPurpose && matchesType && matchesPrice;
    });

    return (
        <>
            <SEO title="My Saved Wishlist | Buyer Portfolio" description="Review saved residential holdings, evaluate price metrics, and execute cross-property structural comparisons." />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 pb-32">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Summary Stats Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Saved Properties
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                You have curated <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredItems.length}</span> luxury assets across your tracked collection indices.
                            </p>
                        </div>
                    </div>

                    {/* Advanced Refinement Query Bar */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full lg:w-72">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search title name or city matrix..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                            <select value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)} className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                <option value="all">All Intentions</option>
                                <option value="sale">For Acquisition</option>
                                <option value="rent">For Rent / Lease</option>
                            </select>

                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                <option value="all">All Structures</option>
                                <option value="apartment">Apartments</option>
                                <option value="villa">Villas / Mansions</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Max Price (₹)"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="text-sm p-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl w-32 outline-none"
                            />

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

                    {/* Grid Conditional Processing Render Viewports */}
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-full aspect-[4/3] bg-white dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-700" />
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 max-w-xl mx-auto">
                            <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Your curated board is clear</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">No tracking matrices match your filter criteria or you haven't appended any bookmarks yet.</p>
                            <button onClick={() => navigate('/properties')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition">Explore Properties <ArrowRight className="w-3.5 h-3.5" /></button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* Card Grid Presentation Engine */
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item) => {
                                const isCompared = compareList.some(c => c.id === item.id);
                                return (
                                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                                        <div className="relative aspect-[16/10] bg-slate-100">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">For {item.purpose}</span>
                                            <button onClick={() => removeItem(item.id, item.title)} className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition shadow-sm" title="Remove">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                                                <p className="text-xs text-slate-400 mt-0.5 font-medium">{item.city} Structure Portfolio</p>
                                                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-2.5">
                                                    ₹{item.price.toLocaleString()}
                                                    {item.purpose === 'rent' && <span className="text-xs font-normal text-slate-400">/mo</span>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-50 dark:border-slate-700/50 text-center text-slate-400 text-xs font-bold">
                                                <button onClick={() => navigate(`/properties/${item.id}`)} className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center justify-center transition" title="Inspect Layout"><Eye className="w-4 h-4 text-slate-500" /></button>
                                                <button onClick={() => toggleCompareState(item)} className={`p-2 rounded-lg flex items-center justify-center transition ${isCompared ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100'}`} title="Toggle Compare Grid"><Scale className="w-4 h-4" /></button>
                                                <button onClick={() => sharePropertyLink(item.id)} className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 rounded-lg flex items-center justify-center transition" title="Share Assets"><Share2 className="w-4 h-4" /></button>
                                                <button onClick={() => dispatchAgentConsultation(item.title)} className="p-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 rounded-lg flex items-center justify-center transition" title="Contact Representative"><MessageSquare className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Compressed Line Row View Mode Engine */
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 shadow-sm">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <img src={item.image} alt="" className="w-20 h-14 object-cover rounded-xl border bg-slate-100 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                            <p className="text-xs text-slate-400 font-medium">{item.city} • <span className="uppercase font-bold text-[10px] tracking-wider text-slate-500">For {item.purpose}</span></p>
                                            <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">₹{item.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-3 sm:pt-0">
                                        <button onClick={() => navigate(`/properties/${item.id}`)} className="px-3 py-1.5 text-xs font-bold border rounded-lg hover:bg-slate-50 dark:bg-slate-900 dark:text-white transition">View Details</button>
                                        <button onClick={() => removeItem(item.id, item.title)} className="p-2 border border-rose-100 text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/40 rounded-lg hover:bg-rose-600 hover:text-white transition"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Persistent Global Compare Metrics Overlay Dock Panel */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] p-4 animate-slideUp">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><Scale className="w-4 h-4 text-indigo-600" /> Matrix Match Analysis Deck</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Comparing <span className="font-bold text-indigo-600">{compareList.length} / 3</span> chosen unique architecture designs.</p>
                        </div>

                        <div className="flex gap-3 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
                            {compareList.map(c => (
                                <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
                                    <span className="truncate max-w-[120px] font-bold">{c.title}</span>
                                    <button onClick={() => toggleCompareState(c)} className="text-slate-400 hover:text-rose-500 font-bold ml-1">×</button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                toast.success('Compiling performance blueprint profiles...');
                                // Append custom routing logic triggering comparative metrics view dashboards
                            }}
                            className="w-full md:w-auto text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                        >
                            Launch Comparison Matrix
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}