import axios from 'axios';
import { StoreProductRecommendation, StoreProductRecommendationApiResponse, StoreProductRecommendationListApiResponse } from '@/interfaces/recommend';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}/recommendation`;

export const recommendService = {
  getAllRecommendations: async (): Promise<StoreProductRecommendationListApiResponse> => {
    const response = await axios.get<StoreProductRecommendationListApiResponse>(`${API_URL}/all`);
    return response.data;
  },

  updateRecommendation: async (id: number, recommendation: Partial<StoreProductRecommendation>): Promise<StoreProductRecommendationApiResponse> => {
    const response = await axios.put<StoreProductRecommendationApiResponse>(`${API_URL}/${id}`, recommendation);
    return response.data;
  }
};