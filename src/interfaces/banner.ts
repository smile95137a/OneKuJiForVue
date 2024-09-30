// banner.ts
import { ProductType, ProductStatus, PrizeCategory } from '@/interfaces/product';

export interface Banner {
  bannerId: number;
  bannerUid: string;
  imageUrls: string[];
  productId: number;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
  productType: ProductType;
}

export enum BannerStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface BannerReq {
  bannerUid?: string;
  imageUrls: (string | File)[];
  productId: number;
  status: BannerStatus;
  productType: ProductType;
}

export interface BannerRes {
  bannerId: number;
  bannerUid: string;
  imageUrls: string[];
  productId: number;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
  productType: ProductType;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}

export type BannerApiResponse = ApiResponse<BannerRes>;
export type BannerListApiResponse = ApiResponse<BannerRes[]>;