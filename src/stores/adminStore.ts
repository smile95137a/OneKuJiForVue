import { defineStore } from 'pinia';
import { JWTAuthResponse, User } from '@/interfaces/admin';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: localStorage.getItem('admin_token') || null as string | null,
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(authData: JWTAuthResponse) {
      this.token = authData.accessToken;
      this.user = authData.user;
      localStorage.setItem('admin_token', authData.accessToken);
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('admin_token');
    },
  },
});