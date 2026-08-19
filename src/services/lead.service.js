import api from "./api";

const leadService = {
    getBuyerRequirements() {
        return api.get("/buyer/requirements");
    },
    createBuyerRequirement(data) {
        return api.post("/buyer/requirements/create", data);
    },
    updateBuyerRequirement(id, data) {
        return api.put(`/buyer/requirements/edit/${id}`, data);
    },
    deleteBuyerRequirement(id) {
        return api.delete(`/buyer/requirements/delete/${id}`);
    },
};

export default leadService;
