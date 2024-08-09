import api from './Frontapi';

interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  soldQuantity: number;
  rarity: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  createdUser: string;
  updateUser: string;
  updatedAt: string;
  productType: string;
  prizeCategory: string;
  status: string;
}

export interface ProductDetail {
  productId: number;
  description: string;
  rarity: number;
  size: string;
  material: string | null;
  quantity: number;
  productDetailId: number;
  productName: string;
  grade: string;
  createDate: string;
  updateDate: string;
  image: string;
  prizeNumber: number | null;
  drawnNumbers: string | null;
  secret: boolean;
}

export const getProduct = async (productId: number): Promise<Product> => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProductDetail = async (
  productId: number
): Promise<ProductDetail[]> => {
  try {
    const response = await api.get(`/productDetail/query/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/product/query');
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const getAllProductDetails = async (): Promise<ProductDetail[]> => {
  try {
    const response = await api.get('/productDetail/query');
    return response.data;
  } catch (error) {
    console.error('Error fetching all product details:', error);
    throw error;
  }
};
