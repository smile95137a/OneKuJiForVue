import { api } from './FrontAPI';

const basePath = '/signIn';

export const getAllSignIns = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sign-in data:', error);
    throw error;
  }
};

export const spinWheelAPI = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(`${basePath}/draw`);
    return response.data;
  } catch (error) {
    console.error('Error spinning the wheel:', error);
    throw error;
  }
};
