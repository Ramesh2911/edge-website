import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShieldCheck, Loader2, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';

// Folder-mapped absolute imports matching your workspace
import PropertyGallery from '../../components/property/PropertyGallery';
import PropertyOverview from '../../components/property/PropertyOverview';
import PropertyAmenities from '../../components/property/PropertyAmenities';
import PropertyLocation from '../../components/property/PropertyLocation';
import PropertyContact from '../../components/property/PropertyContact';
import PropertyGrid from '../../components/property/PropertyGrid';
import propertyService from '../../services/property.service'; // Integrated API Service

// Fallback gallery when backend hasn't attached images yet
const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
];

const formatPossessionDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return null;
    }
};

const STATUS_STYLES = {
    Approved: { label: 'Identity & Title Verified', className: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50' },
    Pending: { label: 'Verification in Progress', className: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50' },
    Rejected: { label: 'Verification Failed', className: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50' },
};

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
                // 1. Fetch main property and similar listings concurrently
                const [propRes, similarRes] = await Promise.all([
                    propertyService.getPropertyById(id),
                    propertyService.getProperties ? propertyService.getProperties() : Promise.resolve({ data: [] })
                ]);

                // 2. Extract data from the backend payload structure
                const rawProperty = propRes?.data?.data;

                if (!rawProperty) {
                    throw new Error('Listing missing or expired');
                }

                const lat = parseFloat(rawProperty.latitude || 0) || null;
                const lng = parseFloat(rawProperty.longitude || 0) || null;

                // 3. Map backend database fields to the UI component schema
                const normalizedProperty = {
                    id: rawProperty.id,
                    title: rawProperty.property_title,
                    purpose: (rawProperty.property_for || 'Sale').toLowerCase(),
                    type: rawProperty.property_type,
                    price: parseFloat(rawProperty.price || 0),
                    address: rawProperty.address,
                    city: rawProperty.city,
                    state: rawProperty.state,
                    country: rawProperty.country,
                    pincode: rawProperty.pincode,
                    location: [rawProperty.city, rawProperty.state, rawProperty.country]
                        .filter(Boolean)
                        .join(', '),
                    status: rawProperty.property_status || 'Pending',
                    isVerified: rawProperty.property_status === 'Approved',
                    images: rawProperty.images?.length ? rawProperty.images : PLACEHOLDER_IMAGES,

                    // Shape required by <PropertyOverview overview={...} />
                    overview: {
                        area: rawProperty.area != null ? parseFloat(rawProperty.area) : null,
                        areaUnit: rawProperty.area_unit || 'sq.ft',
                        bedrooms: rawProperty.bedroom,
                        bathrooms: rawProperty.bathroom,
                        parking: rawProperty.parking,
                        propertyType: rawProperty.property_type,
                        furnishing: rawProperty.furnishing,
                        // Not present in current API response — safe to leave undefined,
                        // PropertyOverview already filters out null/undefined stats.
                        facing: rawProperty.facing,
                        floor: rawProperty.floor,
                        totalFloors: rawProperty.total_floors,
                        propertyAge: rawProperty.property_age,
                    },

                    // Extra specs not covered by PropertyOverview's stat grid,
                    // kept here in case other components need them.
                    extraSpecs: {
                        balcony: rawProperty.balcony,
                        ownership: rawProperty.ownership,
                        construction_status: rawProperty.construction_status,
                        possession_date: formatPossessionDate(rawProperty.possession_date),
                    },

                    description: rawProperty.description,

                    // Shape required by <PropertyAmenities amenities={...} />
                    amenities: rawProperty.amenities?.length ? rawProperty.amenities : ['Parking', 'Ownership Transferable'],

                    coordinates: { lat, lng },
                    nearby: rawProperty.nearby || [],

                    agent: rawProperty.agent || {
                        name: "Premium Brokerage",
                        phone: "+91 98765 43210",
                        email: "info@edgerealty.com"
                    }
                };

                setProperty(normalizedProperty);

                // 4. Safely seed recommended properties, excluding the current active view ID
                const rawSimilar = similarRes?.data?.data || similarRes?.data || [];
                if (Array.isArray(rawSimilar)) {
                    setSimilarProperties(
                        rawSimilar
                            .filter(item => String(item.id) !== String(id))
                            .slice(0, 3)
                    );
                }

            } catch (err) {
                console.error("Data mapping resolution breakdown:", err);
                toast.error('Unable to retrieve property specs.');
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, [id]);

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

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 text-center">
                <p className="text-lg font-bold text-slate-800 dark:text-white">Listing Record Not Available</p>
                <button onClick={() => navigate('/properties')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow">
                    Return to Directory
                </button>
            </div>
        );
    }

    const statusMeta = STATUS_STYLES[property.status] || STATUS_STYLES.Pending;

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

                                {property.type && (
                                    <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        {property.type}
                                    </span>
                                )}

                                <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${statusMeta.className}`}>
                                    <ShieldCheck className="w-3.5 h-3.5" /> {statusMeta.label}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">{property.title}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                {property.address || property.location}
                                {property.pincode ? ` – ${property.pincode}` : ''}
                            </p>

                            {property.extraSpecs.possession_date && (
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Possession: {property.extraSpecs.possession_date}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 border-t md:border-0 pt-4 md:pt-0 border-slate-200">
                            <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                                ₹{property.price?.toLocaleString()}
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
                            <PropertyOverview overview={property.overview} description={property.description} />
                            <PropertyAmenities amenities={property.amenities} />
                            <PropertyLocation
                                address={property.address || property.location}
                                lat={property.coordinates.lat}
                                lng={property.coordinates.lng}
                                nearby={property.nearby}
                            />
                        </div>

                        <div className="lg:col-span-4 sticky top-6">
                            <PropertyContact agent={property.agent} />
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