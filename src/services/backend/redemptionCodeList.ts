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

export const generateRedemptionCode = async (productId: number, count: number): Promise<string> => {
  try {
    // 将 productId 和 count 作为请求的一部分
    const response = await axios.post<string>(
      `${API_URL}/redemption/generate/${productId}`,
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



export const fetchProducts = async (): Promise<string> => {
  try {
    // 添加请求体，传递 type 为 4
    const response = await axios.post<string>(`${API_URL}/product/type`, { type: "CUSTMER_PRIZE" });
    return response.data; // 返回后端的响应数据
  } catch (error) {
    console.error('無法獲取產品列表', error);
    throw error;
  }
};


export const redeemCode = async (productId: number): Promise<ApiResponse<any>> => {
  try {
    // 调用后端 API，将 productId 动态附加到 URL
    const response = await axios.post<ApiResponse<any>>(`${API_URL}/redemption/redeem/${productId}`);
    return response.data; // 返回后端 API 的响应数据
  } catch (error) {
    console.error('兌換商品失敗:', error);
    throw error;
  }
};




