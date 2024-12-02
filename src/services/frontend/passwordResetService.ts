import { api } from './FrontAPI';

const basePath = '/api/password';

/**
 * 請求生成密碼重置連結
 * @param email 使用者的電子郵件
 * @returns API 響應結果
 */
export const generateResetPasswordLink = async (
  email: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/genResetPwd`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating reset password link:', error);
    throw error;
  }
};

/**
 * 驗證密碼重置 Token
 * @param token 密碼重置的 Token
 * @returns API 響應結果
 */
export const verifyPasswordToken = async (
  token: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/verifyPasswordToken/${token}`
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying password token:', error);
    throw error;
  }
};

/**
 * 重置密碼
 * @param token 密碼重置的 Token
 * @param pwd 新的密碼
 * @returns API 響應結果
 */
export const resetPassword = async (
  token: string,
  pwd: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(
      `${basePath}/resetPassword`,
      { token, pwd }
    );
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
