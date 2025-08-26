// Production Configuration for crm.vire-s.com deployment
export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://api.crm.vire-s.com',
  CRM_BASE_DOMAIN: 'crm.vire-s.com',
  IS_PRODUCTION: true,
  WORKSPACE_SUBDOMAIN_PATTERN: /^[a-zA-Z0-9-]+\.crm\.vire-s\.com$/,
  ALLOWED_HOSTS: [
    'crm.vire-s.com',
    'workspace1.crm.vire-s.com',
    'workspace2.crm.vire-s.com',
    'workspace3.crm.vire-s.com'
  ]
};
