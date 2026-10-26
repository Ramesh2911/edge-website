import api from "./api";

const footerService = {
    getFooter() {
        return api.get("/footer");
    },
    getPageContent(slug) {
        return api.get(`/footer/links/page/${encodeURIComponent(slug)}`);
    },
};

export default footerService;
