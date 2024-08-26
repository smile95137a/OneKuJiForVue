import { api } from './FrontAPI'; // 引入API實例

// 定義與後端 Order 模型對應的接口
export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  bonusPointsEarned: number;
  bonusPointsUsed: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string; // ISO 日期字符串
  updatedAt: string; // ISO 日期字符串
  paidAt?: string; // 可選的 ISO 日期字符串
  notes?: string;
}

const basePath = '/order';

export const getOrderById = async (
  userId: number
): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await api.get<ApiResponse<Order[]>>(
      `${basePath}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取訂單時發生錯誤:', error);
    throw error;
  }
};

export const ecpayCheckout = async (userId: number): Promise<string> => {
  try {
    const response = await api.post<string>('/ecpayCheckout', { userId });
    return response.data;
  } catch (error) {
    console.error('處理綠界支付請求時發生錯誤:', error);
    throw error;
  }
};

export const handleEcpayNotification = async (
  paymentData: Record<string, string>
): Promise<string> => {
  try {
    const response = await api.post<string>('/returnUrl', paymentData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('處理綠界支付通知時發生錯誤:', error);
    throw error;
  }
};
