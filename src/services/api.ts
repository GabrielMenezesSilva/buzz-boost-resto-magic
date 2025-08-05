import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
import { tokenStorage, isTokenExpired } from '@/utils/auth';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenStorage.remove();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API Service class
class ApiService {
  // Auth methods
  async login(email: string, password: string) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  }

  async register(email: string, password: string, restaurantName: string, ownerName: string) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      restaurantName,
      ownerName,
    });
    return response.data;
  }

  async getCurrentUser() {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }

  async logout() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  }

  // Contacts methods
  async getContacts() {
    const response = await apiClient.get(API_ENDPOINTS.CONTACTS);
    return response.data;
  }

  async createContact(contactData: any) {
    const response = await apiClient.post(API_ENDPOINTS.CONTACTS, contactData);
    return response.data;
  }

  async updateContact(contactId: string, updates: any) {
    const response = await apiClient.put(`${API_ENDPOINTS.CONTACTS}/${contactId}`, updates);
    return response.data;
  }

  async deleteContact(contactId: string) {
    const response = await apiClient.delete(`${API_ENDPOINTS.CONTACTS}/${contactId}`);
    return response.data;
  }

  // Campaigns methods
  async getCampaigns() {
    const response = await apiClient.get(API_ENDPOINTS.CAMPAIGNS);
    return response.data;
  }

  async createCampaign(campaignData: any) {
    const response = await apiClient.post(API_ENDPOINTS.CAMPAIGNS, campaignData);
    return response.data;
  }

  async updateCampaign(campaignId: string, updates: any) {
    const response = await apiClient.put(`${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`, updates);
    return response.data;
  }

  async deleteCampaign(campaignId: string) {
    const response = await apiClient.delete(`${API_ENDPOINTS.CAMPAIGNS}/${campaignId}`);
    return response.data;
  }

  async sendCampaign(campaignId: string) {
    const response = await apiClient.post(API_ENDPOINTS.CAMPAIGNS_SEND(campaignId));
    return response.data;
  }

  // Templates methods
  async getTemplates() {
    const response = await apiClient.get(API_ENDPOINTS.TEMPLATES);
    return response.data;
  }

  async createTemplate(templateData: any) {
    const response = await apiClient.post(API_ENDPOINTS.TEMPLATES, templateData);
    return response.data;
  }

  async updateTemplate(templateId: string, updates: any) {
    const response = await apiClient.put(`${API_ENDPOINTS.TEMPLATES}/${templateId}`, updates);
    return response.data;
  }

  async deleteTemplate(templateId: string) {
    const response = await apiClient.delete(`${API_ENDPOINTS.TEMPLATES}/${templateId}`);
    return response.data;
  }

  // Analytics methods
  async getAnalytics() {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS);
    return response.data;
  }

  // QR methods
  async generateQR(data: any) {
    const response = await apiClient.post(API_ENDPOINTS.QR, data);
    return response.data;
  }

  // Public form submission
  async submitPublicForm(qrCode: string, formData: any) {
    const response = await apiClient.post(`/public/form/${qrCode}`, formData);
    return response.data;
  }
}

export const apiService = new ApiService();
export { apiClient };