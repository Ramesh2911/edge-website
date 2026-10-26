import api from "./api";

const contentService = {
    getContent() {
        return api.get("/content");
    },
};

export default contentService;
