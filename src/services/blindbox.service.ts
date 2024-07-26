import apiClient from './api';

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
