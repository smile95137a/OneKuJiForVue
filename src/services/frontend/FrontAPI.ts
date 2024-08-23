import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getAuthToken } from './AuthService';
import { removeAllState } from '@/utils/Localstorage';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
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
    if (error.response && error.response.status === 401) {
      removeAllState();
    }
    return Promise.reject(error);
  }
);
