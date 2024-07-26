import axios from 'axios';
import { useRouter } from 'vue-router';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const loginJwt = apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logout = () => {
  localStorage.removeItem('token');
  const router = useRouter();
  router.push('/admin-login');
};

// 獎品管理
export const getPrizeById = (prizeId: string) => {
  return apiClient.get(`/api/prize/${prizeId}`);
};

export const updatePrize = (prizeId: string, data: any) => {
  return apiClient.put(`/api/prize/${prizeId}`, data);
};

export const deletePrize = (prizeId: string) => {
  return apiClient.delete(`/api/prize/${prizeId}`);
};

export const addPrize = (data: any) => {
  return apiClient.post('/api/prize/add', data);
};

export const getAllPrizes = () => {
  return apiClient.get('/api/prize/query');
};

// 獎品詳情管理
export const getPrizeDetailById = (prizeDetailId: string) => {
  return apiClient.get(`/api/prizeDetail/${prizeDetailId}`);
};

export const updatePrizeDetail = (prizeDetailId: string, data: any) => {
  return apiClient.put(`/api/prizeDetail/${prizeDetailId}`, data);
};

export const deletePrizeDetail = (prizeDetailId: string) => {
  return apiClient.delete(`/api/prizeDetail/${prizeDetailId}`);
};

export const addPrizeDetail = (data: any) => {
  return apiClient.post('/api/prizeDetail/add', data);
};

export const getAllPrizeDetails = () => {
  return apiClient.get('/api/prizeDetail/query');
};

// 盲盒管理
export const getBlindBoxById = (blindBoxId: string) => {
  return apiClient.get(`/api/blindBox/${blindBoxId}`);
};

export const updateBlindBox = (blindBoxId: string, data: any) => {
  return apiClient.put(`/api/blindBox/${blindBoxId}`, data);
};

export const deleteBlindBox = (blindBoxId: string) => {
  return apiClient.delete(`/api/blindBox/${blindBoxId}`);
};

export const addBlindBox = (data: any) => {
  return apiClient.post('/api/blindBox/add', data);
};

export const getAllBlindBoxes = () => {
  return apiClient.get('/api/blindBox/query');
};

// 扭蛋管理
export const getGachaById = (gachaId: string) => {
  return apiClient.get(`/api/gacha/${gachaId}`);
};

export const updateGacha = (gachaId: string, data: any) => {
  return apiClient.put(`/api/gacha/${gachaId}`, data);
};

export const deleteGacha = (gachaId: string) => {
  return apiClient.delete(`/api/gacha/${gachaId}`);
};

export const addGacha = (data: any) => {
  return apiClient.post('/api/gacha/add', data);
};

export const getAllGachas = () => {
  return apiClient.get('/api/gacha/query');
};

// 使用者管理
export const getUserById = (userId: string) => {
  return apiClient.get(`/api/user/${userId}`);
};

export const updateUser = (userId: string, data: any) => {
  return apiClient.put(`/api/user/${userId}`, data);
};

export const deleteUser = (userId: string) => {
  return apiClient.delete(`/api/user/${userId}`);
};

export const addUser = (data: any) => {
  return apiClient.post('/api/user/add', data);
};

export const getAllUsers = () => {
  return apiClient.get('/api/user/query');
};


export default apiClient;
