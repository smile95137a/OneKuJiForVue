import axios from 'axios';
import { ProductReq, ProductRes, ApiResponse } from '@/interfaces/product';
const baseURL = import.meta.env.VITE_BASE_API_URL2;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAllProducts: () => 
    apiClient.get<ApiResponse<ProductRes[]>>('/product/query'),

  getProductByType: (type: string) => 
    apiClient.post<ApiResponse<ProductRes[]>>('/product/type', { type }),

  getProductByOneKuJiType: (type: string) => 
    apiClient.post<ApiResponse<ProductRes[]>>('/product/OneKuJi/type', { type }),

  getProductById: (id: number) => 
    apiClient.get<ApiResponse<ProductRes>>(`/product/query/${id}`),

  createProduct: (formData: FormData) => 
    apiClient.post<ApiResponse<ProductRes>>('/product/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateProduct: (id: number, formData: FormData) => 
    apiClient.put<ApiResponse<ProductRes>>(`/product/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  deleteProduct: (id: number) => 
    apiClient.delete<ApiResponse<void>>(`/product/delete/${id}`),
};