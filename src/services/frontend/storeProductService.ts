import { api } from './FrontAPI';

export interface IStoreProduct {
  storeProductId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrls: string[];
  categoryId: string;
  status: string;
  specialPrice: number;
  shippingMethod: string;
  size: number;
  shippingPrice: number;
  length: number;
  width: number;
  height: number;
  specification: string;
  createdAt: string;
}

const basePath = '/storeProduct';

export const getPagedStoreProducts = async (
  page: number,
  size: number
): Promise<ApiResponse<IStoreProduct[]>> => {
  try {
    const response = await api.get<ApiResponse<IStoreProduct[]>>(
      `${basePath}/query`,
      {
        params: {
          page,
          size,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('分頁獲取產品數據時發生錯誤:', error);
    throw error;
  }
};

export const getStoreProductById = async (
  productCode: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/query/${productCode}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};
