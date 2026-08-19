import api from "./api";

const profileService = {
    getProfile() {
        return api.get("/profile/me");
    },
};

export default profileService;
