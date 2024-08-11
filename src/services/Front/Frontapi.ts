import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export const api: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:8081',
  baseURL: 'https://3574-2402-7500-4dc-948-7df7-96b-239b-ae80.ngrok-free.app',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  },
});

// 用于在内存中存储 JWT 令牌
let jwtToken: string | null = null;
let userId: number | null = null;
let username: string | null = null;

// 设置 JWT 令牌
export const setAuthToken = (token: string | null) => {
  jwtToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// 获取 JWT 令牌
export const getAuthToken = (): string | null => {
  return jwtToken;
};

// 设置用户 ID
export const setUserId = (id: number | null) => {
  userId = id;
};

// 获取用户 ID
export const getUserId = (): number | null => {
  return userId;
};

// 设置用户名
export const setUsername = (name: string | null) => {
  username = name;
};

// 获取用户名
export const getUsername = (): string | null => {
  return username;
};

// 移除用户信息
export const removeUserInfo = () => {
  setAuthToken(null);
  setUserId(null);
  setUsername(null);
};

// 请求拦截器，添加 JWT 令牌到请求头
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

// 响应拦截器，处理 401 错误
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      removeUserInfo();
      // 可以在这里添加登出逻辑
    }
    return Promise.reject(error);
  }
);

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

// 通用的 API 请求函数
export const publicApiRequest = async <T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data?: any,
  withAuth: boolean = true
): Promise<T> => {
  try {
    console.log(`发送 ${method.toUpperCase()} 请求到 ${url}`);
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
    console.log(`从 ${url} 收到响应:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API 请求 ${url} 出错:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
      });
    } else {
      console.error(`API 请求 ${url} 发生意外错误:`, error);
    }
    throw error;
  }
};

// 登录函数
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('发起登录请求:', data);
    const response = await publicApiRequest<LoginResponse>('/auth/login', 'post', data, false);
    console.log('登录响应:', response);
    if (response && response.accessToken && response.userId && response.username) {
      setAuthToken(response.accessToken);
      setUserId(response.userId);
      setUsername(response.username);
      return response;
    } else {
      throw new Error('Invalid login response');
    }
  } catch (error) {
    console.error('登录过程中出错:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || '登录失败，请检查您的帐号密码。');
    } else {
      throw new Error('登录失败，请稍后再试。');
    }
  }
};

// 注册函数
export const register = async (data: RegisterRequest): Promise<any> => {
  return publicApiRequest<any>('/user/register', 'post', data, false);
};

// 获取用户信息
export const getUserInfo = async (userId: number): Promise<User> => {
  return publicApiRequest<User>(`/user/${userId}`, 'get');
};

// 查询产品
export const queryProducts = async (): Promise<Product[]> => {
  return publicApiRequest<Product[]>('/product/query', 'get');
};

// 获取产品详情
export const getProduct = async (productId: number): Promise<Product> => {
  return publicApiRequest<Product>(`/product/${productId}`, 'get');
};

// 使用 Google 登录
export const loginWithGoogle = () => {
  window.location.href = `${api.defaults.baseURL}/oauth2/authorization/google`;
};

// 处理 OAuth2 回调
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
