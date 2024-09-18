import axios from 'axios';
import { Order, OrderDetail } from '@/interfaces/order';

const API_URL = `${import.meta.env.VITE_BASE_API_URL2}`;

export const getAllOrder = async (): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${API_URL}/order/query`);
    return response.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}/order/${id}`);
    return response.data;
};

export const updateOrder = async (id: number, order: Partial<Order>): Promise<void> => {
    const updatedOrder = {
        ...order,
        // 狀態已經是英文，直接傳給後端
        status: order.status
    };
    console.log('Sending updated order:', updatedOrder); 
    await axios.put(`${API_URL}/order/${id}`, updatedOrder);
};

export const deleteOrder = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/order/${id}`);
};

export const getOrderDetailsByOrderId = async (orderId: number): Promise<OrderDetail[]> => {
    const response = await axios.get<OrderDetail[]>(`${API_URL}/orderDetails/${orderId}`);
    return response.data;
};
