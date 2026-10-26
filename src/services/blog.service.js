import api from "./api";

const blogService = {
    getPosts() {
        return api.get("/blog");
    },
};

export default blogService;
