import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Loader2,
    Save,
    Plus,
    UploadCloud,
    Building2,
    MapPin,
    Sparkles,
    Camera,
    X,
    CheckCircle2,
    Home,
    Ruler,
    BedDouble,
    Bath,
    Car,
    Sofa,
    FileText,
    ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import propertyService from "../../services/property.service";

const FURNISHING_OPTIONS = ["Unfurnished", "Semi Furnished", "Fully Furnished"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society"];
const CONSTRUCTION_OPTIONS = ["Ready to Move", "Under Construction", "New Launch"];

const SectionHeader = ({ icon: Icon, title, subtitle, step }) => (
    <div className="flex items-start gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white shadow-md shrink-0">
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#7CB93D] bg-[#EAF6DE] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Step {step}
                </span>
            </div>
            <h2 className="text-base font-bold text-slate-800 mt-1">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
    </div>
);

const Field = ({ label, required, error, children, className = "" }) => (
    <div className={className}>
        <label className="block text-[13px] font-semibold text-[#153964] mb-1.5">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error.message}</p>}
    </div>
);

const inputCls = (hasError) =>
    `w-full border-2 rounded-xl px-4 py-2.5 text-sm bg-[#F7FAFC] focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${
        hasError
            ? "border-red-400 focus:ring-4 focus:ring-red-100"
            : "border-slate-200 focus:border-[#7CB93D] focus:ring-4 focus:ring-[#7CB93D]/15"
    }`;

const selectCls = inputCls(false);

