import { api } from './FrontAPI';

export interface IProductDetail {
  productId: number;
  productName: string;
  description: string;
  note: string;
  size: string;
  quantity: number;
  stockQuantity: number;
  grade: string;
  price: number;
  sliverPrice: number;
  imageUrl: string;
  prizeNumber: string;
}

const basePath = '/productDetail';

export const getAllProductDetails = async (): Promise<
  ApiResponse<IProductDetail[]>
> => {
  try {
    const response = await api.get<ApiResponse<IProductDetail[]>>(
      `${basePath}/query`
    );
    return response.data;
  } catch (error) {
    console.error('獲取所有產品詳情時發生錯誤:', error);
    throw error;
  }
};

export const getProductDetailById = async (
  productId: number
): Promise<ApiResponse<IProductDetail[]>> => {
  try {
    const response = await api.get<ApiResponse<IProductDetail[]>>(
      `${basePath}/query/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
    throw error;
  }
};
