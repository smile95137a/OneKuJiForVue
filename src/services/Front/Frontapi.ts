import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'https://3574-2402-7500-4dc-948-7df7-96b-239b-ae80.ngrok-free.app',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('jwtToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('jwtToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('jwtToken');
};

export const setUserId = (id: number | null) => {
  if (id) {
    localStorage.setItem('userId', id.toString());
  } else {
    localStorage.removeItem('userId');
  }
};

export const getUserId = (): number | null => {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id, 10) : null;
};

export const setUsername = (name: string | null) => {
  if (name) {
    localStorage.setItem('username', name);
  } else {
    localStorage.removeItem('username');
  }
};

export const getUsername = (): string | null => {
  return localStorage.getItem('username');
};

export const removeUserInfo = () => {
  setAuthToken(null);
  setUserId(null);
  setUsername(null);
};

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      removeUserInfo();
    }
    return Promise.reject(error);
  }
);

export const getOrderById = async (userId: any) => {
  try {
    const response = await api.get(`/order/${userId}`);
    return response.data; // 返回订单数据
  } catch (error) {
    console.error('获取订单信息时出错:', error);
    if (error.response && error.response.status === 404) {
      throw new Error('订单未找到');
    }
    throw new Error('无法获取订单信息，请稍后再试');
  }
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: number;
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
  createDate: string;
  updateDate: string;
  roles: { id: number; name: string }[];
  status: string;
  balance: number;
  bonus: number;
}

export interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  soldQuantity: number;
  imageUrl: string;
  rarity: string;
  startDate: string;
  endDate: string;
  createDate: string;
  updateDate: string;
  createdUser: string;
  updatedUser: string;
  productType: string;
  prizeCategory: string;
  status: string;
}

export const publicApiRequest = async <T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data?: any,
  withAuth: boolean = true
): Promise<T> => {
  try {
    console.log(`發送 ${method.toUpperCase()} 請求到 ${url}`);
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
    };

    if (!withAuth) {
      config.headers = {
        'Content-Type': 'application/json',
      };
    }

    const response = await api(config);
    console.log(`從 ${url} 收到響應:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API 請求 ${url} 出錯:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      });
    } else {
      console.error(`API 請求 ${url} 發生意外錯誤:`, error);
    }
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('發起登錄請求:', data);
    const response = await publicApiRequest<LoginResponse>('/auth/login', 'post', data, false);
    console.log('登錄響應:', response);
    if (response && response.accessToken && response.userId && response.username) {
      setAuthToken(response.accessToken);
      setUserId(response.userId);
      setUsername(response.username);
      return response;
    } else {
      throw new Error('Invalid login response');
    }
  } catch (error) {
    console.error('登錄過程中出錯:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || '登錄失敗，請檢查您的帳號密碼。');
    } else {
      throw new Error('登錄失敗，請稍後再試。');
    }
  }
};

export const register = async (data: RegisterRequest): Promise<any> => {
  return publicApiRequest<any>('/user/register', 'post', data, false);
};

export const getUserInfo = async (userId: number): Promise<User> => {
  return publicApiRequest<User>(`/user/${userId}`, 'get');
};

export const queryProducts = async (): Promise<Product[]> => {
  return publicApiRequest<Product[]>('/product/query', 'get');
};

export const getProduct = async (productId: number): Promise<Product> => {
  return publicApiRequest<Product>(`/product/${productId}`, 'get');
};

export const loginWithGoogle = () => {
  window.location.href = `${api.defaults.baseURL}/oauth2/authorization/google`;
};

export const handleOAuth2Callback = async (
  accessToken: string,
  userId: string,
  username: string
): Promise<{ userId: number; username: string }> => {
  setAuthToken(accessToken);
  const userIdNumber = parseInt(userId, 10);
  setUserId(userIdNumber);
  setUsername(username);
  return { userId: userIdNumber, username };
};

export default api;