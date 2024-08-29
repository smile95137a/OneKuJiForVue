import { api } from './FrontAPI';
export interface CartItemRes {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

const basePath = '/cart';

export const getCartItems = async (
  userId: number
): Promise<ApiResponse<CartItemRes[]>> => {
  try {
    const response = await api.get<ApiResponse<CartItemRes[]>>(
      `${basePath}/query/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取購物車數據時發生錯誤:', error);
    throw error;
  }
};
