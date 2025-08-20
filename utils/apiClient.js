// Axios instance with interceptors
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import { refreshAuthToken, logOutUser } from './authService';

const apiClient = axios.create({
  baseURL: API_BASE_URL || 'https://5secom.dientoan.vn',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (__DEV__) {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) console.log('📦', config.data);
  }
  return config;
});

// Response interceptor: refresh token on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config._retry && config.headers.Authorization) {
      config._retry = true;
      if (await refreshAuthToken()) {
        const token = await SecureStore.getItemAsync('access_token');
        config.headers.Authorization = `Bearer ${token}`;
        return apiClient.request(config);
      }
      await logOutUser();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
