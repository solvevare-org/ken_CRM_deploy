// RouteProtection.tsx
// This file contains route protection components

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, UserRole, useUserRole } from "@/utils/Authenticate";

interface PrivateRouteProps {
  allowedRoles?: UserRole[]; // List of roles allowed for this route
}

/**
 * PrivateRoute - Protects routes that require authentication
 * @param {Object} props - Component props
 * @param {UserRole[]} props.allowedRoles - Roles allowed to access the route
 * @returns {JSX.Element} - Renders the child component if authorized, otherwise redirects
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles = ["Client", "Organization", "Realtor"],
}) => {
  const isAuthenticated = useAuth();
  const { user_type } = useUserRole();
  const location = useLocation();

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user_type exists but is not in allowedRoles, redirect
  if (user_type && !allowedRoles.includes(user_type as UserRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has appropriate role, render the protected component
  return <Outlet />;
};

/**
 * PublicRoute - Used for routes that don't require authentication
 * @returns {JSX.Element} - Renders the child component
 */
export const PublicRoute: React.FC = () => {
  return <Outlet />;
};

/**
 * GuestOnlyRoute - For routes that should only be accessible by non-authenticated users
 * (like login or registration pages)
 * @returns {JSX.Element} - Renders the child component if user is not authenticated,
 *                         otherwise redirects to dashboard
 */
export const GuestOnlyRoute: React.FC = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    // If already logged in, redirect to appropriate dashboard
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
