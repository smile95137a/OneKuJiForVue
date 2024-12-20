import { defineStore } from 'pinia';
import { JWTAuthResponse, User } from '@/interfaces/admin';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUser,
  getUser,
} from '@/services/backend/adminservices';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    token: getAuthToken(),
    user: getUser() as User | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(authData: JWTAuthResponse) {
      this.token = authData.accessToken;
      this.user = authData.user;
      setAuthToken(authData.accessToken);
      setUser(authData.user);
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      removeAuthToken();
    },
  },
});
