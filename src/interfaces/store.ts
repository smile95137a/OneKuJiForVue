// store.ts
import { ApiResponse } from '@/interfaces/admin';

export interface StoreProductReq {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: (string | File)[];  // 允許字符串和 File 類型
  categoryId: number;
  width: number;
  height: number;
  depth: number;
}

export interface StoreProductRes {
  storeProductId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string[]; // 後端返回的應該只有字符串類型的 URL
  categoryId: number;
  width: number;
  height: number;
  depth: number;
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

// 新增用於文件上傳的接口
export interface StoreProductFormData {
  productReq: string; // JSON 字符串
  images?: File[];
}