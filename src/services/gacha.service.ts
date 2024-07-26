import apiClient from './api';

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
