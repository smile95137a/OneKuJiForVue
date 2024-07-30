import axios from 'axios';

// 创建一个 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json'
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
  baseURL: 'http://localhost:8080/api', // 确保与后端地址一致
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
