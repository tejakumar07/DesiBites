import axios from "axios";

// In production, use the Cloud Run backend URL.
// In development, Vite proxies /api/* to localhost:8080 so we use relative paths.
const API_BASE_URL: string = import.meta.env.PROD
  ? "https://desibites-1.onrender.com/"
  : "";

export const api = axios.create({
  baseURL: API_BASE_URL,
});
