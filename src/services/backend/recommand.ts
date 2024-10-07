import { ApiResponse } from '@/interfaces/product';
import { ProductRecommendationMapping, StoreProductRecommendation } from '@/interfaces/recommand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_BASE_URL = `${API_URL}/recommendation-mapping`;
const API_BASE_URL2 = `${API_URL}/recommendation`;

export const getAllMappings = async (): Promise<ApiResponse<ProductRecommendationMapping[]>> => {
    try {
        const response = await axios.get<ApiResponse<ProductRecommendationMapping[]>>(`${API_BASE_URL}/all`);
        return response.data;
    } catch (error: any) {
        console.error('獲取所有映射失敗:', error);
        throw new Error(error.response?.data?.message || '無法獲取推薦關聯');
    }
};

export const getMappingById = async (id: number): Promise<ApiResponse<ProductRecommendationMapping>> => {
    try {
        const response = await axios.get<ApiResponse<ProductRecommendationMapping>>(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('獲取映射失敗:', error);
        throw new Error(error.response?.data?.message || '推薦關聯未找到');
    }
};

export const createMapping = async (mapping: Omit<ProductRecommendationMapping, 'id'>): Promise<ApiResponse<ProductRecommendationMapping>> => {
    try {
        const response = await axios.post<ApiResponse<ProductRecommendationMapping>>(API_BASE_URL, mapping);
        return response.data;
    } catch (error: any) {
        console.error('創建映射失敗:', error);
        throw new Error(error.response?.data?.message || '創建推薦關聯失敗');
    }
};

export const updateMapping = async (id: number, mapping: Partial<ProductRecommendationMapping>): Promise<ApiResponse<ProductRecommendationMapping>> => {
    try {
        const response = await axios.put<ApiResponse<ProductRecommendationMapping>>(`${API_BASE_URL}/${id}`, mapping);
        return response.data;
    } catch (error: any) {
        console.error('更新映射失敗:', error);
        throw new Error(error.response?.data?.message || '更新推薦關聯失敗');
    }
};

export const deleteMapping = async (id: number): Promise<ApiResponse<void>> => {
    try {
        const response = await axios.delete<ApiResponse<void>>(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('刪除映射失敗:', error);
        throw new Error(error.response?.data?.message || '刪除推薦關聯失敗');
    }
};

export const getAllRecommendations = async (): Promise<ApiResponse<StoreProductRecommendation[]>> => {
    try {
        const response = await axios.get<ApiResponse<StoreProductRecommendation[]>>(`${API_BASE_URL2}/all`);
        return response.data;
    } catch (error: any) {
        console.error('獲取所有推薦失敗:', error);
        throw new Error(error.response?.data?.message || '無法獲取推薦');
    }
};