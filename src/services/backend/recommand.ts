import { ApiResponse } from '@/interfaces/product';
import {
  ProductRecommendationMapping,
  StoreProductRecommendation,
} from '@/interfaces/recommand';
import axios from 'axios';
import { getAuthToken } from './adminservices';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_MAPPING_URL = `${API_URL}/recommendation-mapping`;
const API_RECOMMENDATION_URL = `${API_URL}/recommendation`;

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Fetch all mappings
export const getAllMappings = async (): Promise<
  ApiResponse<ProductRecommendationMapping[]>
> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ProductRecommendationMapping[]>
    >(`${API_MAPPING_URL}/all`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch all mappings:', error);
    throw new Error(
      error.response?.data?.message ||
        'Unable to fetch recommendation mappings.'
    );
  }
};

// Fetch a mapping by ID
export const getMappingById = async (
  id: number
): Promise<ApiResponse<ProductRecommendationMapping>> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ProductRecommendationMapping>
    >(`${API_MAPPING_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch mapping by ID:', error);
    throw new Error(error.response?.data?.message || 'Mapping not found.');
  }
};

// Create a new mapping
export const createMapping = async (
  mapping: Omit<ProductRecommendationMapping, 'id'>
): Promise<ApiResponse<ProductRecommendationMapping>> => {
  try {
    const response = await axiosInstance.post<
      ApiResponse<ProductRecommendationMapping>
    >(API_MAPPING_URL, mapping);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create mapping:', error);
    throw new Error(
      error.response?.data?.message ||
        'Failed to create recommendation mapping.'
    );
  }
};

// Update a mapping
export const updateMapping = async (
  id: number,
  mapping: Partial<ProductRecommendationMapping>
): Promise<ApiResponse<ProductRecommendationMapping>> => {
  try {
    const response = await axiosInstance.put<
      ApiResponse<ProductRecommendationMapping>
    >(`${API_MAPPING_URL}/${id}`, mapping);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update mapping:', error);
    throw new Error(
      error.response?.data?.message ||
        'Failed to update recommendation mapping.'
    );
  }
};

// Delete a mapping
export const deleteMapping = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `${API_MAPPING_URL}/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete mapping:', error);
    throw new Error(
      error.response?.data?.message ||
        'Failed to delete recommendation mapping.'
    );
  }
};

// Fetch all recommendations
export const getAllRecommendations = async (): Promise<
  ApiResponse<StoreProductRecommendation[]>
> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<StoreProductRecommendation[]>
    >(`${API_RECOMMENDATION_URL}/all`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch all recommendations:', error);
    throw new Error(
      error.response?.data?.message || 'Unable to fetch recommendations.'
    );
  }
};
