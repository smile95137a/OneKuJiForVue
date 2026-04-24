import { api } from './FrontAPI'; // 引入API實例
import axios from 'axios';
import { getAuthToken } from './AuthService';

export interface IProduct {
  productId: number;
  productName: string;
  description: string;
  price: number;
  sliverPrice: number;
  stockQuantity: number;
  imageUrls: string[];
  productType: string;
  prizeCategory: string;
  status: string;
  bonusPrice: number | null;
  length: number;
  width: number;
  height: number;
  specification: string;
  size: number;
  detailQuantity: number | null;
  detailStockQuantity: number | null;
}

export interface ProductQueryReq {
  productName?: string;
  productType?: string;
  prizeCategory?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface PagedResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

const isPagedResult = (data: unknown): data is PagedResult<IProduct> => {
  return (
    !!data &&
    typeof data === 'object' &&
    Array.isArray((data as PagedResult<IProduct>).list) &&
    typeof (data as PagedResult<IProduct>).total === 'number'
  );
};

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL2,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

backendApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const queryProducts = async (
  payload: ProductQueryReq
): Promise<ApiResponse<PagedResult<IProduct>>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/query`,
      payload
    );
    let rawData = response.data.data as unknown;

    // If frontend API still returns legacy data shape, retry on backend API2.
    if (!isPagedResult(rawData)) {
      try {
        const fallbackResponse = await backendApi.post<ApiResponse<any>>(
          `${basePath}/query`,
          payload
        );
        if (isPagedResult(fallbackResponse.data.data)) {
          return {
            ...fallbackResponse.data,
            data: fallbackResponse.data.data,
          };
        }
        rawData = fallbackResponse.data.data;
      } catch (fallbackError) {
        console.warn('backend 分頁 fallback 失敗', fallbackError);
      }
    }

    if (!isPagedResult(rawData)) {
      throw new Error(
        `後端 /product/query 未回傳分頁格式，預期 data.list/total/page/size/totalPages，實際為: ${JSON.stringify(
          rawData
        )}`
      );
    }

    return {
      ...response.data,
      data: rawData,
    };
  } catch (error) {
    console.error('分頁查詢產品時發生錯誤:', error);
    throw error;
  }
};

const basePath = '/product';

export const getAllProduct = async (
  page: number = 1,
  size: number = 6
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.post<ApiResponse<any>>(`${basePath}/query`, {
      page,
      size,
    });

    const list = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.list || [];

    return {
      ...response.data,
      data: list,
    };
  } catch (error) {
    console.error('獲取所有產品時發生錯誤:', error);
    throw error;
  }
};

export const getAllProductList = async (
  page: number = 1,
  size: number = 100
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.post<ApiResponse<any>>(`${basePath}/all`, {
      page,
      size,
    });

    const list = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.list || [];

    return {
      ...response.data,
      data: list,
    };
  } catch (error) {
    console.error('獲取所有產品時發生錯誤:', error);
    throw error;
  }
};

export const getProductById = async (
  id: number
): Promise<ApiResponse<IProduct>> => {
  try {
    const response = await api.post<ApiResponse<IProduct>>(
      `${basePath}/getById`,
      { id }
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};

export const getProductByType = async (
  productType: string,
  page: number = 1,
  size: number = 20
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.post<ApiResponse<any>>(`${basePath}/type`, {
      productType,
      page,
      size,
    });

    const list = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.list || [];

    return {
      ...response.data,
      data: list,
    };
  } catch (error) {
    console.error('獲取產品類型時發生錯誤:', error);
    throw error;
  }
};

export const getProductByPrizeCategory = async (
  prizeCategory: string,
  page: number = 1,
  size: number = 20
): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.post<ApiResponse<any>>(`${basePath}/query`, {
      productType: 'PRIZE',
      prizeCategory,
      page,
      size,
    });
    const list = Array.isArray(response.data.data)
      ? response.data.data
      : response.data.data?.list || [];

    return {
      ...response.data,
      data: list,
    };
  } catch (error) {
    console.error('依獎品類別查詢產品時發生錯誤:', error);
    throw error;
  }
};
