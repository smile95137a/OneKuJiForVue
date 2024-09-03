import axios, { AxiosRequestConfig } from 'axios';
import { User, UserReq, ApiResponse } from '@/interfaces/user';

const baseURL = import.meta.env.VITE_BASE_API_URL2;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function apiCall<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const userService = {
  getAllUsers: () => apiCall<User[]>({ 
    method: 'GET', 
    url: '/user/query' 
  }),

  getUserById: (userId: number) => apiCall<User>({ 
    method: 'GET', 
    url: `/user/${userId}` 
  }),

  createUser: (userReq: UserReq) => apiCall<User>({ 
    method: 'POST', 
    url: '/user/create', 
    data: userReq 
  }),

  updateUser: (userId: number, userReq: UserReq) => apiCall<User>({ 
    method: 'PUT', 
    url: `/user/update/${userId}`, 
    data: userReq 
  }),

  deleteUser: (userId: number) => apiCall<void>({ 
    method: 'DELETE', 
    url: `/user/delete/${userId}` 
  }),
};