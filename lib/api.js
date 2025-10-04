import axios from "axios";

const api = axios.create({
  baseURL: "https://themutantschool-backend.onrender.com/api",
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
