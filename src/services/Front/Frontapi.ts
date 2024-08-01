import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'https://a153-2402-7500-4ce-3589-a97b-f3fb-d6ec-8d49.ngrok-free.app/api', // 替换为您的API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json', 'ngrok-skip-browser-warning':true
  },
});

const TOKEN_KEY = 'jwtToken';

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
  nickname: string;
  email: string;
  phoneNumber: string;
  status: string;
  createDate: string;
  updateDate: string;
}

export interface UserQueryResponse {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
  createDate: string;
  updateDate: string;
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
  userId: number;
}

export interface LoginResponse {
  accessToken: string;
  userId: number;
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

export const queryUsers = async (): Promise<UserQueryResponse[]> => {
  try {
    const response: AxiosResponse<UserQueryResponse[]> = await api.get('/user/query');
    return response.data;
  } catch (error) {
    console.error('Error querying users:', error);
    throw error;
  }
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
    const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', data);
    setJwtToken(response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  removeJwtToken();
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
  try {
    console.log('Sending request to:', '/product/query');
    console.log('Headers:', api.defaults.headers);
    const response: AxiosResponse<Product[]> = await api.get('/product/query');
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error querying products:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
    throw error;
  }
};

export const updateProductStatus = async (productId: number, status: number): Promise<void> => {
  try {
    await api.put(`/product/${productId}/status`, { status });
    console.log('Product status updated successfully');
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};

export interface AddUserRequest {
  username: string;
  email: string;
  // 其他必要字段...
}

export const addUser = async (userData: AddUserRequest): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.post('/user', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response: AxiosResponse<User[]> = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export default api;