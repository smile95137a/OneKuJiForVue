import { api } from './FrontAPI';

export interface VerificationResponse {
  message: string;
}

const basePath = '/verify';

export const verifyUser = async (
  token: string
): Promise<VerificationResponse> => {
  try {
    const response = await api.get<VerificationResponse>(basePath, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error('Error during verification:', error);
    throw error;
  }
};
