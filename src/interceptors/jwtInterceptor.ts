import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 后端地址
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 添加 Bearer 前缀
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;
