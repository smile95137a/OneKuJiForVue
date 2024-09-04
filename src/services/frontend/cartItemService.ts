import { api } from './FrontAPI';

export interface CartItem {
  productCode: string;
  quantity: number;
}

const basePath = '/cartItem';

export const addCartItem = async (
  cartItem: CartItem
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post<ApiResponse<string>>(
      `${basePath}/add`,
      cartItem
    );
    return response.data;
  } catch (error) {
    console.error('Error adding cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (
  cartItemId: number
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.delete<ApiResponse<string>>(
      `${basePath}/remove/${cartItemId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};
