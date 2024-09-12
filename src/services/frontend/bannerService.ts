import { api } from './FrontAPI'; // 引入已定义的API模块

export interface Banner {
  bannerId: number; // 横幅ID
  bannerUid: string; // 横幅唯一标识符
  imageUrls: string[]; // 图片URL列表
  productId?: number; // 关联的产品ID（可选）
  status: BannerStatus; // 横幅状态
  createdAt: string; // 创建时间
  updatedAt?: string; // 更新时间（可选）
  productType: string;
}

// 枚举定义
export enum BannerStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

const basePath = '/banner';

export const getAllBanners = async (): Promise<ApiResponse<Banner[]>> => {
  try {
    const response = await api.get<ApiResponse<Banner[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};
