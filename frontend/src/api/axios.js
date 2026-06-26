import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
