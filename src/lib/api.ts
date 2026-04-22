import axios from "axios";
import { auth } from "@/firebase/config";

const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const normalizeApiBaseUrl = (value: string) => {
  const trimmed = value.trim().replace(/\/+$/, "");
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return new URL(withProtocol).toString().replace(/\/+$/, "");
};

const apiBaseUrl = rawApiBaseUrl ? normalizeApiBaseUrl(rawApiBaseUrl) : "";
const isProductionBuild = process.env.NODE_ENV === "production";

if (!apiBaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_API_URL). Set it in your frontend environment variables."
  );
}

if (isProductionBuild && /localhost|127\.0\.0\.1/i.test(apiBaseUrl)) {
  throw new Error(
    "Invalid production API URL. NEXT_PUBLIC_API_BASE_URL cannot point to localhost in production."
  );
}

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;