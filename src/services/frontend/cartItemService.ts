import { api } from './FrontAPI';
export interface CartItem {
  cartItemId: number;
  cartId: number;
  storeProductId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productDetailId: number;
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

export const updateCartItemQuantity = async (
  id: number,
  quantity: number
): Promise<ApiResponse<string>> => {
  try {
    const response = await api.put<ApiResponse<string>>(
      `${basePath}/update/${id}`,
      null,
      {
        params: { quantity },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};
