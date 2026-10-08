import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Heart,
    Share2,
    ShieldCheck,
    Loader2,
    Clock,
    MapPin,
    ChevronRight,
    Home,
    AlertTriangle,
} from 'lucide-react';
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

const SIMILAR_FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';

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
    Approved: {
        label: 'Identity & Title Verified',
        className: 'bg-gold-pale text-gold-dark border-gold-light',
    },
    Pending: {
        label: 'Verification in Progress',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    Rejected: {
        label: 'Verification Failed',
        className: 'bg-clay/10 text-clay border-clay/20',
    },
};

// Raw DB row → PropertyCard shape (similar listings)
const toCard = (r) => ({
    id: r.id,
    images: Array.isArray(r.images) && r.images.length ? r.images : [SIMILAR_FALLBACK_IMAGE],
    title: r.property_title,
    propertyType: r.property_type,
    listingType: (r.property_for || 'Sale') === 'Rent' ? 'Rent' : 'Sale',
    price: parseFloat(r.price || 0),
    address: [r.address, r.city].filter(Boolean).join(', ') || [r.city, r.state].filter(Boolean).join(', '),
    area: r.area != null ? parseFloat(r.area) : null,
    areaUnit: r.area_unit || 'sq.ft',
    bedrooms: r.bedroom ?? null,
    bathrooms: r.bathroom ?? null,
    parking: r.parking ?? null,
    verified: r.property_status === 'Approved',
    postedBy: { role: 'Owner', name: '' },
});

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
                // NOTE: similar listings use the PUBLIC /properties/latest endpoint —
                // /properties/all is admin-protected and its 401 kicked users to /login.
                const [propRes, similarRes] = await Promise.all([
                    propertyService.getPropertyById(id),
                    propertyService.getLatestProperties(),
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
                        facing: rawProperty.facing,
                        floor: rawProperty.floor,
                        totalFloors: rawProperty.total_floors,
                        propertyAge: rawProperty.property_age,
                    },

                    extraSpecs: {
                        balcony: rawProperty.balcony,
                        ownership: rawProperty.ownership,
                        construction_status: rawProperty.construction_status,
                        possession_date: formatPossessionDate(rawProperty.possession_date),
                    },

                    description: rawProperty.description,

                    amenities: rawProperty.amenities?.length ? rawProperty.amenities : ['Parking', 'Ownership Transferable'],

                    coordinates: { lat, lng },
                    nearby: rawProperty.nearby || [],

                    agent: rawProperty.agent || {
                        name: 'Premium Brokerage',
                        role: 'Property Consultant',
                        phone: '+91 98765 43210',
                        email: 'info@edgerealty.com',
                    },
                };

                setProperty(normalizedProperty);

                // 4. Seed recommended properties (public endpoint), excluding current id
                const rawSimilar = similarRes?.data?.data || similarRes?.data || [];
                if (Array.isArray(rawSimilar)) {
                    setSimilarProperties(
                        rawSimilar
                            .filter((item) => String(item.id) !== String(id))
                            .slice(0, 3)
                            .map(toCard)
                    );
                }
            } catch (err) {
                console.error('Data mapping resolution breakdown:', err);
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
        toast.success('Property link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2 className="w-9 h-9 animate-spin text-gold" />
                    <p className="font-display text-lg text-charcoal-deep">Curating the listing…</p>
                    <p className="text-xs text-stone">Pulling photos, pricing & locality insights</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4 py-16">
                <div className="bg-white rounded-2xl border border-charcoal/5 shadow-card px-8 py-10 text-center max-w-md">
                    <span className="w-14 h-14 rounded-full bg-cream-deep flex items-center justify-center mx-auto mb-5">
                        <AlertTriangle size={24} className="text-gold-dark" />
                    </span>
                    <p className="font-display text-xl text-charcoal-deep font-medium">
                        Listing Record Not Available
                    </p>
                    <p className="text-sm text-stone mt-2">
                        This property may have been sold, removed, or the link is incorrect.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                        <button
                            onClick={() => navigate('/properties')}
                            className="bg-charcoal-deep hover:bg-charcoal text-cream text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
                        >
                            Browse Properties
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="border border-charcoal/15 hover:border-gold text-charcoal-deep text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusMeta = STATUS_STYLES[property.status] || STATUS_STYLES.Pending;

    return (
        <>
            <SEO
                title={`${property.title} | Edge Mile Realty`}
                description={`Explore ${property.title} listed for ${property.purpose === 'rent' ? 'rent' : 'sale'} at ₹${property.price.toLocaleString('en-IN')} on Edge Mile Realty.`}
                image={property.images?.[0]}
            />
            <Toaster position="top-right" />

            <main className="bg-cream min-h-screen pb-16">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-6">

                    {/* ================= Breadcrumb ================= */}
                    <nav className="flex items-center gap-1.5 text-xs text-stone mb-5 flex-wrap">
                        <Link to="/" className="flex items-center gap-1 hover:text-gold-dark transition-colors">
                            <Home size={12} />
                            Home
                        </Link>
                        <ChevronRight size={12} />
                        <Link to="/properties" className="hover:text-gold-dark transition-colors">
                            Properties
                        </Link>
                        <ChevronRight size={12} />
                        <span className="text-charcoal-deep font-semibold max-w-[240px] truncate">
                            {property.title}
                        </span>
                    </nav>

                    {/* ================= Title header ================= */}
                    <div className="bg-white rounded-2xl border border-charcoal/5 shadow-card p-5 sm:p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className={`text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-white ${property.purpose === 'rent' ? 'bg-charcoal-deep' : 'bg-[#6FA82C]'
                                            }`}
                                    >
                                        For {property.purpose}
                                    </span>

                                    {property.type && (
                                        <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-cream-deep text-charcoal-soft border border-charcoal/10">
                                            {property.type}
                                        </span>
                                    )}

                                    <span
                                        className={`flex items-center gap-1 text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${statusMeta.className}`}
                                    >
                                        <ShieldCheck size={12} /> {statusMeta.label}
                                    </span>
                                </div>

                                <h1 className="font-display text-2xl sm:text-3xl lg:text-[2.15rem] text-charcoal-deep font-medium mt-3 leading-tight">
                                    {property.title}
                                </h1>

                                <p className="flex items-start gap-1.5 text-sm text-stone mt-2">
                                    <MapPin size={14} className="mt-0.5 shrink-0" />
                                    {property.address || property.location}
                                    {property.pincode ? ` – ${property.pincode}` : ''}
                                </p>

                                {property.extraSpecs.possession_date && (
                                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gold-dark mt-2.5">
                                        <Clock size={13} />
                                        Possession: {property.extraSpecs.possession_date}
                                    </p>
                                )}
                            </div>

                            {/* Price + actions */}
                            <div className="shrink-0 lg:text-right border-t lg:border-t-0 border-charcoal/5 pt-4 lg:pt-0">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-dark">
                                    Price
                                </p>
                                <p className="font-display text-3xl sm:text-[2.1rem] text-charcoal-deep font-semibold leading-tight mt-0.5">
                                    {property.price > 0 ? `₹${property.price.toLocaleString('en-IN')}` : 'Price on Request'}
                                    {property.purpose === 'rent' && property.price > 0 && (
                                        <span className="text-sm font-normal text-stone"> /mo</span>
                                    )}
                                </p>

                                <div className="flex lg:justify-end items-center gap-2 mt-3">
                                    <button
                                        onClick={toggleWishlist}
                                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all active:scale-90 ${isWishlisted
                                            ? 'bg-red-50 border-red-200 text-red-500'
                                            : 'bg-cream-deep border-charcoal/10 text-charcoal-soft hover:border-gold hover:text-gold-dark'
                                            }`}
                                    >
                                        <Heart size={17} className={isWishlisted ? 'fill-red-500' : ''} />
                                    </button>
                                    <button
                                        onClick={shareProperty}
                                        aria-label="Share property"
                                        className="w-10 h-10 rounded-xl border bg-cream-deep border-charcoal/10 text-charcoal-soft hover:border-gold hover:text-gold-dark flex items-center justify-center transition-colors"
                                    >
                                        <Share2 size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= Core layout split ================= */}
                    <div className="grid lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <PropertyGallery images={property.images} title={property.title} />
                            <PropertyOverview overview={property.overview} description={property.description} />
                            <PropertyAmenities amenities={property.amenities} />
                            <PropertyLocation
                                address={property.address || property.location}
                                lat={property.coordinates.lat}
                                lng={property.coordinates.lng}
                                nearby={property.nearby}
                            />
                        </div>

                        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
                            <PropertyContact
                                contact={property.agent}
                                propertyTitle={property.title}
                            />
                        </div>
                    </div>

                    {/* ================= Similar listings ================= */}
                    {similarProperties.length > 0 && (
                        <section className="mt-12 pt-10 border-t border-charcoal/10">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                                <div>
                                    <span className="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">
                                        Similar Listings
                                    </span>
                                    <h3 className="font-display text-2xl sm:text-3xl text-charcoal-deep font-medium mt-1.5">
                                        Similar Premium Opportunities
                                    </h3>
                                </div>
                                <Link
                                    to="/properties"
                                    className="text-sm font-semibold text-gold-dark hover:text-gold transition-colors whitespace-nowrap"
                                >
                                    View all properties →
                                </Link>
                            </div>

                            <PropertyGrid
                                properties={similarProperties}
                                onViewDetails={(sid) => navigate(`/properties/details/${sid}`)}
                            />
                        </section>
                    )}

                </div>
            </main>
        </>
    );
}
