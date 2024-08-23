import { api } from './FrontAPI';

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

const productBasePath = '/product';
const productDetailBasePath = '/productDetail';

// 獲取單個產品
export const getProduct = async (productId: number): Promise<Product> => {
  try {
    const response = await api.get(`${productBasePath}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// 獲取單個產品詳情
export const getProductDetail = async (
  productId: number
): Promise<ProductDetail[]> => {
  try {
    const response = await api.get(
      `${productDetailBasePath}/query/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

// 獲取所有產品
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get(`${productBasePath}/query`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// 獲取所有產品詳情
export const getAllProductDetails = async (): Promise<ProductDetail[]> => {
  try {
    const response = await api.get(`${productDetailBasePath}/query`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all product details:', error);
    throw error;
  }
};
