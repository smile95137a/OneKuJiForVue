// src/services/backend/productservice.ts

import axios from 'axios';
import { ProductReq, ProductRes, ProductApiResponse, ProductListApiResponse, ProductDetailReq, ProductDetailRes, ProductDetailApiResponse, ProductDetailListApiResponse, ApiResponse } from '@/interfaces/product';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add authentication interceptor if needed

export const productService = {
  getAllProducts: async (): Promise<ProductListApiResponse> => {
    const response = await axiosInstance.get<ProductListApiResponse>('/product/query');
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductApiResponse> => {
    const response = await axiosInstance.get<ProductApiResponse>(`/product/query/${id}`);
    return response.data;
  },

  createProduct: async (formData: FormData): Promise<ProductApiResponse> => {
    const response = await axiosInstance.post<ProductApiResponse>('/product/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProduct: async (id: number, formData: FormData): Promise<ProductApiResponse> => {
    const response = await axiosInstance.put<ProductApiResponse>(`/product/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/product/delete/${id}`);
    return response.data;
  },

  createProductDetail: async (formData: FormData): Promise<ProductDetailApiResponse> => {
    const response = await axiosInstance.post<ProductDetailApiResponse>('/productDetail/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProductDetail: async (id: number, formData: FormData): Promise<ProductDetailApiResponse> => {
    const response = await axiosInstance.put<ProductDetailApiResponse>(`/productDetail/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteProductDetail: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/productDetail/delete/${id}`);
    return response.data;
  },

  getImageUrl: (imagePath: string): string => {
    return `${API_IMAGE_URL}/img${imagePath}`;
  },
};