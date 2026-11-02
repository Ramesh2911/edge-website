import api from "./api";

const blogService = {
    getPosts() {
        return api.get("/blog");
    },
    getPost(slug) {
        return api.get(`/blog/${slug}`);
    },
};

export default blogService;
