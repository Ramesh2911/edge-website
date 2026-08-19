import api from "./api";

const authService = {

    login(data) {

        return api.post("/auth/login", data);

    },

    register(data) {

        return api.post("/auth/register", data);

    },

    profile() {

        return api.get("/auth/profile");

    },

    updateProfile(data) {

        return api.put(

            "/auth/update-profile",

            data,

            {

                headers: {

                    "Content-Type": "multipart/form-data"

                }

            }

        );

    },

    changePassword(data) {

        return api.put(

            "/auth/change-password",

            data

        );

    },

    forgotPassword(data) {

        return api.post(

            "/auth/forgot-password",

            data

        );

    },

    requestOtp(data) {

        return api.post("/auth/forgot-password", data);

    },

    verifyOtp(data) {

        return api.post("/auth/verify-otp", data);

    },

    resetPassword(data) {

        return api.post("/auth/reset-password", data);

    },

    logout() {

        return api.post("/auth/logout");

    },
}

export default authService;