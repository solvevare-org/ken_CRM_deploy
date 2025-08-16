import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/workspaceTypes";

// Configure axios defaults
const api = axios.create({
  //   baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  baseURL: "http://localhost:3000",
  withCredentials: true, // For HTTP-only cookies
});

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
