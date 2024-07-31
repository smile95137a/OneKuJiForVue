import axios, { AxiosInstance, AxiosResponse } from 'axios';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: '104.199.211.35:8081/api', // 替换为您的API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token存储
let jwtToken: string | null = null;

// 设置JWT token的函数
export const setJwtToken = (token: string) => {
  jwtToken = token;
};

// 请求拦截器，添加JWT token到请求头
api.interceptors.request.use(
  (config) => {
    if (jwtToken) {
      config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 用户相关接口
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

// 抽奖相关接口
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

// 登录相关接口
export interface LoginRequest {
  username: string;
  password: string;
  userId: number;
}

export interface LoginResponse {
  accessToken: string;
  userId: number;
}

// 产品详情相关接口
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

// 产品相关接口
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

// API 函数
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
    setJwtToken(response.data.accessToken); // 设置JWT token
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
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
  try {
    const response: AxiosResponse<Product[]> = await api.get('/product/query');
    return response.data;
  } catch (error) {
    console.error('Error querying products:', error);
    throw error;
  }
};