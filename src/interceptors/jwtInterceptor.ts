import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://a153-2402-7500-4ce-3589-a97b-f3fb-d6ec-8d49.ngrok-free.app/api', // 确保与后端地址一致
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
