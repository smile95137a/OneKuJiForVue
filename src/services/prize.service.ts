import apiClient from './api';

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
