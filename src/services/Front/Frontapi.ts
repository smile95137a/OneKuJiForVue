import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true
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
      // 可以在這裡添加重定向到登錄頁面的邏輯
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
  userId?: number; // 將 userId 設為可選
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
    console.log(`Sending ${method.toUpperCase()} request to ${url}`);
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios(config); // 使用 axios 而不是 api 實例
    console.log(`Response received from ${url}:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error in public API request to ${url}:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      });
    } else {
      console.error(`Unexpected error in public API request to ${url}:`, error);
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
    console.log(`Sending ${method.toUpperCase()} request to ${url}`);
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
    };
    
    const response = await api(config);
    console.log(`Response received from ${url}:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error in public API request to ${url}:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      });
    } else {
      console.error(`Unexpected error in public API request to ${url}:`, error);
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
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const queryUsers = async (): Promise<User[]> => {
  try {
    const response: AxiosResponse<User[]> = await api.get('/user/query');
    return response.data;
  } catch (error) {
    console.error('Error querying users:', error);
    throw error;
  }
};

export const getProductDetail = async (productDetailId: number): Promise<ProductDetail> => {
  try {
    const response: AxiosResponse<ProductDetail> = await api.get(`/productDetail/${productDetailId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    throw error;
  }
};

export const queryProductDetails = async (): Promise<ProductDetail[]> => {
  try {
    const response: AxiosResponse<ProductDetail[]> = await api.get('/productDetail/query');
    return response.data;
  } catch (error) {
    console.error('Error querying product details:', error);
    throw error;
  }
};

export const getProduct = async (productId: number): Promise<Product> => {
  try {
    const response: AxiosResponse<Product> = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const queryProducts = async (): Promise<Product[]> => {
  return publicApiRequest<Product[]>('/product/query');
};

export const drawOnePrize = async (userId: number, productId: number, data: DrawOnePrizeRequest): Promise<DrawOnePrizeResponse> => {
  try {
    const response: AxiosResponse<DrawOnePrizeResponse> = await api.put(`/draw/oneprize?userId=${userId}&productId=${productId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error in drawOnePrize:', error);
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('Sending login request:', data);
    const response = await api.post<LoginResponse>('/auth/login', data);
    console.log('Login response:', response.data);
    if (response.data.accessToken) {
      setJwtToken(response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response);
      console.error('Request:', error.request);
    }
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<any> => {
  try {
    console.log('Sending register request:', data);
    const response = await publicApiRequestWithoutAuth<any>('/auth/register', 'post', data);
    console.log('Register response:', response);
    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const logout = () => {
  removeJwtToken();
  // 可以在這裡添加其他登出邏輯，如重定向到登錄頁面
};

export default api;