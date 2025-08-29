// Production Configuration for localhost:5173 deployment
export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://api.localhost:5173',
  CRM_BASE_DOMAIN: 'localhost:5173',
  IS_PRODUCTION: true,
  WORKSPACE_SUBDOMAIN_PATTERN: /^[a-zA-Z0-9-]+\.crm\.vire-s\.com$/,
  ALLOWED_HOSTS: [
    'localhost:5173',
    'workspace1.localhost:5173',
    'workspace2.localhost:5173',
    'workspace3.localhost:5173'
  ]
};
