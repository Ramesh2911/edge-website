import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShieldCheck, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';

// Folder-mapped absolute imports matching your workspace
import PropertyGallery from '../../components/property/PropertyGallery';
import PropertyOverview from '../../components/property/PropertyOverview';
import PropertyAmenities from '../../components/property/PropertyAmenities';
import PropertyLocation from '../../components/property/PropertyLocation';
import PropertyContact from '../../components/property/PropertyContact';
import PropertyGrid from '../../components/property/PropertyGrid';

export default function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchPropertyData = async () => {
            setLoading(true);
            try {
                // Concurrent API fetching for main property details & recommendation context
                const [propRes, similarRes] = await Promise.all([
                    fetch(`/api/v1/properties/${id}`),
                    fetch(`/api/v1/properties?limit=3&exclude=${id}`)
                ]);

                if (!propRes.ok) throw new Error('Listing missing or expired');

                const propData = await propRes.json();
                const similarData = await similarRes.json();

                setProperty(propData.listing);
                setSimilarProperties(similarData.listings || []);
            } catch (err) {
                toast.error('Unable to retrieve property specs.');
                navigate('/properties');
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, [id, navigate]);

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from collection' : 'Saved to exclusive collection');
    };

    const shareProperty = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Asset URL link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium text-slate-500">Decrypting property matrix...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${property.title} | Premium Real Estate`}
                description={`Explore structural properties of ${property.title} listed for ${property.purpose} at $${property.price.toLocaleString()}.`}
                image={property.images?.[0]}
            />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 pt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Actions Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full text-white ${property.purpose === 'sale' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                                    For {property.purpose}
                                </span>
                                {property.isVerified && (
                                    <span className="flex items-center gap-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Identity & Title Verified
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">{property.title}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{property.address || property.location}</p>
                        </div>

                        <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 border-t md:border-0 pt-4 md:pt-0 border-slate-200">
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                                ${property.price?.toLocaleString()}
                                {property.purpose === 'rent' && <span className="text-sm text-slate-400 font-normal"> / mo</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={toggleWishlist} className={`p-2.5 rounded-xl border transition ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'}`}>
                                    <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                                </button>
                                <button onClick={shareProperty} className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 transition">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Core Layout Split */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-8 space-y-8">
                            <PropertyGallery images={property.images} />
                            <PropertyOverview specs={property.specs} description={property.description} />
                            <PropertyAmenities items={property.amenities} />
                            <PropertyLocation coordinates={property.coordinates} mapUrl={property.mapUrl} />
                        </div>

                        <div className="lg:col-span-4 sticky top-6">
                            <PropertyContact agent={property.agent || property.broker} />
                        </div>
                    </div>

                    {/* Content Recommendations Slider Context */}
                    {similarProperties.length > 0 && (
                        <section className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Similar Premium Opportunities</h3>
                            <PropertyGrid listings={similarProperties} />
                        </section>
                    )}

                </div>
            </main>
        </>
    );
}