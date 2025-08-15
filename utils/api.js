// Business endpoints
import apiClient from './apiClient';
import { loginUser, refreshAuthToken, logOutUser } from './authService';
import { testServerConnection, testOAuthVariations } from './debugApi';

export const api = {
  // Auth
  login: loginUser,
  refreshToken: refreshAuthToken,
  logout: logOutUser,
  testConnection: testServerConnection,
  testOAuthVariations,

  // User
  getProfile: () => apiClient.get('/api/user/profile'),
  updateProfile: (data) => apiClient.put('/api/user/profile', data),

  // Products
  getProducts: (params) => apiClient.get('/api/products', { params }),
  getProduct: (id) => apiClient.get(`/api/products/${id}`),
  searchProducts: (query) => apiClient.get('/api/products/search', { params: { q: query } }),

  // Orders
  getOrders: () => apiClient.get('/api/orders'),
  getOrder: (id) => apiClient.get(`/api/orders/${id}`),
  createOrder: (data) => apiClient.post('/api/orders', data),
  updateOrder: (id, data) => apiClient.put(`/api/orders/${id}`, data),
};

export default api;
