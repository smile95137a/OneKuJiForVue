import axios from 'axios';
import { ShippingMethod, ShippingMethodReq, ApiResponse } from '@/interfaces/ship';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}/shipping/method`;

export const ShipService = {
  getAllShippingMethods: async (): Promise<ApiResponse<ShippingMethod[]>> => {
    const response = await axios.get<ApiResponse<ShippingMethod[]>>(API_URL);
    return response.data;
  },

  getShippingMethodById: async (id: number): Promise<ApiResponse<ShippingMethod>> => {
    const response = await axios.get<ApiResponse<ShippingMethod>>(`${API_URL}/${id}`);
    return response.data;
  },

  createShippingMethod: async (shippingMethod: ShippingMethodReq): Promise<ApiResponse<ShippingMethod>> => {
    const response = await axios.post<ApiResponse<ShippingMethod>>(API_URL, shippingMethod);
    return response.data;
  },

  updateShippingMethod: async (id: number, shippingMethod: ShippingMethodReq): Promise<ApiResponse<ShippingMethod>> => {
    const response = await axios.put<ApiResponse<ShippingMethod>>(`${API_URL}/${id}`, shippingMethod);
    return response.data;
  },

  deleteShippingMethod: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete<ApiResponse<void>>(`${API_URL}/${id}`);
    return response.data;
  },
};