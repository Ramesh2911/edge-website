import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save, Plus, UploadCloud, Building, MapPin, Sparkles, Globe } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SEO from '../../components/Contact/SEO';
import propertyService from '../../services/property.service'; 

export default function AddProperty() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitAction, setSubmitAction] = useState('publish');
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [dynamicAmenities, setDynamicAmenities] = useState([]);
    const [isLoadingLookups, setIsLoadingLookups] = useState(true);
    const [rawImages, setRawImages] = useState([]);
    const [imgPreviews, setImgPreviews] = useState([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            category_id: '',
            property_title: '',
            property_for: 'Sale',
            property_type: 'Residential',
            price: '',
            area: '',
            area_unit: 'sq.ft',
            bedroom: '0',
            bathroom: '0',
            balconies: '0', // mapped back as optional layout parameters safely
            parking: '0',
            furnishing: 'Unfurnished',
            ownership: 'Freehold',
            construction_status: 'Ready to Move',
            possession_date: '',
            description: '',
            address: '',
            city: '',
            state: '',
            country: 'IND',
            pincode: '',
            latitude: '',
            longitude: '',
            amenities: [] 
        }
    });

    // Hydrate lookup collections dynamically on element mount 
    useEffect(() => {
        const fetchOperationalLookups = async () => {
            try {
                const [categoriesRes, amenitiesRes] = await Promise.all([
                    propertyService.getCategories(),
                    propertyService.getAmenities()
                ]);
                
                setDynamicCategories(categoriesRes.data.data || []);
                setDynamicAmenities(amenitiesRes.data.data || []);
            } catch (err) {
                toast.error('Failed to load dynamic categories or amenities layout configurations.');
                console.error(err);
            } finally {
                setIsLoadingLookups(false);
            }
        };

        fetchOperationalLookups();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setRawImages(prev => [...prev, ...files]);

        const urls = files.map(file => URL.createObjectURL(file));
        setImgPreviews(prev => [...prev, ...urls]);
    };

    const onSubmitPipeline = async (data) => {
        setIsSubmitting(true);
        try {
            // Re-map variables dynamically matching exact relational constraints from the DB schema definition
            const formattedPayload = {
                category_id: parseInt(data.category_id, 10),
                property_title: data.property_title,
                property_for: data.property_for,
                property_type: data.property_type,
                price: parseFloat(data.price),
                area: parseFloat(data.area),
                area_unit: data.area_unit,
                bedroom: parseInt(data.bedroom, 10),
                bathroom: parseInt(data.bathroom, 10),
                balcony: parseInt(data.balconies, 10),
                parking: parseInt(data.parking, 10),
                furnishing: data.furnishing,
                ownership: data.ownership,
                construction_status: data.construction_status,
                possession_date: data.possession_date || null,
                description: data.description,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                pincode: data.pincode,
                latitude: data.latitude || null,
                longitude: data.longitude || null,

                // Keep selected amenities safely aligned as an array of numerical IDs
                amenities: (data.amenities || []).map(id => parseInt(id, 10)),

                // Attach file pointers for multi-part mapping implementation matching propertyService setup
                property_images: rawImages,
                property_documents: [] // Can attach separate multi-input file handlers here if needed
            };

            // Executes unified api call implementation matching your structural configuration rules
            await propertyService.createProperty(formattedPayload);

            toast.success(submitAction === 'publish' ? 'Property listing submitted for validation approval!' : 'Listing structure preserved.');
            reset();
            setImgPreviews([]);
            setRawImages([]);
        } catch (err) {
            toast.error(err.message || 'Transmission exception encountered during data pipeline execution.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Add New Premium Listing | Control Panel"
                description="Provision global database layers with high-resolution real estate listings, tracking parameters, and blueprint metadata."
            />
            <Toaster position="top-right" />

            <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Dashboard Form Header Control Panel */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add New Asset</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deploy automated telemetry data, media paths, and spatial blueprints directly to the active marketplace grid.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                disabled={isSubmitting || isLoadingLookups}
                                onClick={() => { setSubmitAction('draft'); handleSubmit(onSubmitPipeline)(); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                            >
                                <Save className="w-4 h-4" /> Save Draft
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting || isLoadingLookups}
                                onClick={() => { setSubmitAction('publish'); handleSubmit(onSubmitPipeline)(); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md disabled:opacity-70"
                            >
                                {isSubmitting && submitAction === 'publish' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Publish Listing
                            </button>
                        </div>
                    </div>

                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                        {/* Section 1: Basic Operational Metadata */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <Building className="w-5 h-5 text-indigo-600" /> <h2>Core Operational Metadata</h2>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Deal Strategy</label>
                                    <select {...register('property_for')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="Sale">For Sale / Disposal</option>
                                        <option value="Rent">For Rent / Lease</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Structural Type</label>
                                    <select {...register('property_type')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dynamic Asset Category *</label>
                                    <select
                                        {...register('category_id', { required: 'Category specification assignment mandatory' })}
                                        className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                                    >
                                        <option value="">-- Choose Category --</option>
                                        {dynamicCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Property Name/Title *</label>
                                    <input type="text" {...register('property_title', { required: 'Public title is mandatory' })} placeholder="e.g. Paramount Luxury Waterfront Duplex" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500" />
                                    {errors.property_title && <p className="text-xs text-red-500 mt-1">{errors.property_title.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Evaluation Price ($) *</label>
                                    <input type="number" step="0.01" {...register('price', { required: 'Target pricing value required' })} placeholder="e.g. 1750000" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Architectural Pitch & Description *</label>
                                <textarea rows="4" {...register('description', { required: 'Narrative overview mandatory' })} placeholder="Incorporate high-profile spatial properties, design configurations, layout modifications..." className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none" />
                                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                            </div>
                        </section>

                        {/* Section 2: Detailed Technical Specifications */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <Sparkles className="w-5 h-5 text-indigo-600" /> <h2>Technical Specifications</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Area *</label>
                                    <input type="number" step="0.01" {...register('area', { required: true })} placeholder="e.g. 2800" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Area Dimension Unit</label>
                                    <input type="text" {...register('area_unit')} placeholder="sq.ft" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bedrooms</label>
                                    <input type="number" {...register('bedroom')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bathrooms</label>
                                    <input type="number" {...register('bathroom')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Balconies</label>
                                    <input type="number" {...register('balconies')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parking Slots</label>
                                    <input type="number" {...register('parking')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Furnishing Matrix</label>
                                    <input type="text" {...register('furnishing')} placeholder="e.g. Fully Furnished" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ownership Type</label>
                                    <input type="text" {...register('ownership')} placeholder="e.g. Freehold" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Construction Status</label>
                                    <input type="text" {...register('construction_status')} placeholder="e.g. Under Construction" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Possession Date</label>
                                    <input type="date" {...register('possession_date')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                            </div>

                            {/* Dynamic Database Infrastructure Features Checklist */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Premium Infrastructure Features (Dynamic Database Grid)</label>
                                {isLoadingLookups ? (
                                    <p className="text-xs text-slate-400 animate-pulse">Syncing environment amenities options matrix...</p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {dynamicAmenities.map((amenity) => (
                                            <label key={amenity.id} className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl cursor-pointer select-none text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-indigo-500 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    value={amenity.id}
                                                    {...register('amenities')}
                                                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                                />
                                                {amenity.amenity_name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section 3: Geographic Node Tracking */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <MapPin className="w-5 h-5 text-indigo-600" /> <h2>Geographic Tracking Parameters</h2>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Physical Address Line *</label>
                                    <input type="text" {...register('address', { required: true })} placeholder="e.g. Suite 404, Waterfront Boulevard" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
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
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Country Asset Origin</label>
                                    <input type="text" {...register('country')} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Postal/Zip Code *</label>
                                    <input type="text" {...register('pincode', { required: true })} className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Latitude</label>
                                        <input type="text" {...register('latitude')} placeholder="40.7644" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Longitude</label>
                                        <input type="text" {...register('longitude')} placeholder="-73.9732" className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Media Assets Upload Pipelines */}
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
                                <UploadCloud className="w-5 h-5 text-indigo-600" /> <h2>Media Pipelines & Attachments</h2>
                            </div>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/40 dark:bg-slate-900/10 relative group hover:border-indigo-500 transition-colors">
                                <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto group-hover:text-indigo-500 transition-colors" />
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Queue photography portfolios, structural charts, and blueprints here</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Supports high-res PNG/JPEG layers directly handled by local multer engines</p>
                            </div>
                            {imgPreviews.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
                                    {imgPreviews.map((src, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border bg-slate-100 dark:border-slate-700">
                                            <img src={src} alt="Telemetry Engine Asset Mapping Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </form>
                </div>
            </main>
        </>
    );
}