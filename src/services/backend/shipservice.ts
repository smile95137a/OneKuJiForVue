import axios from 'axios';
import {
  ShippingMethod,
  ShippingMethodReq,
  ApiResponse,
} from '@/interfaces/ship';
import { getAuthToken } from './adminservices';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}/shipping/method`;
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const ShipService = {
  getAllShippingMethods: async (): Promise<ApiResponse<ShippingMethod[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<ShippingMethod[]>>();
      return response.data;
    } catch (error) {
      console.error('Error fetching all shipping methods:', error);
      throw error;
    }
  },

  getShippingMethodById: async (
    id: number
  ): Promise<ApiResponse<ShippingMethod>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<ShippingMethod>>(
        `/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching shipping method with ID ${id}:`, error);
      throw error;
    }
  },

  createShippingMethod: async (
    shippingMethod: ShippingMethodReq
  ): Promise<ApiResponse<ShippingMethod>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<ShippingMethod>>(
        '/',
        shippingMethod
      );
      return response.data;
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw error;
    }
  },

  updateShippingMethod: async (
    id: number,
    shippingMethod: ShippingMethodReq
  ): Promise<ApiResponse<ShippingMethod>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<ShippingMethod>>(
        `/${id}`,
        shippingMethod
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating shipping method with ID ${id}:`, error);
      throw error;
    }
  },

  deleteShippingMethod: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting shipping method with ID ${id}:`, error);
      throw error;
    }
  },
};
