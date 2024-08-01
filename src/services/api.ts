import { User } from '@/interfaces/auth';
import axios, { AxiosResponse } from 'axios';

// 创建一个 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json', 'ngrok-skip-browser-warning':true
    }
});

// 设置请求拦截器来添加 Authorization 头
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const addUser = (user: {
  username: string;
  password: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
}) => {
  return apiClient.post('/user/add', user);
};

export const getUsers = () => {
  return apiClient.get('/user/query');
};

export const loginJwt = axios.create({
  baseURL: 'https://a153-2402-7500-4ce-3589-a97b-f3fb-d6ec-8d49.ngrok-free.app/api', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json', 'ngrok-skip-browser-warning':true
  }
});

export function setAuthToken(token: string) {
  if (token) {
    loginJwt.defaults.headers.common['Authorization'] = token;
  } else {
    delete loginJwt.defaults.headers.common['Authorization'];
  }
}

export const getUserById = (userId: any) => {
  return apiClient.get(`/user/${userId}`);
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await apiClient.delete(`/user/${userId}`)
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (userData: any): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await apiClient.put('/user/'+userData.id, userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// export const addUser = async (userData: AddUserRequest): Promise<User> => {
//   try {
//     const response: AxiosResponse<User> = await apiClient.post('/user', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding user:', error);
//     throw error;
//   }
// };

export const getDetail = () => {
  const response = apiClient.get('/productDetail/query');
  return response;
};
export default apiClient;
