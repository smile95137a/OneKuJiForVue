// src/services/backend/productservice.ts

import {
  ApiResponse,
  DetailApiResponse,
  DetailListApiResponse,
  DetailReq,
  PrizeCategory,
  ProductApiResponse,
  ProductCategoryApiResponse,
  ProductCategoryListApiResponse,
  ProductListApiResponse,
  ProductReq,
  ProductType,
} from '@/interfaces/product';
import axios from 'axios';
import { getAuthToken } from './adminservices';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

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

export const productservice = {
  getAllProducts: async (): Promise<ProductListApiResponse> => {
    try {
      const response = await axiosInstance.get<ProductListApiResponse>(
        '/product/query'
      );
      return response.data;
    } catch (error) {
      console.error('getAllProducts 錯誤:', error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<ProductApiResponse> => {
    try {
      const response = await axiosInstance.get<ProductApiResponse>(
        `/product/query/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('getProductById 錯誤:', error);
      throw error;
    }
  },
  createSingleProductDetail: async (
    detailReq: DetailReq
  ): Promise<DetailApiResponse> => {
    if (!detailReq.productId || detailReq.productId <= 0) {
      console.error('無效的 productId:', detailReq.productId);
      throw new Error('無效的 productId');
    }
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
      const response = await axiosInstance.post<DetailApiResponse>(
        '/productDetail/add',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('createSingleProductDetail 錯誤:', error);
      throw error;
    }
  },
  createProduct: async (
    productReq: ProductReq
  ): Promise<ProductApiResponse> => {
    const formData = new FormData();
    const productReqCopy = { ...productReq };
    const imageFiles: File[] = [];
    const bannerImage: File[] = []; // 假设 banner 图片是一个文件

    // 处理产品的图片，如果 imageUrls 存在且是数组
    if (Array.isArray(productReqCopy.imageUrls)) {
      productReqCopy.imageUrls.forEach((url, index) => {
        if (url instanceof File) {
          imageFiles.push(url);
          productReqCopy.imageUrls[index] = ''; // 为了后台处理，替换为占位符
        }
      });
    }

    // 处理 banner 图片，如果 bannerImageUrl 存在且是数组
    if (Array.isArray(productReqCopy.bannerImageUrl)) {
      productReqCopy.bannerImageUrl.forEach((url, index) => {
        if (url instanceof File) {
          bannerImage.push(url);
          productReqCopy.bannerImageUrl[index] = ''; // 为了后台处理，替换为占位符
        }
      });
    }

    // 将产品请求对象转为字符串并添加到 formData
    formData.append('productReq', JSON.stringify(productReqCopy));

    // 添加图片文件到 formData
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    // 添加 banner 图片
    bannerImage.forEach((file) => {
      formData.append('bannerImageUrl', file);
    });

    try {
      // 调用后端接口创建产品
      const response = await axiosInstance.post<ProductApiResponse>(
        '/product/add',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (
    id: number,
    productReq: ProductReq
  ): Promise<ProductApiResponse> => {
    const formData = new FormData();
    const productReqCopy = { ...productReq };
    const imageFiles: File[] = [];
    const banner: File[] = [];

    // 检查 imageUrls 是否非空，并且是数组
    if (Array.isArray(productReqCopy.imageUrls)) {
      productReqCopy.imageUrls.forEach((url, index) => {
        if (url instanceof File) {
          imageFiles.push(url);
          productReqCopy.imageUrls[index] = ''; // Placeholder for backend to replace
        }
      });
    }

    // 检查 bannerImageUrl 是否非空，并且是数组
    if (Array.isArray(productReqCopy.bannerImageUrl)) {
      productReqCopy.bannerImageUrl.forEach((url, index) => {
        if (url instanceof File) {
          banner.push(url);
          productReqCopy.bannerImageUrl[index] = ''; // Placeholder for backend to replace
        }
      });
    }

    formData.append('productReq', JSON.stringify(productReqCopy));
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    banner.forEach((file) => {
      formData.append('bannerImageUrl', file);
    });

    try {
      const response = await axiosInstance.put<ProductApiResponse>(
        `/product/update/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('updateProduct 錯誤:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `/product/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('deleteProduct 錯誤:', error);
      throw error;
    }
  },

  getAllProductsByType: async (
    productType: ProductType
  ): Promise<ProductListApiResponse> => {
    try {
      const response = await axiosInstance.post<ProductListApiResponse>(
        '/product/type',
        { type: productType }
      );
      return response.data;
    } catch (error) {
      console.error('getAllProductsByType 錯誤:', error);
      throw error;
    }
  },

  getOneKuJiType: async (
    prizeCategory: PrizeCategory
  ): Promise<ProductListApiResponse> => {
    try {
      const response = await axiosInstance.post<ProductListApiResponse>(
        '/product/OneKuJi/type',
        { type: prizeCategory }
      );
      return response.data;
    } catch (error) {
      console.error('getOneKuJiType 錯誤:', error);
      throw error;
    }
  },

  getAllProductDetails: async (): Promise<DetailListApiResponse> => {
    try {
      const response = await axiosInstance.get<DetailListApiResponse>(
        '/productDetail/all'
      );
      return response.data;
    } catch (error) {
      console.error('getAllProductDetails 錯誤:', error);
      throw error;
    }
  },

  createProductDetails: async (
    detailReqs: DetailReq[]
  ): Promise<DetailListApiResponse> => {
    const formData = new FormData();
    const detailReqsCopy = detailReqs.map((req) => ({ ...req }));
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
      const response = await axiosInstance.post<DetailListApiResponse>(
        '/productDetail/add',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('createProductDetails 錯誤:', error);
      throw error;
    }
  },

  updateProductDetail: async (
    id: number,
    detailReq: DetailReq
  ): Promise<DetailApiResponse> => {
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
      const response = await axiosInstance.put<DetailApiResponse>(
        `/productDetail/update/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('updateProductDetail 錯誤:', error);
      throw error;
    }
  },

  deleteProductDetail: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `/productDetail/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('deleteProductDetail 錯誤:', error);
      throw error;
    }
  },

  getImageUrl: (imagePath: string): string => {
    return `${API_IMAGE_URL}${imagePath}`;
  },

  // 新增的類別相關方法
  getAllCategories: async (): Promise<ProductCategoryListApiResponse> => {
    try {
      const response = await axiosInstance.get<ProductCategoryListApiResponse>(
        '/productCategory/all'
      );
      return response.data;
    } catch (error) {
      console.error('getAllCategories 錯誤:', error);
      throw error;
    }
  },

  getCategoryById: async (id: number): Promise<ProductCategoryApiResponse> => {
    try {
      const response = await axiosInstance.get<ProductCategoryApiResponse>(
        `/productCategory/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('getCategoryById 錯誤:', error);
      throw error;
    }
  },

  // 更新 createCategory 和 updateCategory 方法

  createCategory: async (category: {
    categoryName: string;
    productSort: number | null;
  }): Promise<ProductCategoryApiResponse> => {
    try {
      const response = await axiosInstance.post<ProductCategoryApiResponse>(
        '/productCategory',
        category
      );
      return response.data;
    } catch (error) {
      console.error('createCategory 錯誤:', error);
      throw error;
    }
  },

  updateCategory: async (
    id: number,
    category: { categoryName: string; productSort: number | null }
  ): Promise<ProductCategoryApiResponse> => {
    try {
      const response = await axiosInstance.put<ProductCategoryApiResponse>(
        `/productCategory/${id}`,
        category
      );
      return response.data;
    } catch (error) {
      console.error('updateCategory 錯誤:', error);
      throw error;
    }
  },

  deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `/productCategory/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('deleteCategory 錯誤:', error);
      throw error;
    }
  },

  copyProduct: async (productId: any) => {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        `/product/${productId}/duplicate`
      );
      return response.data;
    } catch (error) {
      console.error('Error copying product:', error);
      throw error;
    }
  },
};

export default productservice;
