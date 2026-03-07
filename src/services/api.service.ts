import ApiClient from "@utils/api-client";

const api = new ApiClient({
  baseUrl: import.meta.env.VITE_APP_BASE_API_URL || "",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...(config.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  async (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return response;
  },
  (error) => {
    console.error("[Client] Response error:", error);
    throw error;
  },
);

export default api;
