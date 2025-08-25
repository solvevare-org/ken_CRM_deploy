// authentication.ts
// This file contains utility functions for authentication and role checking

import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserType,
} from "@/store/slices/authSlice";

// Define allowed user roles
export type UserRole = "Client" | "Organization" | "Realtor";

/**
 * Custom hook to check if a user is authenticated using Redux state
 * @returns {boolean} - True if user is authenticated, false otherwise
 */
export const useAuth = (): boolean => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated;
};

/**
 * Custom hook to get the user's role from Redux state
 * @returns {Object} - Object containing user_type and user properties
 */
export const useUserRole = (): {
  user_type: UserRole | null;
  user: Record<string, any> | null;
} => {
  const user_type = useAppSelector(selectUserType);
  const user = useAppSelector(selectUser);
  return {
    user_type: user_type as UserRole | null,
    user,
  };
};
