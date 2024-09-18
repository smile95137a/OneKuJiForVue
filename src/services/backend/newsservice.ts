import axios from 'axios';
import { News } from '@/interfaces/news';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const NewsService = {
  // 創建新聞，接收 FormData
  createNews: async (formData: FormData): Promise<News> => {
    try {
      const response = await axiosInstance.post<{ data: News }>('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('createNews response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in createNews:', error);
      throw error;
    }
  },

  // 更新新聞，接收 FormData
  updateNews: async (newsUid: string, formData: FormData): Promise<News> => {
    try {
      const response = await axiosInstance.put<{ data: News }>(`/news/${newsUid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('updateNews response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in updateNews:', error);
      throw error;
    }
  },

  // 獲取所有新聞
  getAllNews: async (): Promise<News[]> => {
    try {
      const response = await axiosInstance.get<{ data: News[] }>('/news');
      console.log('getAllNews response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in getAllNews:', error);
      throw error;
    }
  },

  // 根據 ID 獲取單條新聞
  getNewsById: async (newsUid: string): Promise<News> => {
    try {
      const response = await axiosInstance.get<{ data: News }>(`/news/${newsUid}`);
      console.log('getNewsById response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in getNewsById:', error);
      throw error;
    }
  },

  // 刪除新聞
  deleteNews: async (newsUid: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/news/${newsUid}`);
      console.log('News deleted successfully');
    } catch (error) {
      console.error('Error in deleteNews:', error);
      throw error;
    }
  },

  // 獲取圖片 URL
  getImageUrl: (imagePath: string): string => {
    return `${API_IMAGE_URL}/img${imagePath}`;
  },
};
