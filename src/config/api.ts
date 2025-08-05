// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  // Contacts
  CONTACTS: '/contacts',
  // Campaigns
  CAMPAIGNS: '/campaigns',
  CAMPAIGNS_SEND: (id: string) => `/campaigns/${id}/send`,
  // Templates
  TEMPLATES: '/templates',
  // Analytics
  ANALYTICS: '/analytics',
  // Profiles
  PROFILES: '/profiles',
  // QR
  QR: '/qr',
  // SMS
  SMS: '/sms',
};