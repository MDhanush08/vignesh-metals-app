import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { apiRequest } from './api';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiClient {
  _id: string;
  client_code?: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  Address_line_one: string;
  Address_line_two: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_active: boolean;
  sales_person_id: string;
  gst_registration_type?: number;
  gst_number?: string;
  pan_number?: string;
}

export const getClients = async (page: number = 1, limit: number = 100): Promise<PaginatedResponse<ApiClient>> => {
  return apiRequest(`clients/?limit=${limit}&page=${page}`, { method: 'GET' });
};

export const getClientList = async (page: number = 1, limit: number = 200): Promise<PaginatedResponse<ApiClient>> => {
  return apiRequest(`order/client`, { method: 'GET' });
};

export const getClientById = async (id: string): Promise<ApiResponse<ApiClient>> => {
  return apiRequest(`clients/${id}`, { method: 'GET' });
};

export const createClient = async (data: Partial<ApiClient>): Promise<ApiResponse<ApiClient>> => {
  return apiRequest(`clients/`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateClient = async (id: string, data: Partial<ApiClient>): Promise<ApiResponse<ApiClient>> => {
  return apiRequest(`clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const getClientsDownloadUrl = (): string => {
  return `${API_BASE_URL}clients/download`;
};
