import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { apiRequest } from './api';

export interface ApiSize {
  name: string;
  HT: number;
  BT: number;
  WT: number;
  _id: string;
  price?: number;
}

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  slug: string;
  item_code: string;
  category: string;
  stock_availability: boolean;
  size: ApiSize[];
  is_active: boolean;
  created_at: string;
  thumbnail: string;
}

export interface ApiCategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  thumbnail?: string;
}

export const getCategories = async (page: number = 1, limit: number = 100): Promise<PaginatedResponse<ApiCategory>> => {
  return apiRequest(`categories/?page=${page}&limit=${limit}`, { method: 'GET' });
};

export const getProducts = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<ApiProduct>> => {
  return apiRequest(`product/?page=${page}&limit=${limit}`, { method: 'GET' });
};

