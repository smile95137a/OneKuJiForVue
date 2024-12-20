import axios from 'axios';
import { getAuthToken } from './adminservices';

// 使用環境變數中的 API URL
const API_URL = `${import.meta.env.VITE_BASE_API_URL2}`;

interface RedemptionCode {
  id: number;
  code: string;
  isRedeemed: boolean;
  redeemedAt: string | null;
  userId: number | null;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
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

// 獲取所有兌換碼
export const getAllRedemptionCodes = async (): Promise<RedemptionCode[]> => {
  try {
    const response = await axiosInstance.post<RedemptionCode[]>(
      '/redemption/redeem'
    );
    return response.data; // 返回 API 響應的兌換碼數據
  } catch (error) {
    console.error('無法取得兌換碼資料', error);
    throw error;
  }
};

// 生成兌換碼
export const generateRedemptionCode = async (
  productId: number,
  count: number
): Promise<string> => {
  try {
    const response = await axiosInstance.post<string>(
      `/redemption/generate/${productId}`,
      null, // 如果请求体为空，可以使用 null
      {
        params: { count }, // 使用 params 传递 count 参数
      }
    );
    return response.data; // 返回新生成的兑换码
  } catch (error) {
    console.error('無法生成新的兌換碼', error);
    throw error;
  }
};

// 獲取產品列表
export const fetchProducts = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post<string>('/product/type', {
      type: 'CUSTMER_PRIZE',
    });
    return response.data; // 返回後端的響應數據
  } catch (error) {
    console.error('無法獲取產品列表', error);
    throw error;
  }
};

// 兌換商品
export const redeemCode = async (
  productId: number
): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<any>>(
      `/redemption/redeem/${productId}`
    );
    return response.data; // 返回後端 API 的響應數據
  } catch (error) {
    console.error('兌換商品失敗:', error);
    throw error;
  }
};
