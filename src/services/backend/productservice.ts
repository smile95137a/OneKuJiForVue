// src/services/backend/productservice.ts

import { ApiResponse, DetailApiResponse, DetailListApiResponse, DetailReq, PrizeCategory, ProductApiResponse, ProductListApiResponse, ProductReq, ProductType, ProductCategory, ProductCategoryApiResponse, ProductCategoryListApiResponse } from '@/interfaces/product';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const productservice = {
  getAllProducts: async (): Promise<ProductListApiResponse> => {
    console.log('調用 getAllProducts API');
    try {
      const response = await axiosInstance.get<ProductListApiResponse>('/product/query');
      console.log('getAllProducts 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getAllProducts 錯誤:', error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<ProductApiResponse> => {
    console.log(`調用 getProductById API, id: ${id}`);
    try {
      const response = await axiosInstance.get<ProductApiResponse>(`/product/query/${id}`);
      console.log('getProductById 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getProductById 錯誤:', error);
      throw error;
    }
  },

  createProduct: async (productReq: ProductReq): Promise<ProductApiResponse> => {
    console.log('調用 createProduct API', productReq);
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

    try {
      const response = await axiosInstance.post<ProductApiResponse>('/product/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('createProduct 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('createProduct 錯誤:', error);
      throw error;
    }
  },

  updateProduct: async (id: number, productReq: ProductReq): Promise<ProductApiResponse> => {
    console.log(`調用 updateProduct API, id: ${id}`, productReq);
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

    try {
      const response = await axiosInstance.put<ProductApiResponse>(`/product/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('updateProduct 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateProduct 錯誤:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
    console.log(`調用 deleteProduct API, id: ${id}`);
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(`/product/delete/${id}`);
      console.log('deleteProduct 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('deleteProduct 錯誤:', error);
      throw error;
    }
  },

  getAllProductsByType: async (productType: ProductType): Promise<ProductListApiResponse> => {
    console.log(`調用 getAllProductsByType API, type: ${productType}`);
    try {
      const response = await axiosInstance.post<ProductListApiResponse>('/product/type', { type: productType });
      console.log('getAllProductsByType 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getAllProductsByType 錯誤:', error);
      throw error;
    }
  },

  getOneKuJiType: async (prizeCategory: PrizeCategory): Promise<ProductListApiResponse> => {
    console.log(`調用 getOneKuJiType API, category: ${prizeCategory}`);
    try {
      const response = await axiosInstance.post<ProductListApiResponse>('/product/OneKuJi/type', { type: prizeCategory });
      console.log('getOneKuJiType 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getOneKuJiType 錯誤:', error);
      throw error;
    }
  },

  getAllProductDetails: async (): Promise<DetailListApiResponse> => {
    console.log('調用 getAllProductDetails API');
    try {
      const response = await axiosInstance.get<DetailListApiResponse>('/productDetail/all');
      console.log('getAllProductDetails 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getAllProductDetails 錯誤:', error);
      throw error;
    }
  },

  createProductDetails: async (detailReqs: DetailReq[]): Promise<DetailListApiResponse> => {
    console.log('調用 createProductDetails API', detailReqs);
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

    formData.append('productDetailReq', JSON.stringify(detailReqsCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axiosInstance.post<DetailListApiResponse>('/productDetail/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('createProductDetails 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('createProductDetails 錯誤:', error);
      throw error;
    }
  },

  updateProductDetail: async (id: number, detailReq: DetailReq): Promise<DetailApiResponse> => {
    console.log(`調用 updateProductDetail API, id: ${id}`, detailReq);
    const formData = new FormData();
    const detailReqCopy = { ...detailReq };
    const imageFiles: File[] = [];

    detailReqCopy.imageUrls.forEach((url, index) => {
      if (url instanceof File) {
        imageFiles.push(url);
        detailReqCopy.imageUrls[index] = ''; // Placeholder for backend to replace
      }
    });

    formData.append('productDetailReq', JSON.stringify(detailReqCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axiosInstance.put<DetailApiResponse>(`/productDetail/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('updateProductDetail 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateProductDetail 錯誤:', error);
      throw error;
    }
  },

  deleteProductDetail: async (id: number): Promise<ApiResponse<void>> => {
    console.log(`調用 deleteProductDetail API, id: ${id}`);
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(`/productDetail/delete/${id}`);
      console.log('deleteProductDetail 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('deleteProductDetail 錯誤:', error);
      throw error;
    }
  },

  getImageUrl: (imagePath: string): string => {
    console.log(`生成圖片 URL: ${imagePath}`);
    return `${API_IMAGE_URL}/img${imagePath}`;
  },

  // 新增的類別相關方法
  getAllCategories: async (): Promise<ProductCategoryListApiResponse> => {
    console.log('調用 getAllCategories API');
    try {
      const response = await axiosInstance.get<ProductCategoryListApiResponse>('/productCategory/all');
      console.log('getAllCategories 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getAllCategories 錯誤:', error);
      throw error;
    }
  },

  getCategoryById: async (id: number): Promise<ProductCategoryApiResponse> => {
    console.log(`調用 getCategoryById API, id: ${id}`);
    try {
      const response = await axiosInstance.get<ProductCategoryApiResponse>(`/productCategory/${id}`);
      console.log('getCategoryById 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getCategoryById 錯誤:', error);
      throw error;
    }
  },

  createCategory: async (category: { categoryName: string }): Promise<ProductCategoryApiResponse> => {
    console.log('調用 createCategory API', category);
    try {
      const response = await axiosInstance.post<ProductCategoryApiResponse>('/productCategory', category);
      console.log('createCategory 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('createCategory 錯誤:', error);
      throw error;
    }
  },

  updateCategory: async (id: number, category: ProductCategory): Promise<ProductCategoryApiResponse> => {
    console.log(`調用 updateCategory API, id: ${id}`, category);
    try {
      const response = await axiosInstance.put<ProductCategoryApiResponse>(`/productCategory/${id}`, category);
      console.log('updateCategory 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateCategory 錯誤:', error);
      throw error;
    }
  },

  deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    console.log(`調用 deleteCategory API, id: ${id}`);
    try {
      const response =await axiosInstance.delete<ApiResponse<void>>(`/productCategory/${id}`);
      console.log('deleteCategory 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('deleteCategory 錯誤:', error);
      throw error;
    }
  },
};

export default productservice;