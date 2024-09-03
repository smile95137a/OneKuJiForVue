// api.ts
import { User } from '@/interfaces/auth';
import { Member } from '@/interfaces/Member';
import axios, { AxiosResponse } from 'axios';
// 创建一个 axios 实例
const apiClient = axios.create({

  // baseURL: 'http://localhost:8080/api',
  baseURL: 'http://46.51.232.156:8080/api',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
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

export const getUsers = (): Promise<AxiosResponse<Member[]>> => {
  return apiClient.get('/user/query');
};

export const loginJwt = axios.create({
   baseURL: 'http://46.51.232.156:8080/api', // 确保与后端地址一致
  //baseURL: 'https://6ce2-2402-7500-4dc-948-7df7-96b-239b-ae80.ngrok-free.app/api', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json', 'ngrok-skip-browser-warning':true
  }
});

// 确保 setAuthToken 可以处理 null，更新函数定义
export function setAuthToken(token: string | null) {
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

export const addDetail = (data:any) => {
  return apiClient.post('/productDetail/add', data);
};

export const getProducts = () => {
  return apiClient.get('/product/query');
};

export const updateDtail = (data:any) => {
  return apiClient.put(`/productDetail/${data}`);
};

export const deleteDetail = (data : any) => {
  return apiClient.delete(`/productDetail/${data}`);
}

export const getProductByType = (data:any) => {
  return apiClient.post('/product/type' , data , {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getAllOrder = () => {
  return apiClient.get('/order/query');
}

export const getProduct = () => {
  return apiClient.get('/product/query');
}

export const deleteProduct = (data : any) => {
  return apiClient.delete(`/product/${data}`)
}

export const getOrderDetailsByOrderId = (data : any) => {
  return apiClient.get(`/orderDetails/${data}`);
}

export const getProductByOneKuJiType = (data : any) => {
  return apiClient.post(`/product/OneKuJi/type`, data);
}

export default apiClient;

