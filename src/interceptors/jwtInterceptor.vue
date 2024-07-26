<script>
import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // 后端服务器地址
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token; // 添加 token 到请求头
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default apiClient;
</script>