import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    RotateCcw,
    Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SEO from "../../components/Contact/SEO";
import propertyService from "../../services/property.service";
import { resolveImageUrl } from "../../utils/imageUrl";

const FURNISHING_OPTIONS = ["Unfurnished", "Semi Furnished", "Fully Furnished"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society"];
const CONSTRUCTION_OPTIONS = ["Ready to Move", "Under Construction", "New Launch"];

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-4 pb-5 border-b border-slate-100 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white shadow-md shrink-0">
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
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

export default function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [isLoadingLookups, setIsLoadingLookups] = useState(true);

    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newRawFiles, setNewRawFiles] = useState([]);
    const [newImgPreviews, setNewImgPreviews] = useState([]);

    const [existingFloorPlan, setExistingFloorPlan] = useState("");
    const [removeFloorPlan, setRemoveFloorPlan] = useState(false);
    const [floorPlanFile, setFloorPlanFile] = useState(null);
    const [floorPlanPreview, setFloorPlanPreview] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const res = await propertyService.getCategories();
                setDynamicCategories(res.data.data || []);
            } catch {
                toast.error("Failed to load categories.");
            } finally {
                setIsLoadingLookups(false);
            }
        };
        fetchLookups();
    }, []);

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const { data } = await propertyService.getPropertyById(id);
                const listing = data?.data;
                if (!listing) throw new Error("Listing not found.");

                reset({
                    category_id: listing.category_id ? String(listing.category_id) : "",
                    property_title: listing.property_title || "",
                    property_for: listing.property_for || "Sale",
                    property_type: listing.property_type || "Residential",
                    price: listing.price != null ? String(parseFloat(listing.price)) : "",
                    area: listing.area != null ? String(parseFloat(listing.area)) : "",
                    area_unit: listing.area_unit || "sq.ft",
                    bedroom: String(listing.bedroom ?? 0),
                    bathroom: String(listing.bathroom ?? 0),
                    balconies: String(listing.balcony ?? 0),
                    parking: String(listing.parking ?? 0),
                    furnishing: listing.furnishing || "Unfurnished",
                    ownership: listing.ownership || "Freehold",
                    construction_status: listing.construction_status || "Ready to Move",
                    possession_date: listing.possession_date ? String(listing.possession_date).slice(0, 10) : "",
                    description: listing.description || "",
                    address: listing.address || "",
                    city: listing.city || "",
                    state: listing.state || "",
                    country: listing.country || "India",
                    pincode: listing.pincode || "",
                    latitude: listing.latitude || "",
                    longitude: listing.longitude || "",
                });

                setExistingImages(listing.images || []);
                if (listing.floor_plan_url || listing.floor_plan) {
                    setExistingFloorPlan(
                        listing.floor_plan_url ||
                            (listing.floor_plan ? `/uploads/property/floor-plans/${listing.floor_plan}` : "")
                    );
                } else {
                    setExistingFloorPlan("");
                }
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message || "Failed to load property.");
                navigate("/properties");
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchPropertyData();
    }, [id, reset, navigate]);

    const handleNewFiles = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setNewRawFiles((prev) => [...prev, ...files]);
        setNewImgPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setNewRawFiles((prev) => prev.filter((_, i) => i !== index));
        setNewImgPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const markImageForDeletion = (imgUrl) => {
        setImagesToDelete((prev) => [...prev, imgUrl]);
        setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
    };

    const handleFloorPlanChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        setFloorPlanFile(file);
        setFloorPlanPreview(URL.createObjectURL(file));
        setRemoveFloorPlan(false);
        e.target.value = "";
    };

    const clearNewFloorPlan = () => {
        if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        setFloorPlanFile(null);
        setFloorPlanPreview("");
    };

    const clearExistingFloorPlan = () => {
        setExistingFloorPlan("");
        setRemoveFloorPlan(true);
    };

    const handleUpdatePipeline = async (data) => {
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("category_id", String(parseInt(data.category_id, 10) || ""));
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

            if (floorPlanFile) {
                fd.append("floor_plan", floorPlanFile);
            } else if (removeFloorPlan) {
                fd.append("remove_floor_plan", "1");
            } else if (existingFloorPlan) {
                const base = existingFloorPlan.split("/").pop();
                fd.append("floor_plan", base);
            }

            if (imagesToDelete.length > 0) {
                const names = imagesToDelete.map((u) => String(u).split("/").pop());
                fd.append("deleted_images", JSON.stringify(names));
            }

            newRawFiles.forEach((file) => fd.append("property_images", file));

            await propertyService.updateProperty(id, fd);
            toast.success("Property updated successfully!");
            setTimeout(() => navigate(`/properties/details/${id}`), 800);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Update failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#153964]" />
                    <p className="text-sm font-semibold text-slate-500">Loading property…</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Edit Property | Edge Mile Realty" description="Update your property listing details and media." />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#F7FAFC] pb-16">
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
                            <Camera size={14} className="text-[#8BC53F]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8BC53F]">Edit Listing</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl text-white font-medium leading-tight">Edit Property</h1>
                        <p className="text-white/55 text-sm mt-3 max-w-lg">Update details, photos, and floor plan for listing #{id}.</p>
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-white/20 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all"
                            >
                                <RotateCcw size={15} /> Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting || isLoadingLookups}
                                onClick={handleSubmit(handleUpdatePipeline)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7CB93D] hover:bg-[#8BC53F] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_-6px_rgba(124,185,61,0.5)] transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        {/* 1. Basic Info */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader icon={Home} title="Basic Information" subtitle="Core details about your property listing" />
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

                        {/* 2. Specifications */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader icon={Ruler} title="Specifications" subtitle="Area, rooms, and property features" />
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
                                        <input type="number" min="0" {...register("bedroom")} className={`${inputCls(false)} pl-10`} />
                                    </div>
                                </Field>
                                <Field label="Bathrooms">
                                    <div className="relative">
                                        <Bath size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="number" min="0" {...register("bathroom")} className={`${inputCls(false)} pl-10`} />
                                    </div>
                                </Field>
                                <Field label="Balconies">
                                    <input type="number" min="0" {...register("balconies")} className={inputCls(false)} />
                                </Field>
                                <Field label="Parking">
                                    <div className="relative">
                                        <Car size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="number" min="0" {...register("parking")} className={`${inputCls(false)} pl-10`} />
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

                        {/* 3. Location */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader icon={MapPin} title="Location" subtitle="Where is this property located?" />
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
                                    <input type="text" {...register("latitude")} placeholder="e.g. 19.0760" className={inputCls(false)} />
                                </Field>
                                <Field label="Longitude (optional)">
                                    <input type="text" {...register("longitude")} placeholder="e.g. 72.8777" className={inputCls(false)} />
                                </Field>
                            </div>
                        </section>

                        {/* 4. Photos + Floor Plan */}
                        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7">
                            <SectionHeader icon={Camera} title="Photos & Floor Plan" subtitle="Manage gallery images and floor plan" />

                            {existingImages.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-[13px] font-bold text-[#153964] mb-3">Current Photos <span className="text-slate-400 font-medium">(hover to remove)</span></p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {existingImages.map((src, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                                                <img src={resolveImageUrl(src)} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => markImageForDeletion(src)}
                                                    className="absolute inset-0 bg-red-500/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                >
                                                    <Trash2 size={16} className="text-white" />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-[#7CB93D] text-white px-1.5 py-0.5 rounded">COVER</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 relative group hover:border-[#7CB93D] hover:bg-[#7CB93D]/5 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleNewFiles}
                                />
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white mx-auto shadow-md group-hover:scale-105 transition-transform">
                                    <UploadCloud size={20} />
                                </div>
                                <p className="text-sm font-bold text-slate-700 mt-3">Drop images here or click to browse</p>
                                <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG up to 10MB each</p>
                            </div>

                            {newImgPreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-5">
                                    {newImgPreviews.map((src, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#7CB93D]/40 group">
                                            <img src={src} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <X size={12} />
                                            </button>
                                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-[#7CB93D] text-white px-1.5 py-0.5 rounded">NEW</span>
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

                                {!floorPlanPreview && !existingFloorPlan && (
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 relative group hover:border-[#7CB93D] hover:bg-[#7CB93D]/5 transition-all cursor-pointer max-w-md">
                                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFloorPlanChange} />
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#153964] to-[#1E4C8C] flex items-center justify-center text-white mx-auto shadow-md group-hover:scale-105 transition-transform">
                                            <FileText size={18} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 mt-3">Upload floor plan</p>
                                        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 10MB</p>
                                    </div>
                                )}

                                {floorPlanPreview && (
                                    <div className="relative inline-block rounded-xl overflow-hidden border-2 border-[#7CB93D]/40 bg-[#7CB93D]/5 max-w-md">
                                        <img src={floorPlanPreview} alt="New floor plan" className="w-full h-48 object-contain bg-white p-2" />
                                        <button
                                            type="button"
                                            onClick={clearNewFloorPlan}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-[#153964] text-white px-2 py-0.5 rounded-full">NEW FLOOR PLAN</span>
                                    </div>
                                )}

                                {!floorPlanPreview && existingFloorPlan && (
                                    <div className="relative inline-block rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 max-w-md">
                                        <img src={resolveImageUrl(existingFloorPlan)} alt="Current floor plan" className="w-full h-48 object-contain bg-white p-2" />
                                        <button
                                            type="button"
                                            onClick={clearExistingFloorPlan}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-slate-600 text-white px-2 py-0.5 rounded-full">CURRENT FLOOR PLAN</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Submit bar */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(21,57,100,0.06)] p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 justify-center sm:justify-start">
                                    <CheckCircle2 size={15} className="text-[#7CB93D]" />
                                    Ready to save changes?
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">Updated listing will be re-reviewed before going live.</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    disabled={isSubmitting || isLoadingLookups}
                                    onClick={handleSubmit(handleUpdatePipeline)}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#153964] to-[#1E4C8C] hover:from-[#0F2D52] hover:to-[#153964] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_-6px_rgba(21,57,100,0.4)] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
