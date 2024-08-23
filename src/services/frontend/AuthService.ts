import { loadState, removeState, saveState } from '@/utils/Localstorage';
import { api } from './FrontAPI';

export interface JWTAuthResponse {
  accessToken: string;
  userId: string;
  username: string;
}

export interface ILoginUser {
  [key: string]: any;
}

const basePath = '/auth';

export const login = async (data: any): Promise<JWTAuthResponse> => {
  try {
    const response = await api.post(`${basePath}/login`, data);
    return response.data;
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }
};

export const setAuthToken = (token: string | null) => {
  saveState('jwtToken', token);
};

export const getAuthToken = (): string | null => {
  return loadState<string>('jwtToken') || null;
};

export const removeAuthToken = () => {
  removeState('jwtToken');
};
