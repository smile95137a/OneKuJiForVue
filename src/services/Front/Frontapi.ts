import { useUserStore } from '@/stores/userstore';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

const TOKEN_KEY = 'token';

export const setJwtToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getJwtToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeJwtToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

api.interceptors.request.use(
  (config) => {
    const token = getJwtToken();
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
      removeJwtToken();
    }
    return Promise.reject(error);
  }
);

// 接口定義
export interface User {
  id: number;
  username: string;
  password: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
  createDate: string;
  updateDate: string;
  roles: {
    id: number;
    name: string;
  }[];
  status: string;
}

export interface ProductDetail {
  productId: number;
  description: string;
  quantity: number;
  size: string;
  material: string;
  productDetailId: number;
  productName: string;
  grade: string;
  createDate: string;
  updateDate: string;
  image: string;
  secret: boolean;
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

export interface DrawOnePrizeRequest {
  productId: number;
  productDetailId: number;
  productType: string;
  drawFrom: string;
  amount: number;
  totalDrawCount: number;
  remainingDrawCount: number;
}

export interface DrawOnePrizeResponse {
  id: number;
  userId: number;
  productId: number;
  productDetailId: number;
  drawTime: string;
  status: string;
  amount: number;
  code: string;
  createDate: string;
  updateDate: string;
  totalDrawCount: number;
  remainingDrawCount: number;
}

export interface LoginRequest {
  username: string;
  password: string;
  userId?: number;
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

// 公開 API 請求函數（不含 Authorization 頭）
export const publicApiRequestWithoutAuth = async <T>(
  url: string,
  method: 'get' | 'post' = 'get',
  data?: any
): Promise<T> => {
  try {
    console.log(`發送 ${method.toUpperCase()} 請求到 ${url}`);
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await api(config);
    console.log(`從 ${url} 收到回應:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`公開 API 請求 ${url} 出錯:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      });
    } else {
      console.error(`公開 API 請求 ${url} 發生意外錯誤:`, error);
    }
    throw error;
  }
};

// 公開 API 請求函數（含 Authorization 頭）
export const publicApiRequest = async <T>(
  url: string,
  method: 'get' | 'post' = 'get',
  data?: any
): Promise<T> => {
  try {
    console.log(`發送 ${method.toUpperCase()} 請求到 ${url}`);
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
    };

    const response = await api(config);
    console.log(`從 ${url} 收到回應:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`公開 API 請求 ${url} 出錯:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      });
    } else {
      console.error(`公開 API 請求 ${url} 發生意外錯誤:`, error);
    }
    throw error;
  }
};

// API 函數
export const getUserInfo = async (userId: number): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('獲取用戶信息出錯:', error);
    throw error;
  }
};

export const queryUsers = async (): Promise<User[]> => {
  try {
    const response: AxiosResponse<User[]> = await api.get('/user/query');
    return response.data;
  } catch (error) {
    console.error('查詢用戶出錯:', error);
    throw error;
  }
};

export const getProductDetail = async (
  productDetailId: number
): Promise<ProductDetail> => {
  try {
    const response: AxiosResponse<ProductDetail> = await api.get(
      `/productDetail/${productDetailId}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品詳情出錯:', error);
    throw error;
  }
};

export const queryProductDetails = async (): Promise<ProductDetail[]> => {
  try {
    const response: AxiosResponse<ProductDetail[]> = await api.get(
      '/productDetail/query'
    );
    return response.data;
  } catch (error) {
    console.error('查詢產品詳情出錯:', error);
    throw error;
  }
};

export const getProduct = async (productId: number): Promise<Product> => {
  try {
    const response: AxiosResponse<Product> = await api.get(
      `/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('獲取產品出錯:', error);
    throw error;
  }
};

export const queryProducts = async (): Promise<Product[]> => {
  return publicApiRequest<Product[]>('/product/query');
};

export const drawOnePrize = async (
  userId: number,
  productId: number,
  data: DrawOnePrizeRequest
): Promise<DrawOnePrizeResponse> => {
  try {
    const response: AxiosResponse<DrawOnePrizeResponse> = await api.put(
      `/draw/oneprize?userId=${userId}&productId=${productId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('抽獎出錯:', error);
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('發送登入請求:', data);
    const response = await api.post<LoginResponse>('/auth/login', data);
    console.log('登入回應:', response.data);
    if (response.data.accessToken) {
      setJwtToken(response.data.accessToken);
      const userStore = useUserStore();
      userStore.login(response.data.username);
    }
    return response.data;
  } catch (error) {
    console.error('登入過程中出錯:', error);
    if (axios.isAxiosError(error)) {
      console.error('回應:', error.response);
      console.error('請求:', error.request);
    }
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<any> => {
  try {
    console.log('發送註冊請求:', data);
    const response = await publicApiRequestWithoutAuth<any>(
      '/user/register',
      'post',
      data
    );
    console.log('註冊回應:', response);
    return response;
  } catch (error) {
    console.error('註冊過程中出錯:', error);
    throw error;
  }
};

export const logout = () => {
  removeJwtToken();
};

export const loginWithGoogle = () => {
  window.location.href = `${api.defaults.baseURL}/oauth2/authorization/google`;
};

export const handleOAuth2Callback = async (
  accessToken: string,
  userId: string,
  username: string
): Promise<{ userId: string; username: string }> => {
  setJwtToken(accessToken);
  
  // 更新用戶存儲
  const userStore = useUserStore();
  userStore.login(username);
  
  return { userId, username };
};

export default api;