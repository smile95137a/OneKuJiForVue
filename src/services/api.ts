import axios from 'axios';

// 创建一个 axios 实例
const apiClient = axios.create({
  baseURL: 'http://104.199.211.35:8080//api', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json'
  }
});

// 设置请求拦截器来添加 Authorization 头
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log(12323);
    
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
export const getUserById = (searchTerm: string) => {
  return apiClient.get(`/user/search`, { params: { term: searchTerm } });
};
//產品管理
export interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  soldQuantity: number;
  imageUrl: string;
  rarity: string;
  createDate: string;
  startDate: string;
  endDate: string;
  createdUser: string;
  updatedUser: string;
  updatedAt: string;
  productType: string;
  prizeCategory: string;
  status: string;
}

export const getProducts = async (productType: number): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>('/product/query', {
      params: { productType },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProductStatus = async (productId: number, status: number): Promise<void> => {
  try {
    await apiClient.put(`/product/${productId}/status`, { status });
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};
//
export const loginJwt = axios.create({
  baseURL: 'http://104.199.211.35:8080/api', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json'
  }
});

export function setAuthToken(token: string) {
  if (token) {
    loginJwt.defaults.headers.common['Authorization'] = token;
  } else {
    delete loginJwt.defaults.headers.common['Authorization'];
  }
}

export default apiClient;
