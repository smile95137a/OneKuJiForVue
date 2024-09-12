import { api } from './FrontAPI';
export enum NewsStatus {
  AVAILABLE = 'AVAILABLE', // 上架
  UNAVAILABLE = 'UNAVAILABLE', // 下架
}

export const NewsStatusDescriptions: Record<NewsStatus, string> = {
  [NewsStatus.AVAILABLE]: '上架',
  [NewsStatus.UNAVAILABLE]: '下架',
};

export interface News {
  id: number; // 自增主键
  newsUid: string; // 新闻唯一标识符
  title: string; // 新闻标题
  preview?: string; // 新闻预览文字（可选）
  content: string; // 新闻详细内容
  imageUrls?: string[]; // 图片URL列表（可选）
  status: NewsStatus; // 新闻状态
  createdDate: string; // 创建时间
  updatedDate?: string; // 最后更新时间（可选）
  author?: string; // 作者信息（可选）
}

const basePath = '/news';

/**
 * 获取所有新闻
 */
export const getAllNews = async (): Promise<ApiResponse<News[]>> => {
  try {
    const response = await api.get<ApiResponse<News[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching news list:', error);
    throw error;
  }
};

/**
 * 根据 newsUid 获取单条新闻详情
 */
export const getNewsById = async (
  newsUid: string
): Promise<ApiResponse<News>> => {
  try {
    const response = await api.get<ApiResponse<News>>(`${basePath}/${newsUid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with id ${newsUid}:`, error);
    throw error;
  }
};
