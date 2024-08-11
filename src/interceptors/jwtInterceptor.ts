import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://localhost:8081', // 确保与后端地址一致
  baseURL: 'https://3574-2402-7500-4dc-948-7df7-96b-239b-ae80.ngrok-free.app', // 确保与后端地址一致
  headers: {
    'Content-Type': 'application/json', 'ngrok-skip-browser-warning':true
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log(213123 , token);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;
