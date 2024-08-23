import { api } from './FrontAPI';

export interface ApiResponse<T> {
  code: number;
  message: string | null;
  data: T;
}

export interface Order {
  orderId: number;
  userId: number;
  productId: number;
  quantity: number;
  price: number;
  status: string;
  createdAt: string;
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
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

export const ecpayCheckout = async (userId: number): Promise<string> => {
  try {
    const response = await api.post<string>('/ecpayCheckout', userId);
    return response.data;
  } catch (error) {
    console.error('Error initiating ecpay checkout:', error);
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
    console.error('Error handling ecpay notification:', error);
    throw error;
  }
};
