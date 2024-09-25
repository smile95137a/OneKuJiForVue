import { ApiResponse } from '@/interfaces/admin';
import { StoreProductRes } from '@/interfaces/store';

export interface StoreProductRecommendation {
  id: number;
  recommendationName: string;
  products: number[]; // 存储产品 ID
  createdDate: string;
  updatedDate: string;
  createdUser: string;
  updatedUser: string;
}

export type StoreProductRecommendationApiResponse = ApiResponse<StoreProductRecommendation>;
export type StoreProductRecommendationListApiResponse = ApiResponse<StoreProductRecommendation[]>;