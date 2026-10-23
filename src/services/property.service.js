import api from "./api";

const propertyService = {
    // Lookups
    getAmenities() { return api.get("/properties/amenities"); },
    getCategories() { return api.get("/properties/categories"); },

    // Core CRUD & Fetch Operators
    createProperty(formData) {
        return api.post("/properties/create", formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    updateProperty(id, formData) {
        return api.put(`/properties/update/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    deleteProperty(id) {
        return api.delete(`/properties/delete/${id}`);
    },
    getProperties(params) {
        return api.get("/properties/all", { params });
    },
    getPropertyById(id) {
        return api.get(`/properties/details/${id}`);
    },
    getMyProperties() {
        return api.get("/properties/my-properties");
    },

    // Search & Filter Operations
    searchProperty(keyword) {
        return api.get("/properties/search", { params: { keyword } });
    },
    filterProperty(filters) {
        return api.get("/properties/filter", { params: filters });
    },

    // Marketing Matrix Hooks
    getFeaturedProperties() {
        return api.get("/properties/featured");
    },
    getLatestProperties() {
        return api.get("/properties/latest");
    },

    // User Metrics / Analytics
    dashboardStats() {
        return api.get("/properties/dashboard/stats");
    },

    // Wishlist Engine
    addWishlist(propertyId) {
        return api.post("/properties/wishlist/add", { propertyId });
    },
    removeWishlist(propertyId) {
        return api.delete(`/properties/wishlist/remove/${propertyId}`);
    },
    getWishlist() {
        return api.get("/properties/wishlist");
    },

    // Lead Generation / Customer Inquiries
    interestedProperty(propertyId, messageData) {
        return api.post(`/properties/interested/${propertyId}`, messageData);
    },
    getInterestedProperty() {
        return api.get("/properties/leads/interested");
    },
    removeInquiry(id) {
        return api.delete(`/properties/inquiries/${id}`);
    },
    updateInquiryStatus(id, status) {
        return api.patch(`/properties/inquiries/${id}/status`, { status });
    },

    // Administrative Gateways
    approveProperty(id, comments) {
        return api.patch(`/properties/admin/approve/${id}`, { comments });
    },
    rejectProperty(id, comments) {
        return api.patch(`/properties/admin/reject/${id}`, { comments });
    },
    changeStatus(id, status) {
        return api.patch(`/properties/admin/status/${id}`, { status });
    },
    makeFeatured(id, isFeatured) {
        return api.patch(`/properties/admin/featured/${id}`, { featured: isFeatured ? 1 : 0 });
    },
    propertyList(params) {
        return api.get("/properties/list", { params });
    }
};

export default propertyService;