import { api } from './FrontAPI';

export interface ICartItem {
  cartItemId: number;
  cartId: number;
  storeProductId: number;
  storeProductName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  isPay: boolean;
  imageUrl: string;
  productName: string;
  specialPrice: string;
  size: string;
  isSelected: Boolean;
}

const basePath = '/cart';

export const getCart = async (): Promise<ApiResponse<ICartItem[]>> => {
  try {
    const response = await api.get<ApiResponse<ICartItem[]>>(
      `${basePath}/getCart`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    throw error;
  }
};
