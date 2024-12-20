import axios from 'axios';
import { getAuthToken } from './adminservices';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}`;

interface VendorOrderEntity {
  vendorOrder: string;
  orderNo: string;
  errorCode: string;
  errorMessage: string;
  express: string;
  status: string;
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

// Fetch all orders
export const getAllOrder = async (): Promise<VendorOrderEntity[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<VendorOrderEntity[]>>(
      '/vendorOrder/all'
    );
    return response.data.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('無法取得訂單資料', error);
    throw error;
  }
};

// Update an order
export const updateOrder = async (
  order: VendorOrderEntity
): Promise<VendorOrderEntity> => {
  try {
    const response = await axiosInstance.put<ApiResponse<VendorOrderEntity>>(
      `/vendorOrder/${order.vendorOrder}`,
      order
    );
    return response.data.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('無法更新訂單資料', error);
    throw error;
  }
};
