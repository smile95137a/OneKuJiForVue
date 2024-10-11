import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}`;

interface VendorOrderEntity {
    vendorOrder: string;
    orderNo: string;
    errorCode: string;
    errorMessage: string;
    express: string;
    status: string;
  }


export const getAllOrder = async (): Promise<VendorOrderEntity[]> => {
    try {
      const response = await axios.get<VendorOrderEntity[]>(`${API_URL}/vendorOrder/all`);
      return response.data.data; // 返回 API 响应的订单数据
    } catch (error) {
      console.error('無法取得訂單資料', error);
      throw error;
    }
  };

  export const updateOrder = async (order: VendorOrderEntity): Promise<VendorOrderEntity> => {
    try {
      const response = await axios.put<ApiResponse<VendorOrderEntity>>(
        `${API_URL}/vendorOrder/${order.vendorOrder}`, 
        order
      );
      return response.data.data; // 返回更新后的订单数据
    } catch (error) {
      console.error('無法更新訂單資料', error);
      throw error;
    }
  };