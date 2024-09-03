import axios from 'axios';
import { ProductReq, ProductRes, ApiResponse } from '@/interfaces/product';

const API_URL = 'https://your-api-base-url.com/api'; // 請替換為實際的 API URL

export const productService = {
  getAllProducts: () => 
    axios.get<ApiResponse<ProductRes[]>>(`${API_URL}/product/query`),

  getProductByType: (type: string) => 
    axios.post<ApiResponse<ProductRes[]>>(`${API_URL}/product/type`, { type }),

  getProductByOneKuJiType: (type: string) => 
    axios.post<ApiResponse<ProductRes[]>>(`${API_URL}/product/OneKuJi/type`, { type }),

  getProductById: (id: number) => 
    axios.get<ApiResponse<ProductRes>>(`${API_URL}/product/query/${id}`),

  createProduct: (formData: FormData) => 
    axios.post<ApiResponse<ProductRes>>(`${API_URL}/product/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateProduct: (id: number, formData: FormData) => 
    axios.put<ApiResponse<ProductRes>>(`${API_URL}/product/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  deleteProduct: (id: number) => 
    axios.delete<ApiResponse<void>>(`${API_URL}/product/delete/${id}`),
};