import { loginJwt } from '@/services/api';
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isLoggedIn: false,
    token: null as string | null,
    adminUser: null as { username: string } | null,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await loginJwt.post('/auth/login', { username, password });
        if (response.data.accessToken) {
          this.token = response.data.accessToken;
          this.adminUser = { username };
          this.isLoggedIn = true;
          // @ts-ignore
          localStorage.setItem('adminToken', this.token);
          localStorage.setItem('adminUsername', username);
          return true; // 登入成功
        } else {
          throw new Error('Token is missing in the response');
        }
      } catch (error) {
        console.error('Admin login failed:', error);
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
    },
    checkAuth() {
      const token = localStorage.getItem('adminToken');
      const username = localStorage.getItem('adminUsername');
      if (token && username) {
        this.token = token;
        this.adminUser = { username };
        this.isLoggedIn = true;
      } else {
        // 如果 token 或 username 不存在，確保登出狀態
        this.logout();
      }
    }
  }
});