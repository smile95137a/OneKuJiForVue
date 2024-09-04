import axios from 'axios';
import { LoginDto, ApiResponse, JWTAuthResponse } from '@/interfaces/admin';
import { saveState, loadState, removeState } from '@/utils/Localstorage';

const API_URL = import.meta.env.VITE_BASE_API_URL2;

export const adminServices = {
  login: async (loginDto: LoginDto): Promise<ApiResponse<JWTAuthResponse>> => {
    try {
      const response = await axios.post<ApiResponse<JWTAuthResponse>>(`${API_URL}/auth/login`, loginDto);
      if (response.data.success && response.data.data) {
        saveState('admin_token', response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          code: error.response.status,
          message: error.response.statusText,
          data: null,
          success: false
        };
      }
      throw error;
    }
  }
};

export const setAuthToken = (token: string | null) => {
  saveState('admin_token', token);
};

export const getAuthToken = (): string | null => {
  return loadState<string>('admin_token') || null;
};

export const removeAuthToken = () => {
  removeState('admin_token');
};