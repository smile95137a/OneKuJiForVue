import axios, { AxiosError, AxiosInstance } from 'axios';
import { getAuthToken } from './AuthService';
import { removeAllState } from '@/utils/Localstorage';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const currentPath = window.location.pathname;

    if (error.code === 'ERR_NETWORK' && currentPath !== '/maintenance') {
      window.location.href = '/maintenance';
    } else if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        removeAllState();
        window.location.href = '/home';
      }
    }
    return Promise.reject(error);
  }
);
