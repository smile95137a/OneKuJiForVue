import axios from 'axios';
import { Banner, BannerReq, BannerApiResponse, BannerListApiResponse } from '@/interfaces/banner';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}/banner`;
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const bannerservice = {
  getAllBanners: async (): Promise<BannerListApiResponse> => {
    try {
      const response = await axiosInstance.get<BannerListApiResponse>('');
      console.log('getAllBanners 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('getAllBanners 錯誤:', error);
      throw error;
    }
  },

  createBanner: async (bannerData: BannerReq): Promise<BannerApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('bannerReq', JSON.stringify(bannerData));

      const response = await axiosInstance.post<BannerApiResponse>('', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('createBanner 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('createBanner 錯誤:', error);
      throw error;
    }
  },

  updateBanner: async (bannerUid: string, bannerData: BannerReq): Promise<BannerApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('bannerReq', JSON.stringify(bannerData));

      const response = await axiosInstance.put<BannerApiResponse>(`/${bannerUid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('updateBanner 響應:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateBanner 錯誤:', error);
      throw error;
    }
  },

  deleteBanner: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/${id}`);
      console.log('deleteBanner 成功');
    } catch (error) {
      console.error('deleteBanner 錯誤:', error);
      throw error;
    }
  },

  getImageUrl: (imagePath: string): string => {
    console.log(`生成圖片 URL: ${imagePath}`);
    return `${API_IMAGE_URL}/img${imagePath}`;
  },
};