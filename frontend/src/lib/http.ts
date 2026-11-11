import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Satpam pintu keluar: tempelkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Satpam pintu masuk: tangani 401 (token tidak valid/kedaluwarsa)
// login/register/me dikecualikan, sama seperti kunci Pertemuan 7
const SKIP_401 = ["/auth/login", "/auth/register", "/auth/me"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    if (status === 401 && !SKIP_401.some((path) => url.includes(path))) {
      localStorage.removeItem("token");
      window.location.href = "/login?expired=1";
    }
    return Promise.reject(error);
  },
);

export default api;
