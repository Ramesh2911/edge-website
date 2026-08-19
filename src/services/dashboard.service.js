import api from "./api";

const dashboardService = {
    getAnalytics(role) {
        return api.get("/dashboard/analytics", { params: { role } });
    },
};

export default dashboardService;
