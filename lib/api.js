import axios from "axios";

export const BASE_URL = "https://themutantschool-backend.onrender.com/api";

// Frontend base URL for referral links
export const getFrontendBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("login-accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Set Content-Type based on data type
    if (config.data instanceof FormData) {
      // Let the browser set the Content-Type for FormData
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      // Default to JSON for non-FormData requests
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
