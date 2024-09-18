import axios from 'axios';
import { News } from '@/interfaces/news';

const API_URL = import.meta.env.VITE_BASE_API_URL2;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const NewsService = {
  getAllNews: async (): Promise<News[]> => {
    const response = await axiosInstance.get('/news');
    return response.data.data;
  },

  getNewsById: async (newsUid: string): Promise<News> => {
    const response = await axiosInstance.get(`/news/${newsUid}`);
    return response.data.data;
    /**
     * {
     *    status: number,
     *    message: string,
     *    data: News
     * }
     */
  },

  createNews: async (news: News, images: File[]): Promise<void> => {
    const formData = new FormData();
    formData.append('newsReq', JSON.stringify(news));
    images.forEach(image => formData.append('images', image));
    await axiosInstance.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateNews: async (newsUid: string, news: News, images: File[]): Promise<void> => {
    const formData = new FormData();
    formData.append('newsReq', JSON.stringify(news));
    images.forEach(image => formData.append('images', image));
    await axiosInstance.put(`/news/${newsUid}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteNews: async (newsUid: string): Promise<void> => {
    await axiosInstance.delete(`/news/${newsUid}`);
  },

  // 新增一个用于获取完整图片URL的方法
  getFullImageUrl: (imageUrl: string): string => {
    return `${API_IMAGE_URL}${imageUrl}`;
  }
};