import api from "./api";

const dealService = {
    getDeals() { return api.get("/deals"); },
    createDeal(data) { return api.post("/deals", data); },
    updateDealStage(id, stage) { return api.patch(`/deals/${id}/status`, { stage }); },
    removeDeal(id) { return api.delete(`/deals/${id}`); }
};

export default dealService;
