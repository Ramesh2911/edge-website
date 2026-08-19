import api from "./api";

const leadService = {
    getBuyerRequirements() {
        return api.get("/leads/requirements");
    },
    createBuyerRequirement(data) {
        return api.post("/leads/requirements", data);
    },
    updateBuyerRequirement(id, data) {
        return api.put(`/leads/requirements/${id}`, data);
    },
    deleteBuyerRequirement(id) {
        return api.delete(`/leads/requirements/${id}`);
    },
};

export const createBuyerRequirement = (data) => api.post("/leads/requirements", data);
export const getBuyerRequirements = () => api.get("/leads/requirements");
export const updateBuyerRequirement = (id, data) => api.put(`/leads/requirements/${id}`, data);
export const deleteBuyerRequirement = (id) => api.delete(`/leads/requirements/${id}`);

export default leadService;
