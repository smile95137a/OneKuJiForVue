import apiClient from './api';

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
