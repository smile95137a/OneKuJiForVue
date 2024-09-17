// src/services/backend/productservice.ts

import axios from 'axios';
import { ProductReq, ProductRes, ProductApiResponse, ProductListApiResponse, DetailReq, DetailRes, DetailApiResponse, DetailListApiResponse, ProductType, PrizeCategory, ApiResponse } from '@/interfaces/product';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const productservice = {
  getAllProducts: async (): Promise<ProductListApiResponse> => {
    const response = await axiosInstance.get<ProductListApiResponse>('/product/query');
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductApiResponse> => {
    const response = await axiosInstance.get<ProductApiResponse>(`/product/query/${id}`);
    return response.data;
  },

  createProduct: async (productReq: ProductReq): Promise<ProductApiResponse> => {
    const formData = new FormData();
    const productReqCopy = { ...productReq };
    const imageFiles: File[] = [];

    productReqCopy.imageUrls.forEach((url, index) => {
      if (url instanceof File) {
        imageFiles.push(url);
        productReqCopy.imageUrls[index] = ''; // Placeholder for backend to replace
      }
    });

    formData.append('productReq', JSON.stringify(productReqCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.post<ProductApiResponse>('/product/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProduct: async (id: number, productReq: ProductReq): Promise<ProductApiResponse> => {
    const formData = new FormData();
    const productReqCopy = { ...productReq };
    const imageFiles: File[] = [];

    productReqCopy.imageUrls.forEach((url, index) => {
      if (url instanceof File) {
        imageFiles.push(url);
        productReqCopy.imageUrls[index] = ''; // Placeholder for backend to replace
      }
    });

    formData.append('productReq', JSON.stringify(productReqCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.put<ProductApiResponse>(`/product/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/product/delete/${id}`);
    return response.data;
  },

  getAllProductsByType: async (productType: ProductType): Promise<ProductListApiResponse> => {
    const response = await axiosInstance.post<ProductListApiResponse>('/product/type', { type: productType });
    return response.data;
  },

  getOneKuJiType: async (prizeCategory: PrizeCategory): Promise<ProductListApiResponse> => {
    const response = await axiosInstance.post<ProductListApiResponse>('/product/OneKuJi/type', { type: prizeCategory });
    return response.data;
  },

  getAllProductDetails: async (): Promise<DetailListApiResponse> => {
    const response = await axiosInstance.get<DetailListApiResponse>('/productDetail/all');
    return response.data;
  },

  createProductDetails: async (detailReqs: DetailReq[]): Promise<DetailListApiResponse> => {
    const formData = new FormData();
    const detailReqsCopy = detailReqs.map(req => ({ ...req }));
    const imageFiles: File[] = [];

    detailReqsCopy.forEach((req, reqIndex) => {
      req.imageUrls.forEach((url, urlIndex) => {
        if (url instanceof File) {
          imageFiles.push(url);
          detailReqsCopy[reqIndex].imageUrls[urlIndex] = ''; // Placeholder for backend to replace
        }
      });
    });

    formData.append('detailReqs', JSON.stringify(detailReqsCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.post<DetailListApiResponse>('/productDetail/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProductDetail: async (id: number, detailReq: DetailReq): Promise<DetailApiResponse> => {
    const formData = new FormData();
    const detailReqCopy = { ...detailReq };
    const imageFiles: File[] = [];

    detailReqCopy.imageUrls.forEach((url, index) => {
      if (url instanceof File) {
        imageFiles.push(url);
        detailReqCopy.imageUrls[index] = ''; // Placeholder for backend to replace
      }
    });

    formData.append('detailReq', JSON.stringify(detailReqCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.put<DetailApiResponse>(`/productDetail/update/${id}`, formData, {
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