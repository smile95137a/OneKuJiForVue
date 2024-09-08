// store.ts
import { ApiResponse } from '@/interfaces/admin';

export interface StoreProductReq {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrls: (string | File)[];
  categoryId: number;
}

export interface StoreProductRes {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  categoryId: number;
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