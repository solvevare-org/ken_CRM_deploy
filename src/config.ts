// Centralized config for environment variables
export const BASE_URL = "http://localhost:3000";
// Keep only the base domain here (no port, no trailing slash).
// When running on localhost we still want to use lvh.me as the base
// so subdomains resolve to 127.0.0.1. Port will be appended at runtime.
export const CRM_BASE_DOMAIN = "lvh.me";
