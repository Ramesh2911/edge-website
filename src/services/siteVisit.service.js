import api from "./api";

const siteVisitService = {
    getVisits() { return api.get("/site-visits"); },
    scheduleVisit(data) { return api.post("/site-visits", data); },
    updateVisitStatus(id, status) { return api.patch(`/site-visits/${id}/status`, { status }); },
    removeVisit(id) { return api.delete(`/site-visits/${id}`); }
};

export default siteVisitService;
