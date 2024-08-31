import { api } from './FrontAPI'; // 引入API實例

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

const basePath = '/product';

export const getAllProduct = async (): Promise<ApiResponse<IProduct[]>> => {
  try {
    const response = await api.get<ApiResponse<IProduct[]>>(
      `${basePath}/query`
    );
    return response.data;
  } catch (error) {
    console.error('獲取所有產品時發生錯誤:', error);
    throw error;
  }
};

export const getProductById = async (
  id: number
): Promise<ApiResponse<IProduct>> => {
  try {
    const response = await api.get<ApiResponse<IProduct>>(
      `${basePath}/query/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};
