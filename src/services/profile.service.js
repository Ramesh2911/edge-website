import api from "./api";

const profileService = {
    getProfile() {
        return api.get("/auth/profile");
    },
    updateProfile(formData) {
        return api.put("/auth/update-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    changePassword(data) {
        return api.put("/auth/change-password", data);
    },
    getActivities() {
        return api.get("/activities");
    },
};

export default profileService;
