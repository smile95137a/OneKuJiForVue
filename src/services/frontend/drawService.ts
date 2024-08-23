import { api } from './FrontAPI';

export interface DrawRequest {
  userId: number;
  prizeNumber: number;
  productId: number;
}

export interface DrawResult {
  drawId: number;
  userId: number;
  productId: number;
  prizeNumber: number;
  drawDate: string;
  success: boolean;
  message: string;
}

export interface PrizeNumber {
  prizeNumberId: number;
  productDetailId: number;
  productId: number;
  number: number;
  isDrawn: boolean;
}

const basePath = '/draw';

// 抽獎
export const drawPrize = async (
  userId: number,
  drawRequests: any,
  productId: number
): Promise<DrawResult> => {
  try {
    const response = await api.post(`${basePath}/oneprize`, drawRequests, {
      params: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error executing prize draw:', error);
    throw error;
  }
};

// 獲取抽獎狀態
export const getDrawStatus = async (
  productId: number
): Promise<PrizeNumber[]> => {
  try {
    const response = await api.get(`${basePath}/status/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching draw status:', error);
    throw error;
  }
};

// 執行抽獎
export const executeDraw = async (
  productId: number,
  userId: number,
  prizeNumber: number
): Promise<DrawResult> => {
  try {
    const response = await api.post(`${basePath}/execute/${productId}`, null, {
      params: { userId, prizeNumber },
    });
    return response.data;
  } catch (error) {
    console.error('Error executing draw:', error);
    throw error;
  }
};

// 執行隨機抽獎
export const executeRandomDraw = async (
  productId: number,
  userId: number
): Promise<DrawResult> => {
  try {
    const response = await api.post(`${basePath}/random/${productId}`, null, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error executing random draw:', error);
    throw error;
  }
};
