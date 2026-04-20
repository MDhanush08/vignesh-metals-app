import { apiRequest } from './api';

export interface ApiSize {
  name: string;
  HT: number;
  BT: number;
  WT: number;
  _id: string;
  price?: number; // Added just in case it exists in some items
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

export interface ProductsResponse {
  data: ApiProduct[];
  total: number;
  recordsPerPage: number;
  currentPage: number;
  totalPages: number;
  previous: string | null;
  next: string | null;
}

export interface ApiResponse {
  response: ProductsResponse;
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

export interface CategoriesResponse {
  response: {
    data: ApiCategory[];
    total: number;
    recordsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export const getCategories = async (page: number = 1, limit: number = 100): Promise<CategoriesResponse> => {
  return apiRequest(`categories/?page=${page}&limit=${limit}`, { method: 'GET' });
};

export const getProducts = async (page: number = 1, limit: number = 10): Promise<ApiResponse> => {
  return apiRequest(`product/?page=${page}&limit=${limit}`, { method: 'GET' });
};
