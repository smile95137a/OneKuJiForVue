import { api } from './FrontAPI';

const basePath = '/aftee';

export const generateAfteePreRegister = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/genPreRegister`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error generating AFTEE pre-register payload:', error);
    throw error;
  }
};
