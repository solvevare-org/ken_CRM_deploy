import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "../types";
import { BASE_URL } from "../config";

// Token getter is injected from the app (e.g., after store is created)
let authTokenGetter: (() => string | undefined) | null = null;
export const setAuthTokenGetter = (getter: () => string | undefined): void => {
  authTokenGetter = getter;
};

// Configure axios defaults
const api = axios.create({
  baseURL: BASE_URL,
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

    // Get token from Redux state
    const token = authTokenGetter ? authTokenGetter() : undefined;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

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
