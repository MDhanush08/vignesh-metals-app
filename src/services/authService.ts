import { apiRequest } from './api';

export interface User {
  email: string;
  is_password_not_set: boolean;
  name: string;
  token: string;
  user_type: number;
  _id: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  status: string;
  error: boolean;
  response: User;
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    return apiRequest('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  },

  changePassword: async (data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    return apiRequest('salesperson/Change-password', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};
