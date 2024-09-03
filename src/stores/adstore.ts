import { loginJwt, setAuthToken } from '@/services/backend/api';
import { defineStore } from 'pinia';

interface AdminUser {
  username: string;
  id: number;
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isLoggedIn: false,
    token: null as string | null,
    adminUser: null as AdminUser | null,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await loginJwt.post('/auth/login', { username, password });
        if (response.data.data && response.data.data.accessToken) {
          this.token = response.data.data.accessToken;
          this.adminUser = response.data.data.user;
          this.isLoggedIn = true;
          
          if (this.token) {
            localStorage.setItem('adminToken', this.token);
          }

          if (this.adminUser) {
            localStorage.setItem('adminUsername', this.adminUser.username);
          }
          
          if (this.token) {
            setAuthToken(this.token);
          }
          
          return true; // 登入成功
        } else {
          console.error('Unexpected response structure:', response.data);
          throw new Error('Token is missing in the response');
        }
      } catch (error: unknown) {
        console.error('Admin login failed:', error);
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as any;
          if (axiosError.response) {
            console.error('Error response:', axiosError.response.data);
            console.error('Error status:', axiosError.response.status);
          }
        }
        this.logout();
        return false; // 登入失敗
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.token = null;
      this.adminUser = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      setAuthToken(null);
    },
    checkAuth() {
      const token = localStorage.getItem('adminToken');
      const username = localStorage.getItem('adminUsername');
      if (token && username) {
        this.token = token;
        this.adminUser = { username, id: 0 }; // 假設 id，實際應該從後端獲取
        this.isLoggedIn = true;
        setAuthToken(token);
      } else {
        this.logout();
      }
    }
  }
});