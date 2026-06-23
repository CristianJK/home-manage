import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // localStorage not available (Safari incognito, etc.)
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem("access_token");
      } catch {
        // localStorage not available
      }
    }
    return Promise.reject(error);
  }
);

export default api;
