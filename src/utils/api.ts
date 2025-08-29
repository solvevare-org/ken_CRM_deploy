import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "../types";
import { BASE_URL, BASE_URL_PORT } from "../config";

// Token getter is injected from the app (e.g., after store is created)
let authTokenGetter: (() => string | undefined) | null = null;
export const setAuthTokenGetter = (getter: () => string | undefined): void => {
  authTokenGetter = getter;
};

// Configure axios defaults  
// Use current domain with port 3000 for API calls to ensure same-origin requests
export const getApiBaseUrl = (): string => {
  try {
    if (
      typeof window !== "undefined" &&
      window.location &&
      window.location.hostname
    ) {
      const host = window.location.hostname; // e.g. huzaifa-oranization-two.lvh.me or localhost
      // Backend port is always 3000
      return `http://${host}:3000`;
    }
  } catch (e) {
    // ignore and fall back
  }
  return BASE_URL;
};

const api = axios.create({
  baseURL: getApiBaseUrl(), // Use same domain with port 3000 for same-origin requests
  withCredentials: true, // For HTTP-only cookies
});

// Define public routes that don't need Authorization header
const PUBLIC_ROUTES = ["/api/auth/login", "/api/auth/signup"];

// Helper function to check if route is public
const isPublicRoute = (url: string = ""): boolean => {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip adding auth header for public routes
    if (isPublicRoute(config.url)) {
      return config;
    }

    // Get token from Redux state (for same-domain requests)
    // For cross-subdomain requests, rely on HTTP-only cookies set by backend
    const token = authTokenGetter ? authTokenGetter() : undefined;

    // Always try to add Authorization header if we have a token
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding Authorization header:", `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log("No token available for Authorization header");
    }

    // Always include credentials for cookie-based auth
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // You can dispatch a logout action here if needed
      // store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};
