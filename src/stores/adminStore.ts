import { defineStore } from 'pinia';
import { JWTAuthResponse, User } from '@/interfaces/admin';
import { setAuthToken, getAuthToken, removeAuthToken } from '@/services/backend/adminservices';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: getAuthToken(),
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(authData: JWTAuthResponse) {
      this.token = authData.accessToken;
      this.user = authData.user;
      setAuthToken(authData.accessToken);
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      removeAuthToken();
    },
  },
});