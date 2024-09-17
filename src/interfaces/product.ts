// src/interfaces/product.ts

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  NOT_AVAILABLE_YET = 'NOT_AVAILABLE_YET',
  SOLD_OUT = 'SOLD_OUT'
}

export enum ProductType {
  PRIZE = 'PRIZE',
  GACHA = 'GACHA',
  BLIND_BOX = 'BLIND_BOX'
}

export enum PrizeCategory {
  FIGURE = 'FIGURE',
  C3 = 'C3',
  BONUS = 'BONUS',
  NONE = 'NONE'
}

export interface ProductReq {
  productId?: number;
  productName: string;
  description: string;
  price: number;
  sliverPrice: number;
  stockQuantity: number;
  imageUrls: (string | File)[];
  productType: ProductType;
  prizeCategory: PrizeCategory;
  status: ProductStatus;
  bonusPrice: number;
  specification: string;
}

export interface ProductRes {
  productId: number;
  productName: string;
  description: string;
  price: number;
  sliverPrice: number;
  stockQuantity: number;
  imageUrls: string[];
  productType: ProductType;
  prizeCategory: PrizeCategory;
  status: ProductStatus;
  bonusPrice: number;
  specification: string;
}

export interface DetailReq {
  productDetailId?: number;
  productId: number;
  description: string;
  note: string;
  //size: string;
  quantity: number;
  stockQuantity: number;
  productName: string;
  grade: string;
  price: number;
  sliverPrice: number;
  imageUrls: (string | File)[];
  length: number;
  width: number;
  height: number;
  specification: string;
}

export interface DetailRes {
  productDetailId: number;
  productId: number;
  description: string;
  note: string;
  size: string;
  quantity: number;
  stockQuantity: number;
  productName: string;
  grade: string;
  price: number;
  sliverPrice: number;
  imageUrls: string[];
  length: number;
  width: number;
  height: number;
  specification: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}

export type ProductApiResponse = ApiResponse<ProductRes>;
export type ProductListApiResponse = ApiResponse<ProductRes[]>;
export type DetailApiResponse = ApiResponse<DetailRes>;
export type DetailListApiResponse = ApiResponse<DetailRes[]>;