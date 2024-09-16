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
  productName: string;
  description: string;
  price: number;
  sliverPrice: number;
  stockQuantity: number;
  imageUrls: string[];
  rarity?: string;
  startDate?: string;
  endDate?: string;
  productType: ProductType;
  prizeCategory: PrizeCategory;
  status: ProductStatus;
  bonusPrice: number;
  specification: string;
  length: number;
  width: number;
  height: number;
}

export interface ProductRes extends ProductReq {
  productId: number;
  createdAt: string;
  updatedAt: string;
  createdUser?: number;
  updateUser?: number;
  size: number;
  productDetails?: ProductDetailRes[];
}

export interface ProductDetailReq {
  productId: number;
  description: string;
  note: string;
  rarity: string;
  size: string;
  material: string;
  quantity: number;
  stockQuantity: number;
  productName: string;
  grade: string;
  price: number;
  sliverPrice: number;
  imageUrls: string[];
  prizeNumber?: string;
  drawnNumbers?: string;
  specification: string;
  length: number;
  width: number;
  height: number;
}

export interface ProductDetailRes extends ProductDetailReq {
  productDetailId: number;
  createDate: string;
  updateDate: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}

export type ProductApiResponse = ApiResponse<ProductRes>;
export type ProductListApiResponse = ApiResponse<ProductRes[]>;
export type ProductDetailApiResponse = ApiResponse<ProductDetailRes>;
export type ProductDetailListApiResponse = ApiResponse<ProductDetailRes[]>;