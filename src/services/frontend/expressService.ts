import { api } from './FrontAPI';

export const expressQuery = async (code: any) => {
  console.log(code);

  try {
    const response = await api.post('/express', { code });
    return response.data;
  } catch (error) {
    console.error('Error in expressQuery:', error);
    throw error;
  }
};