export default function AddProperty() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [dynamicAmenities, setDynamicAmenities] = useState([]);
    const [isLoadingLookups, setIsLoadingLookups] = useState(true);
    const [rawImages, setRawImages] = useState([]);
    const [imgPreviews, setImgPreviews] = useState([]);
    const [floorPlanFile, setFloorPlanFile] = useState(null);
    const [floorPlanPreview, setFloorPlanPreview] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            category_id: "",
            property_title: "",
            property_for: "Sale",
            property_type: "Residential",
            price: "",
            area: "",
            area_unit: "sq.ft",
            bedroom: "0",
            bathroom: "0",
            balconies: "0",
            parking: "0",
            furnishing: "Unfurnished",
            ownership: "Freehold",
            construction_status: "Ready to Move",
            possession_date: "",
            description: "",
            address: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",
            latitude: "",
            longitude: "",
            amenities: [],
        },
    });

    const propertyType = watch("property_type");

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [categoriesRes, amenitiesRes] = await Promise.all([
                    propertyService.getCategories(),
                    propertyService.getAmenities(),
                ]);
                setDynamicCategories(categoriesRes.data.data || []);
                setDynamicAmenities(amenitiesRes.data.data || []);
            } catch (err) {
                toast.error("Failed to load categories or amenities.");
                console.error(err);
            } finally {
                setIsLoadingLookups(false);
            }
        };
        fetchLookups();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setRawImages((prev) => [...prev, ...files]);
        const urls = files.map((file) => URL.createObjectURL(file));
        setImgPreviews((prev) => [...prev, ...urls]);
    };

    const removeImage = (index) => {
        setRawImages((prev) => prev.filter((_, i) => i !== index));
        setImgPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFloorPlanChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        setFloorPlanFile(file);
        setFloorPlanPreview(URL.createObjectURL(file));
    };

    const removeFloorPlan = () => {
        if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        setFloorPlanFile(null);
        setFloorPlanPreview("");
    };

    const onSubmitPipeline = async (data) => {
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("category_id", String(parseInt(data.category_id, 10)));
            fd.append("property_title", data.property_title);
            fd.append("property_for", data.property_for);
            fd.append("property_type", data.property_type);
            fd.append("price", String(parseFloat(data.price)));
            fd.append("area", String(parseFloat(data.area)));
            fd.append("area_unit", data.area_unit);
            fd.append("bedroom", String(parseInt(data.bedroom, 10) || 0));
            fd.append("bathroom", String(parseInt(data.bathroom, 10) || 0));
            fd.append("balcony", String(parseInt(data.balconies, 10) || 0));
            fd.append("parking", String(parseInt(data.parking, 10) || 0));
            fd.append("furnishing", data.furnishing);
            fd.append("ownership", data.ownership);
            fd.append("construction_status", data.construction_status);
            if (data.possession_date) fd.append("possession_date", data.possession_date);
            fd.append("description", data.description);
            fd.append("address", data.address);
            fd.append("city", data.city);
            fd.append("state", data.state);
            fd.append("country", data.country);
            fd.append("pincode", data.pincode);
            if (data.latitude) fd.append("latitude", data.latitude);
            if (data.longitude) fd.append("longitude", data.longitude);
            fd.append("amenities", JSON.stringify((data.amenities || []).map((id) => parseInt(id, 10))));
            rawImages.forEach((file) => fd.append("property_images", file));
            if (floorPlanFile) fd.append("floor_plan", floorPlanFile);

            await propertyService.createProperty(fd);
            toast.success("Property listing created successfully!");
            reset();
            setImgPreviews([]);
            setRawImages([]);
            removeFloorPlan();
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to create property.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Add New Property | Edge Mile Realty"
                description="Create a new property listing with full details, amenities, and media."
            />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#F7FAFC] pb-16">
                {/* Hero Header */}
                <div className="bg-gradient-to-r from-[#0F2D52] via-[#153964] to-[#1E4C8C] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 800 200" fill="none" className="w-full h-full">
                            <circle cx="680" cy="100" r="160" stroke="#8BC53F" strokeWidth="1" />
                            <circle cx="680" cy="100" r="110" stroke="#8BC53F" strokeWidth="1" />
                            <path d="M0 150 L200 90 L400 130 L600 70 L800 110" stroke="#8BC53F" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm mb-4">
                            <Plus size={14} className="text-[#8BC53F]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">
                                New Listing
                            </span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">
                            Add a New Property
                        </h1>
                        <p className="text-white/55 text-sm mt-3 max-w-lg">
                            Fill in the details below to publish your listing. All fields marked with * are required.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        {/* ========== 1. Basic Info ========== */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader
                                icon={Home}
                                step={1}
                                title="Basic Information"
                                subtitle="Core details about your property listing"
                            />

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <Field label="Property Title" required error={errors.property_title} className="sm:col-span-2 lg:col-span-3">
                                    <input
                                        type="text"
                                        {...register("property_title", { required: "Title is required" })}
                                        placeholder="e.g. Skyline Luxury 3BHK Apartment"
                                        className={inputCls(errors.property_title)}
                                    />
                                </Field>

                                <Field label="Category" required error={errors.category_id}>
                                    <select
                                        {...register("category_id", { required: "Category is required" })}
                                        className={`${selectCls} ${errors.category_id ? "border-red-400" : ""}`}
                                    >
                                        <option value="">-- Select Category --</option>
                                        {dynamicCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="List For">
                                    <select {...register("property_for")} className={selectCls}>
                                        <option value="Sale">For Sale</option>
                                        <option value="Rent">For Rent</option>
                                    </select>
                                </Field>

                                <Field label="Property Type">
                                    <select {...register("property_type")} className={selectCls}>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </Field>

                                <Field label="Price (₹)" required error={errors.price}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("price", { required: "Price is required" })}
                                        placeholder="e.g. 8500000"
                                        className={inputCls(errors.price)}
                                    />
                                </Field>

                                <Field label="Description" required error={errors.description} className="sm:col-span-2">
                                    <textarea
                                        rows="3"
                                        {...register("description", { required: "Description is required" })}
                                        placeholder="Describe the property features, layout, nearby landmarks..."
                                        className={`${inputCls(errors.description)} resize-none`}
                                    />
                                </Field>
                            </div>
                        </section>

                        {/* ========== 2. Specifications ========== */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader
                                icon={Ruler}
                                step={2}
                                title="Specifications"
                                subtitle="Area, rooms, and property features"
                            />

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Field label="Area" required error={errors.area}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("area", { required: "Area is required" })}
                                        placeholder="e.g. 1250"
                                        className={inputCls(errors.area)}
                                    />
                                </Field>
                                <Field label="Unit">
                                    <select {...register("area_unit")} className={selectCls}>
                                        <option value="sq.ft">sq.ft</option>
                                        <option value="sq.m">sq.m</option>
                                        <option value="sq.yd">sq.yd</option>
                                        <option value="acre">acre</option>
                                        <option value="hectare">hectare</option>
                                    </select>
                                </Field>
                                <Field label="Bedrooms">
                                    <div className="relative">
                                        <BedDouble size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            {...register("bedroom")}
                                            className={`${inputCls(false)} pl-10`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Bathrooms">
                                    <div className="relative">
                                        <Bath size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            {...register("bathroom")}
                                            className={`${inputCls(false)} pl-10`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Balconies">
                                    <input
                                        type="number"
                                        min="0"
                                        {...register("balconies")}
                                        className={inputCls(false)}
                                    />
                                </Field>
                                <Field label="Parking">
                                    <div className="relative">
                                        <Car size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            {...register("parking")}
                                            className={`${inputCls(false)} pl-10`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Furnishing">
                                    <div className="relative">
                                        <Sofa size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select {...register("furnishing")} className={`${selectCls} pl-10`}>
                                            {FURNISHING_OPTIONS.map((f) => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                </Field>
                                <Field label="Ownership">
                                    <select {...register("ownership")} className={selectCls}>
                                        {OWNERSHIP_OPTIONS.map((o) => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Construction Status">
                                    <select {...register("construction_status")} className={selectCls}>
                                        {CONSTRUCTION_OPTIONS.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Possession Date">
                                    <input type="date" {...register("possession_date")} className={inputCls(false)} />
                                </Field>
                            </div>
                        </section>

                        {/* ========== 3. Amenities ========== */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader
                                icon={Sparkles}
                                step={3}
                                title="Amenities"
                                subtitle="Select the features this property offers"
                            />

                            {isLoadingLookups ? (
                                <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
                                    <Loader2 size={16} className="animate-spin" />
                                    Loading amenities...
                                </div>
                            ) : dynamicAmenities.length === 0 ? (
                                <p className="text-sm text-slate-400 py-4">No amenities available.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                                    {dynamicAmenities.map((amenity) => (
                                        <label
                                            key={amenity.id}
                                            className="flex items-center gap-2.5 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer text-[13px] font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all has-[:checked]:border-[#7CB93D] has-[:checked]:bg-[#7CB93D]/10 has-[:checked]:text-[#153964]"
                                        >
                                            <input
                                                type="checkbox"
                                                value={amenity.id}
                                                {...register("amenities")}
                                                className="w-4 h-4 rounded accent-[#7CB93D]"
                                            />
                                            <span className="truncate">{amenity.amenity_name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ========== 4. Location ========== */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader
                                icon={MapPin}
                                step={4}
                                title="Location"
                                subtitle="Where is this property located?"
                            />

                            <div className="grid sm:grid-cols-2 gap-5">
                                <Field label="Address" required error={errors.address} className="sm:col-span-2">
                                    <div className="relative">
                                        <MapPin size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        <textarea
                                            rows="2"
                                            {...register("address", { required: "Address is required" })}
                                            placeholder="Street address, locality, landmark"
                                            className={`${inputCls(errors.address)} pl-10 resize-none`}
                                        />
                                    </div>
                                </Field>
                                <Field label="City" required error={errors.city}>
                                    <input
                                        type="text"
                                        {...register("city", { required: "City is required" })}
                                        placeholder="e.g. Mumbai"
                                        className={inputCls(errors.city)}
                                    />
                                </Field>
                                <Field label="State" required error={errors.state}>
                                    <input
                                        type="text"
                                        {...register("state", { required: "State is required" })}
                                        placeholder="e.g. Maharashtra"
                                        className={inputCls(errors.state)}
                                    />
                                </Field>
                                <Field label="Country" required error={errors.country}>
                                    <input
                                        type="text"
                                        {...register("country", { required: "Country is required" })}
                                        className={inputCls(errors.country)}
                                    />
                                </Field>
                                <Field label="Pincode" required error={errors.pincode}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        {...register("pincode", {
                                            required: "Pincode is required",
                                            pattern: { value: /^\d{4,10}$/, message: "Enter a valid pincode" },
                                        })}
                                        placeholder="e.g. 400001"
                                        className={inputCls(errors.pincode)}
                                    />
                                </Field>
                                <Field label="Latitude (optional)">
                                    <input
                                        type="text"
                                        {...register("latitude")}
                                        placeholder="e.g. 19.0760"
                                        className={inputCls(false)}
                                    />
                                </Field>
                                <Field label="Longitude (optional)">
                                    <input
                                        type="text"
                                        {...register("longitude")}
                                        placeholder="e.g. 72.8777"
                                        className={inputCls(false)}
                                    />
                                </Field>
                            </div>
                        </section>

                        {/* ========== 5. Images ========== */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader
                                icon={Camera}
                                step={5}
                                title="Photos"
                                subtitle="Upload high-quality images of your property"
                            />

                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 relative group hover:border-[#7CB93D] hover:bg-[#7CB93D]/5 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white mx-auto shadow-md group-hover:scale-105 transition-transform">
                                    <UploadCloud size={24} />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mt-4">
                                    Drop images here or click to browse
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Supports PNG, JPG up to 10MB each
                                </p>
                            </div>

                            {imgPreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-5">
                                    {imgPreviews.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group"
                                        >
                                            <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <X size={12} />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-[#7CB93D] text-white px-1.5 py-0.5 rounded">
                                                    COVER
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Floor Plan */}
                            <div className="mt-7 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={15} className="text-[#153964]" />
                                    <p className="text-[13px] font-bold text-[#153964]">Floor Plan</p>
                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional · 1 image</span>
                                </div>

                                {!floorPlanPreview ? (
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 relative group hover:border-[#7CB93D] hover:bg-[#7CB93D]/5 transition-all cursor-pointer max-w-md">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFloorPlanChange}
                                        />
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white mx-auto shadow-md group-hover:scale-105 transition-transform">
                                            <FileText size={18} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 mt-3">Upload floor plan</p>
                                        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 10MB</p>
                                    </div>
                                ) : (
                                    <div className="relative inline-block rounded-xl overflow-hidden border-2 border-[#7CB93D]/40 bg-[#7CB93D]/5 max-w-md">
                                        <img src={floorPlanPreview} alt="Floor plan preview" className="w-full h-48 object-contain bg-white p-2" />
                                        <button
                                            type="button"
                                            onClick={removeFloorPlan}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-[#153964] text-white px-2 py-0.5 rounded-full">FLOOR PLAN</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ========== Submit ========== */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 justify-center sm:justify-start">
                                    <CheckCircle2 size={15} className="text-[#7CB93D]" />
                                    Ready to publish?
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Your listing will be reviewed before going live.
                                </p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    disabled={isSubmitting || isLoadingLookups}
                                    onClick={handleSubmit(onSubmitPipeline)}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    Save Draft
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting || isLoadingLookups}
                                    onClick={handleSubmit(onSubmitPipeline)}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:from-[#0F2D52] hover:to-[#153964] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_-6px_rgba(21,57,100,0.4)] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                    Publish Listing
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
