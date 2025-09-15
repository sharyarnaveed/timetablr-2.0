import axios from "axios";
import router from "./router";

const api = axios.create({
  baseURL: "https://timetablr.burjalsama.site",
  withCredentials: true, // Enable sending credentials by default
});

// Interceptor for handling authentication
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear any stored auth state if needed
      router.push("/signin");
    }
    return Promise.reject(error);
  }
);

export default api;
