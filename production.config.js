// Production Configuration for localhost:3000 deployment
export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://api.localhost:3000',
  CRM_BASE_DOMAIN: 'localhost:3000',
  IS_PRODUCTION: true,
  WORKSPACE_SUBDOMAIN_PATTERN: /^[a-zA-Z0-9-]+\.crm\.vire-s\.com$/,
  ALLOWED_HOSTS: [
    'localhost:3000',
    'workspace1.localhost:3000',
    'workspace2.localhost:3000',
    'workspace3.localhost:3000'
  ]
};
