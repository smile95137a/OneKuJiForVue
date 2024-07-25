import axios from 'axios';

// 定义 API 基础 URL
const API_BASE_URL = 'http://localhost:8080/api';

// 定义登录函数
export async function login(username: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error('登录失败');
  }
}

// 定义获取当前用户信息函数
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${API_BASE_URL}/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('获取用户信息失败');
  }
}
