import axios from 'axios';

// 使用環境變數中的 API URL
const API_URL = `${import.meta.env.VITE_BASE_API_URL2}`;

interface RedemptionCode {
  id: number;
  code: string;
  isRedeemed: boolean;
  redeemedAt: string | null;
  userId: number | null;
}

// 獲取所有兌換碼
export const getAllRedemptionCodes = async (): Promise<RedemptionCode[]> => {
  try {
    const response = await axios.post<RedemptionCode[]>(`${API_URL}/redemption/redeem`);
    return response.data; // 返回 API 響應的兌換碼數據
  } catch (error) {
    console.error('無法取得兌換碼資料', error);
    throw error;
  }
};

// 生成新的兌換碼
export const generateRedemptionCode = async (): Promise<string> => {
  try {
    const response = await axios.post<string>(`${API_URL}/redemption/generate`);
    return response.data; // 返回新生成的兌換碼
  } catch (error) {
    console.error('無法生成新的兌換碼', error);
    throw error;
  }
};
