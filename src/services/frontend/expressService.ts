import { api } from './FrontAPI';

export const expressQuery = async (code: any, x: any) => {
  try {
    const response = await api.post('/express', { code, x });
    return response.data;
  } catch (error) {
    console.error('Error in expressQuery:', error);
    throw error;
  }
};
