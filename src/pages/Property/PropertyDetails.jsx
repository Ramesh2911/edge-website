import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Heart,
    Share2,
    ShieldCheck,
    Loader2,
    MapPin,
    AlertTriangle,
    Ruler,
    BedDouble,
    Bath,
    Car,
    Building2,
    Sofa,
    FileText,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';

import PropertyGallery from '../../components/property/PropertyGallery';
import PropertyOverview from '../../components/property/PropertyOverview';
import PropertyAmenities from '../../components/property/PropertyAmenities';
import PropertyLocation from '../../components/property/PropertyLocation';
import PropertyContact from '../../components/property/PropertyContact';
import PropertyGrid from '../../components/property/PropertyGrid';
import propertyService from '../../services/property.service';
import { resolveImageUrl } from '../../utils/imageUrl';
import { formatPrice } from '../../utils/formatPrice';

// Fallback gallery when the backend hasn't attached images yet.
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

// Guard against dirty area-unit values stored in the DB (e.g. a stray number).
const isValidAreaUnit = (u) =>
    /^(sq\.?\s?ft|sq\.?\s?m|sq\.?\s?yard|acres?|hectare|marla|guntha|cent)/i.test(
        String(u || '').trim()
    );

// Raw DB row → PropertyCard shape (similar listings)
const toCard = (r) => ({
    id: r.id,
    images:
        Array.isArray(r.images) && r.images.length
            ? r.images.map(resolveImageUrl)
            : [SIMILAR_FALLBACK_IMAGE],
    title: r.property_title,
    propertyType: r.property_type,
    listingType: (r.property_for || 'Sale') === 'Rent' ? 'Rent' : 'Sale',
    price: parseFloat(r.price || 0),
    address:
        [r.address, r.city].filter(Boolean).join(', ') ||
        [r.city, r.state].filter(Boolean).join(', '),
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
                // Similar listings use the PUBLIC /properties/latest endpoint —
                // /properties/all is admin-protected and its 401 kicked users to /login.
                const [propRes, similarRes] = await Promise.all([
                    propertyService.getPropertyById(id),
                    propertyService.getLatestProperties(),
                ]);

                const rawProperty = propRes?.data?.data;
                if (!rawProperty) throw new Error('Listing missing or expired');

                const lat = parseFloat(rawProperty.latitude || 0) || null;
                const lng = parseFloat(rawProperty.longitude || 0) || null;

                const rawImages = rawProperty.images?.length
                    ? rawProperty.images
                    : PLACEHOLDER_IMAGES;

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
                    // Resolve relative "/uploads/..." paths against the API origin.
                    images: rawImages.map(resolveImageUrl),

                    overview: {
                        area: rawProperty.area != null ? parseFloat(rawProperty.area) : null,
                        areaUnit: rawProperty.area_unit || 'sq.ft',
                        bedrooms: rawProperty.bedroom,
                        bathrooms: rawProperty.bathroom,
                        parking: rawProperty.parking,
                        balcony: rawProperty.balcony,
                        propertyType: rawProperty.property_type,
                        furnishing: rawProperty.furnishing,
                        facing: rawProperty.facing,
                        floor: rawProperty.floor,
                        totalFloors: rawProperty.total_floors,
                        propertyAge: rawProperty.property_age,
                        ownership: rawProperty.ownership,
                        construction_status: rawProperty.construction_status,
                        possession_date: formatPossessionDate(rawProperty.possession_date),
                    },

                    description: rawProperty.description,
                    floorPlan: rawProperty.floor_plan_url
                        ? resolveImageUrl(rawProperty.floor_plan_url)
                        : rawProperty.floor_plan
                          ? resolveImageUrl(`/uploads/property/floor-plans/${rawProperty.floor_plan}`)
                          : null,
                    amenities: rawProperty.amenities?.length
                        ? rawProperty.amenities
                        : ['Parking', 'Ownership Transferable'],
                    coordinates: { lat, lng },
                    nearby: rawProperty.nearby || [],

                    agent: rawProperty.agent || {
                        name: 'Premium Brokerage',
                        role: 'Property Consultant',
                        verified: true,
                        phone: '+91 98765 43210',
                        whatsapp: '919876543210',
                        email: 'info@edgerealty.com',
                        propertiesListed: 120,
                    },
                };

                setProperty(normalizedProperty);

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
                console.error('Property fetch failed:', err);
                toast.error('Unable to retrieve property specs.');
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, [id]);

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(
            isWishlisted ? 'Removed from collection' : 'Saved to exclusive collection'
        );
    };

    const shareProperty = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Property link copied to clipboard!');
    };

    const handleEnquiry = async (formData) => {
        try {
            await propertyService.interestedProperty(property.id, {
                message:
                    formData.message?.trim() ||
                    `Hi, I'm interested in ${property.title}. Please share more details.`,
            });
            toast.success('Enquiry sent — the owner will get back to you.');
        } catch (err) {
            if (err?.response?.status === 401) {
                toast.error('Please log in to send an enquiry.');
            } else {
                toast.error(err?.response?.data?.message || 'Could not send enquiry. Try again.');
            }
            throw err;
        }
    };

    // ---------- Loading ----------
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="relative w-14 h-14">
                        <span className="absolute inset-0 rounded-full border-2 border-gold-light/50" />
                        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
                    </span>
                    <div>
                        <p className="font-display text-lg text-charcoal-deep">
                            Curating the listing…
                        </p>
                        <p className="text-xs text-stone mt-1">
                            Pulling photos, pricing & locality insights
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ---------- Not found ----------
    if (!property) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4 py-16">
                <div className="bg-white rounded-3xl border border-charcoal/5 shadow-lift px-8 py-12 text-center max-w-md">
                    <span className="w-16 h-16 rounded-2xl bg-gold-pale/70 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={26} className="text-gold-dark" />
                    </span>
                    <p className="font-display text-2xl text-charcoal-deep font-medium">
                        Listing Not Available
                    </p>
                    <p className="text-sm text-stone mt-2.5 leading-relaxed">
                        This property may have been sold, removed, or the link is
                        incorrect.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
                        <button
                            onClick={() => navigate('/properties')}
                            className="bg-charcoal-deep hover:bg-charcoal text-cream text-sm font-semibold rounded-xl px-6 py-3.5 transition-colors"
                        >
                            Browse Properties
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="border border-charcoal/15 hover:border-gold text-charcoal-deep text-sm font-semibold rounded-xl px-6 py-3.5 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Headline facts for the bar under the hero.
    const ov = property.overview;
    const areaUnit = isValidAreaUnit(ov.areaUnit) ? ov.areaUnit : 'sq.ft';
    const areaLabel =
        ov.area != null ? `${ov.area.toLocaleString('en-IN')} ${areaUnit}` : null;

    const facts = [
        { icon: Ruler, label: 'Area', value: areaLabel },
        { icon: BedDouble, label: 'Bedrooms', value: ov.bedrooms },
        { icon: Bath, label: 'Bathrooms', value: ov.bathrooms },
        { icon: Car, label: 'Parking', value: ov.parking },
        { icon: Building2, label: 'Property Type', value: ov.propertyType },
        { icon: Sofa, label: 'Furnishing', value: ov.furnishing },
    ].filter((f) => f.value !== null && f.value !== undefined && f.value !== '');

    return (
        <>
            <SEO
                title={`${property.title} | Edge Mile Realty`}
                description={`Explore ${property.title} listed for ${
                    property.purpose === 'rent' ? 'rent' : 'sale'
                } at ₹${property.price.toLocaleString('en-IN')} on Edge Mile Realty.`}
                image={property.images?.[0]}
            />
            <Toaster position="top-right" />

            <main className="bg-cream min-h-screen pb-20">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-6">
                    {/* ================= Immersive hero ================= */}
                    <PropertyGallery
                        images={property.images}
                        title={property.title}
                        topRight={
                            <>
                                <button
                                    onClick={toggleWishlist}
                                    aria-label={
                                        isWishlisted
                                            ? 'Remove from wishlist'
                                            : 'Add to wishlist'
                                    }
                                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                                        isWishlisted
                                            ? 'bg-red-500/90 border-red-300/40 text-white'
                                            : 'bg-white/20 border-white/25 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <Heart
                                        size={17}
                                        className={isWishlisted ? 'fill-white' : ''}
                                    />
                                </button>
                                <button
                                    onClick={shareProperty}
                                    aria-label="Share property"
                                    className="w-11 h-11 rounded-full bg-white/20 border border-white/25 text-white hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors active:scale-90"
                                >
                                    <Share2 size={17} />
                                </button>
                            </>
                        }
                        overlay={
                            <>
                                {/* Badge row */}
                                <div className="flex flex-wrap items-center gap-2 mb-3.5">
                                    <span
                                        className={`text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-white ${
                                            property.purpose === 'rent'
                                                ? 'bg-charcoal-deep/70 backdrop-blur border border-white/20'
                                                : 'bg-[#6FA82C]'
                                        }`}
                                    >
                                        For {property.purpose}
                                    </span>

                                    {property.type && (
                                        <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white">
                                            {property.type}
                                        </span>
                                    )}

                                    {property.isVerified && (
                                        <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-gold/90 text-charcoal-deep">
                                            <ShieldCheck size={12} /> Verified
                                        </span>
                                    )}
                                </div>

                                {/* Title + price */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div className="min-w-0">
                                        <h1 className="font-display text-2xl sm:text-3xl lg:text-[2.4rem] text-white font-medium leading-tight drop-shadow-lg">
                                            {property.title}
                                        </h1>
                                        <p className="flex items-start gap-1.5 text-white/85 text-sm mt-2.5 drop-shadow">
                                            <MapPin
                                                size={14}
                                                className="mt-0.5 shrink-0"
                                            />
                                            {property.address || property.location}
                                            {property.pincode ? ` – ${property.pincode}` : ''}
                                        </p>
                                    </div>

                                    <div className="shrink-0 sm:text-right">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">
                                            Price
                                        </p>
                                        <p className="font-display text-3xl sm:text-[2.5rem] text-white font-semibold leading-tight drop-shadow-lg">
                                            {property.price > 0
                                                ? formatPrice(property.price)
                                                : 'Price on Request'}
                                            {property.purpose === 'rent' &&
                                                property.price > 0 && (
                                                    <span className="text-base font-normal text-white/70">
                                                        {' '}
                                                        /mo
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    {/* ================= Quick facts bar ================= */}
                    {facts.length > 0 && (
                        <section className="bg-white rounded-2xl border border-charcoal/5 shadow-card px-5 sm:px-7 py-5 sm:py-6 mt-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-5 gap-x-4">
                                {facts.map(({ icon: Icon, label, value }, i) => (
                                    <div
                                        key={label}
                                        className={`flex items-center gap-3 ${
                                            i > 0 ? 'lg:pl-4 lg:border-l lg:border-charcoal/8' : ''
                                        }`}
                                    >
                                        <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-light/70 to-gold-light/25 flex items-center justify-center shrink-0">
                                            <Icon size={18} className="text-gold-dark" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[11px] uppercase tracking-wider text-stone">
                                                {label}
                                            </p>
                                            <p className="text-[15px] font-semibold text-charcoal-deep truncate">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ================= Two-column body with divided card ================= */}
                    <div className="grid lg:grid-cols-12 gap-6 mt-6 items-start">
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl border bg-gradient-to-b from-charcoal-deep/5 to-transparent shadow-2xl shadow-charcoal-deep/5 p-8 sm:p-10">
                                <PropertyOverview
                                    overview={{ ...ov, areaUnit }}
                                    description={property.description}
                                />

                                <div className="my-8 border-b border-charcoal-deep/10 border-opacity-60"></div>

                                <PropertyAmenities amenities={property.amenities} />

                                {property.floorPlan && (
                                    <>
                                        <div className="my-8 border-b border-charcoal-deep/10 border-opacity-60"></div>
                                        <section>
                                            <div className="flex items-center gap-2.5 mb-4">
                                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-light/70 to-gold-light/25 flex items-center justify-center shrink-0">
                                                    <FileText size={17} className="text-gold-dark" />
                                                </span>
                                                <div>
                                                    <h3 className="font-display text-xl text-charcoal-deep font-medium">Floor Plan</h3>
                                                    <p className="text-xs text-stone mt-0.5">Layout blueprint of this property</p>
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-charcoal/8 bg-cream/60 overflow-hidden">
                                                <img
                                                    src={property.floorPlan}
                                                    alt={`${property.title} floor plan`}
                                                    className="w-full h-auto max-h-[480px] object-contain bg-white p-4"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </section>
                                    </>
                                )}

                                <div className="my-8 border-b border-charcoal-deep/10 border-opacity-60"></div>

                                <PropertyLocation
                                    address={property.address || property.location}
                                    lat={property.coordinates.lat}
                                    lng={property.coordinates.lng}
                                    nearby={property.nearby}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <PropertyContact
                                contact={property.agent}
                                propertyTitle={property.title}
                                onSubmit={handleEnquiry}
                            />
                        </div>
                    </div>

                    {/* ================= Similar listings ================= */}
                    {similarProperties.length > 0 && (
                        <section className="mt-14 pt-10 border-t border-charcoal/10">
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
