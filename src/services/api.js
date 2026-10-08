import axios from "axios";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL,

    timeout: 30000,

    headers: {

        "Content-Type": "application/json",

        Accept: "application/json"

    }

});

// ==============================
// Request Interceptor
// ==============================

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

// ==============================
// Response Interceptor
// ==============================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response) {

            switch (error.response.status) {

                case 401:

                    // Only force-redirect when an existing session expired.
                    // Public pages must never bounce guests to /login from a stray 401.
                    if (localStorage.getItem("token")) {

                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        window.location.href = "/login";

                    }

                    break;

                case 403:

                    console.log("Forbidden");

                    break;

                case 404:

                    console.log("API Not Found");

                    break;

                case 500:

                    console.log("Internal Server Error");

                    break;

                default:

                    break;

            }

        }

        return Promise.reject(error);

    }

);

export default api;