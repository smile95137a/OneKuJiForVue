// store.ts
import { ApiResponse } from '@/interfaces/admin';

export interface StoreProductReq {
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: (string | File)[];
  categoryId: number;
  width: number;
  height: number;
  length: number;
  specification: string;
  shippingMethod: string;
  specialPrice: number;
  status: string;
  shippingPrice: number;
  size: number;
}

export interface StoreProductRes {
  storeProductId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string[];
  categoryId: number;
  width: number;
  height: number;
  length: number
  specification: string;
  shippingMethod: string;
  specialPrice: number;
  status: string;
  shippingPrice: number;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCategory {
  categoryId: number;
  categoryName: string;
}

export type StoreProductApiResponse = ApiResponse<StoreProductRes>;
export type StoreProductListApiResponse = ApiResponse<StoreProductRes[]>;
export type StoreCategoryApiResponse = ApiResponse<StoreCategory>;
export type StoreCategoryListApiResponse = ApiResponse<StoreCategory[]>;

// Interface for file upload
export interface StoreProductFormData {
  productReq: string; // JSON string
  images: File[];
}