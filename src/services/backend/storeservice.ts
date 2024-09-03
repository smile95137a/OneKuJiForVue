import axios from 'axios';
import { StoreProductReq, StoreProductRes, ApiResponse } from '@/interfaces/store';

const BASE_URL = import.meta.env.VITE_BASE_API_URL2 || 'http://46.51.232.156:8080';
const API_URL = `${BASE_URL}/api/storeProduct`;

export const storeService = {
  getAllStoreProducts: async (): Promise<ApiResponse<StoreProductRes[]>> => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  },

  addStoreProduct: async (productReq: StoreProductReq, images: File[]): Promise<ApiResponse<StoreProductRes>> => {
    const formData = new FormData();
    formData.append('productReq', JSON.stringify(productReq));
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post(`${API_URL}/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateStoreProduct: async (id: number, productReq: StoreProductReq, images: File[]): Promise<ApiResponse<StoreProductRes>> => {
    const formData = new FormData();
    formData.append('storeProductReq', JSON.stringify(productReq));
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.put(`${API_URL}/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteStoreProduct: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  }
};