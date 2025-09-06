import axios from "axios";
import { API_BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accesstoken = localStorage.getItem("token");
    if (accesstoken) {
      config.headers["Authorization"] = `Bearer ${accesstoken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized: redirect to login
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error");
      } else if (error.code === "ECONNABORTED" || error.message === "Network Error") {
        console.error("Network error or timeout");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
