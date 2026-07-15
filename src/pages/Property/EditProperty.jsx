import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Save, UploadCloud, Building, MapPin, Sparkles, Globe, Trash2, RotateCcw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';

const AMENITIES_PRESETS = ['Pool', 'Gym', 'Garage', '24/7 Security', 'Elevator', 'Private Garden', 'EV Charger', 'Furnished'];

export default function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State infrastructure to track existing image deletion modifications
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImgPreviews, setNewImgPreviews] = useState([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch target property parameters and dynamically seed form fields
    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const response = await fetch(`/api/v1/properties/${id}`);
                if (!response.ok) throw new Error('Listing structural records could not be resolved.');
                const data = await response.json();

                const listing = data.listing;

                // Populate form parameters natively
                reset({
                    purpose: listing.purpose || 'sale',
                    type: listing.type || 'house',
                    category: listing.category || 'residential',
                    title: listing.title || '',
                    description: listing.description || '',
                    price: listing.price || '',
                    area: listing.area || '',
                    bedrooms: listing.bedrooms || '0',
                    bathrooms: listing.bathrooms || '0',
                    balconies: listing.balconies || '0',
                    parking: listing.parking || '0',
                    furnishing: listing.furnishing || 'unfurnished',
                    propertyAge: listing.propertyAge || '',
                    facing: listing.facing || 'North',
                    amenities: listing.amenities || [],
                    address: listing.address || '',
                    state: listing.state || '',
                    city: listing.city || '',
                    pincode: listing.pincode || '',
                    latitude: listing.latitude || '',
                    longitude: listing.longitude || '',
                    videoUrl: listing.videoUrl || '',
                    virtualTourUrl: listing.virtualTourUrl || '',
                    metaTitle: listing.metaTitle || '',
                    metaDescription: listing.metaDescription || '',
                    status: listing.status || 'publish'
                });

                setExistingImages(listing.images || []);
            } catch (err) {
                toast.error(err.message || 'Error parsing target properties context loop.');
                navigate('/properties');
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchPropertyData();
    }, [id, reset, navigate]);

    const handleNewFiles = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map(file => URL.createObjectURL(file));
        setNewImgPreviews(prev => [...prev, ...urls]);
    };

    const markImageForDeletion = (imgUrl) => {
        setImagesToDelete(prev => [...prev, imgUrl]);
        setExistingImages(prev => prev.filter(img => img !== imgUrl));
    };

    const handleUpdatePipeline = async (data) => {
        setIsSubmitting(true);
        try {
            const consolidatedPayload = {
                ...data,
                retainedImages: existingImages,
                purgedImages: imagesToDelete,
                newImages: newImgPreviews
            };

            const response = await fetch(`/api/v1/properties/edit/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(consolidatedPayload),
            });

            if (!response.ok) throw new Error('API patch sequence rejected changes.');

            toast.success('Asset modification parameters executed successfully!');
            setTimeout(() => navigate(`/properties/${id}`), 1000);
        } catch (err) {
            toast.error(err.message || 'Patch pipeline deployment failure.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-sm font-semibold text-slate-500">Reassembling asset payload stream...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Modify Listing Structure | Asset Framework" description="Update legal metadata properties, media file streams, and geographic metrics." />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Main Controls Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Modify Asset Records</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Altering structural parameters for tracking index ID: <span className="font-mono text-indigo-600">{id}</span></p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                            >
                                <RotateCcw className="w-4 h-4" /> Cancel Actions
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleSubmit(handleUpdatePipeline)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Mutations
                            </button>
                        </div>
                    </div>

                    <form className="space-y-8">

                        {/* Context Module 1: Core Definitions & Status Mapping */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 flex-wrap gap-2">
                                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                    <Building className="w-5 h-5 text-indigo-600" /> <h2>Core Classification</h2>
                                </div>
                                <div>
                                    <select {...register('status')} className="text-xs font-bold uppercase tracking-wider p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 rounded-lg outline-none">
                                        <option value="publish">Status: Published (Live)</option>
                                        <option value="draft">Status: Draft (Hidden)</option>
                                        <option value="sold">Status: Managed (Archived / Sold)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deal Strategy</label>
                                    <select {...register('purpose')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="sale">For Sale / Disposal</option>
                                        <option value="rent">For Rent / Lease</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Structural Layout</label>
                                    <select {...register('type')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="house">House / Villa</option>
                                        <option value="apartment">Apartment / Condo</option>
                                        <option value="office">Commercial Office</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Asset Category</label>
                                    <select {...register('category')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="industrial">Industrial</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Property Name/Title *</label>
                                    <input type="text" {...register('title', { required: 'Public title required' })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500" />
                                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Evaluation Price ($) *</label>
                                    <input type="number" {...register('price', { required: 'Pricing value mandatory' })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Architectural Description *</label>
                                <textarea rows="4" {...register('description', { required: 'Overview metrics required' })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none" />
                                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                            </div>
                        </section>

                        {/* Context Module 2: Technical Specifications & Presets */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <Sparkles className="w-5 h-5 text-indigo-600" /> <h2>Technical Specifications</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Area (sq.ft) *</label>
                                    <input type="number" {...register('area', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bedrooms</label>
                                    <input type="number" {...register('bedrooms')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bathrooms</label>
                                    <input type="number" {...register('bathrooms')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parking Slots</label>
                                    <input type="number" {...register('parking')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Balconies</label>
                                    <input type="number" {...register('balconies')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Furnishing Matrix</label>
                                    <select {...register('furnishing')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="semi-furnished">Semi-Furnished</option>
                                        <option value="fully-furnished">Fully Furnished</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Structural Age (Yrs)</label>
                                    <input type="number" {...register('propertyAge')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facing Vector</label>
                                    <select {...register('facing')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="North">North</option>
                                        <option value="East">East</option>
                                        <option value="South">South</option>
                                        <option value="West">West</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Premium Infrastructure Features</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {AMENITIES_PRESETS.map((item) => (
                                        <label key={item} className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl cursor-pointer select-none text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            <input type="checkbox" value={item} {...register('amenities')} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                                            {item}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Context Module 3: Geographic Node Tracking */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <MapPin className="w-5 h-5 text-indigo-600" /> <h2>Geographic Parameters</h2>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Physical Address Line *</label>
                                    <input type="text" {...register('address', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City Node *</label>
                                    <input type="text" {...register('city', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State/Region *</label>
                                    <input type="text" {...register('state', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Postal/Zip Code *</label>
                                    <input type="text" {...register('pincode', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Latitude Coordinate</label>
                                    <input type="text" {...register('latitude')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Longitude Coordinate</label>
                                    <input type="text" {...register('longitude')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* Context Module 4: Media Architecture Management */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <UploadCloud className="w-5 h-5 text-indigo-600" /> <h2>Asset Galleries & Media Pipeline</h2>
                            </div>

                            {/* Existing Image Management Row */}
                            {existingImages.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Asset Images (Click to Delete)</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                        {existingImages.map((src, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border dark:border-slate-700">
                                                <img src={src} alt="Active property profile file" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => markImageForDeletion(src)}
                                                    className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-semibold gap-1 text-xs"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Purge
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Dropzone */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Append New Images</label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/40 dark:bg-slate-900/10 relative group hover:border-indigo-500 transition-colors">
                                    <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleNewFiles} />
                                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto group-hover:text-indigo-500 transition-colors" />
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Queue additional graphic attachments</p>
                                </div>
                            </div>

                            {newImgPreviews.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Queued for upload</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                        {newImgPreviews.map((src, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border dark:border-slate-700 ring-2 ring-emerald-500/20">
                                                <img src={src} alt="Staged Upload Matrix" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Streaming Video Walkthrough URL</label>
                                    <input type="url" {...register('videoUrl')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Matterport / 3D Virtual Tour Link</label>
                                    <input type="url" {...register('virtualTourUrl')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* Context Module 5: Marketplace SEO Structural Architecture */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <Globe className="w-5 h-5 text-indigo-600" /> <h2>Marketplace SEO Layer</h2>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Title Strategy Override</label>
                                <input type="text" {...register('metaTitle')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meta Content Snippet Description</label>
                                <textarea rows="2" {...register('metaDescription')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none" />
                            </div>
                        </section>

                    </form>
                </div>
            </main>
        </>
    );
}