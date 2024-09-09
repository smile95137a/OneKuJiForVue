import { StoreCategory, StoreCategoryApiResponse, StoreCategoryListApiResponse, StoreProductApiResponse, StoreProductListApiResponse, StoreProductReq } from '@/interfaces/store';
import { getAuthToken } from '@/services/backend/adminservices';
import axios from 'axios';
import { ApiResponse } from '@/interfaces/admin';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const storeServices = {
  getAllStoreProduct: async (): Promise<StoreProductListApiResponse> => {
    try {
      const response = await axiosInstance.get<StoreProductListApiResponse>('/storeProduct/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching store products:', error);
      throw error;
    }
  },

  addStoreProduct: async (formData: FormData): Promise<StoreProductApiResponse> => {
    try {
      const response = await axiosInstance.post<StoreProductApiResponse>('/storeProduct/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding store product:', error);
      throw error;
    }
  },

  updateStoreProduct: async (id: number, formData: FormData): Promise<StoreProductApiResponse> => {
    try {
      const response = await axiosInstance.put<StoreProductApiResponse>(`/storeProduct/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating store product:', error);
      throw error;
    }
  },

  deleteStoreProduct: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(`/storeProduct/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting store product:', error);
      throw error;
    }
  },

  getAllCategories: async (): Promise<StoreCategoryListApiResponse> => {
    try {
      const response = await axiosInstance.get<StoreCategoryListApiResponse>('/category/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategoryById: async (id: number): Promise<StoreCategoryApiResponse> => {
    try {
      const response = await axiosInstance.get<StoreCategoryApiResponse>(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  createCategory: async (category: StoreCategory): Promise<StoreCategoryApiResponse> => {
    try {
      const response = await axiosInstance.post<StoreCategoryApiResponse>('/category', category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: number, category: StoreCategory): Promise<StoreCategoryApiResponse> => {
    try {
      const response = await axiosInstance.put<StoreCategoryApiResponse>(`/category/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  getImageUrl: (imagePath: string): string => {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_IMAGE_URL}/${cleanPath}`;
  },
};