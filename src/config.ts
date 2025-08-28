// Centralized config for environment variables
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://72.60.97.98:3000";
export const CRM_BASE_DOMAIN = import.meta.env.VITE_CRM_BASE_DOMAIN || "crm.vire-s.com";
export const BASE_URL_PORT = import.meta.env.VITE_API_BASE_URL_PORT || "3000";

// Production domain configuration
export const PRODUCTION_DOMAIN = "crm.vire-s.com";
export const IS_PRODUCTION = import.meta.env.PROD || false;

// Subdomain pattern for workspaces
export const WORKSPACE_SUBDOMAIN_PATTERN = /^[a-zA-Z0-9-]+\.crm\.vire-s\.com$/;
