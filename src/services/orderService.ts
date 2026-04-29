import { apiRequest } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiOrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface ApiOrder {
  _id: string;
  order_number: string;
  order_type: number;
  client_id: string;
  phone: string;
  country_code: number;
  email: string;
  address: string;
  status: number;
  is_approved: boolean;
  items_list: ApiOrderItem[];
  approve_at: string;
  total_qty?: number;
  is_active?: boolean;
  is_archived?: boolean;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdersResponse {
  response: {
    data: ApiOrder[];
    total: number;
    recordsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface SingleOrderResponse {
  response: ApiOrder;
}

export const getOrders = async (page: number = 1, limit: number = 10): Promise<OrdersResponse> => {
  return apiRequest(`order/?limit=${limit}&page=${page}`, { method: 'GET' });
};

export const getOrderById = async (id: string): Promise<SingleOrderResponse> => {
  return apiRequest(`order/${id}`, { method: 'GET' });
};

export const createOrder = async (data: {
  client_id: string;
  items_list: {
    product_id: string;
    qty: number;
    size: string;
  }[];
  order_type: number;
}): Promise<SingleOrderResponse> => {
  return apiRequest(`order/`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getOrderDownloadUrl = (orderId: string): string => {
  return `${API_BASE_URL}order/download/${orderId}`;
};
