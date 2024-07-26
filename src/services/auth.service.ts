import { useRouter } from 'vue-router';
import apiClient from './api';

export const login = (username: string, password: string) => {
  return apiClient.post('/api/auth/login', {
    username,
    password,
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  const router = useRouter();
  router.push('/admin-login');
};
