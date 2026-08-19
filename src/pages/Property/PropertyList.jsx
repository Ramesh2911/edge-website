import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import SEO from '../../components/Contact/SEO';
import PropertyFilter from '../../components/property/PropertyFilter';
import PropertyCard from '../../components/property/PropertyCard';
import API from '../../services/api';

// Skeleton Component for Content Loading States
const PropertySkeleton = ({ viewMode }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden animate-pulse border border-slate-100 dark:border-slate-700 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
        <div className={`bg-slate-200 dark:bg-slate-700 ${viewMode === 'list' ? 'h-48 w-full md:w-64' : 'h-48 w-full'}`} />
        <div className="p-5 flex-1 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="pt-4 grid grid-cols-3 gap-2"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" /><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" /><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" /></div>
        </div>
    </div>
);

const PropertyList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Read current layout page parameter or fallback to 1
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Build query payload directly from active URL structural tracking
                const queryString = searchParams.toString();
                const { data } = await API.get(`/properties?${queryString}`);
                setProperties(data.listings || []);
            } catch (error) {
                console.error("Failed syncing property telemetry pipeline:", error);
                // Fallback or empty layout configuration triggering
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [searchParams]);

    const handlePageChange = (newPage) => {
        searchParams.set('page', newPage.toString());
        setSearchParams(searchParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <SEO
                title="Browse Premium Real Estate Portfolios | Properties Listings"
                description="Explore luxury residential, commercial real estate holdings, and structural listings optimized across global territories."
            />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
                {/* Banner Section */}
                <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center bg-[url('/assets/grid-bg.svg')] bg-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Find Your Next Destination</h1>
                    <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm md:text-base">Use advanced parameter sorting fields to find the perfect space.</p>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="lg:grid lg:grid-cols-4 gap-8">

                        {/* Sidebar Filter Layout - Desktop */}
                        <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit sticky top-6">
                            <PropertyFilter />
                        </aside>

                        {/* Main Content Pane */}
                        <main className="lg:col-span-3 space-y-6">
                            {/* Toolbar Controls */}
                            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </button>

                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Showing <span className="text-slate-900 dark:text-white font-bold">{properties.length}</span> Results
                                </div>

                                {/* Grid / List Toggles */}
                                <div className="flex items-center gap-2 border border-slate-100 dark:border-slate-700 p-1 rounded-lg">
                                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}>
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}>
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Data Grid Conditional Engine */}
                            {loading ? (
                                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                    {[...Array(6)].map((_, i) => <PropertySkeleton key={i} viewMode={viewMode} />)}
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">No properties match your current filter settings.</p>
                                    <button onClick={() => setSearchParams({})} className="mt-4 text-sm text-indigo-600 font-bold hover:underline">Reset All Parameters</button>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                    {properties.map((property) => (
                                        <PropertyCard key={property._id || property.id} property={property} layoutMode={viewMode} />
                                    ))}
                                </div>
                            )}

                            {/* Production Pagination Row */}
                            {properties.length > 0 && (
                                <div className="flex items-center justify-center gap-4 pt-6">
                                    <button disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm font-medium disabled:opacity-50">Previous</button>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Page {currentPage}</span>
                                    <button onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-sm font-medium">Next</button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* Slide-out Drawer Filter Overlays for Mobile Layouts */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm">
                    <div className="relative ml-auto w-full max-w-xs h-full bg-white dark:bg-slate-900 p-6 shadow-xl overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Refine Searches</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="text-sm font-bold text-slate-500">Close</button>
                        </div>
                        <PropertyFilter onApply={() => setIsMobileFilterOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyList;