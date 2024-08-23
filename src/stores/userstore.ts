import {
  getAuthToken,
  getUserId,
  getUsername,
  publicApiRequest,
  removeUserInfo,
  setAuthToken,
  setUserId,
  setUsername,
} from '@/services/front/Frontapi';
import { defineStore } from 'pinia';

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: getUserId(),
    username: getUsername() || '',
    isLoggedIn: !!getAuthToken(),
    userInfo: null as UserInfo | null,
  }),
  actions: {
    login(username: string, userId: number, token: string) {
      if (username && userId && token) {
        this.username = username;
        this.userId = userId;
        this.isLoggedIn = true;
        setAuthToken(token);
        setUserId(userId);
        setUsername(username);
      } else {
        console.error('Login failed: Invalid user data');
      }
    },
    logout() {
      this.username = '';
      this.userId = null;
      this.isLoggedIn = false;
      this.userInfo = null;
      removeUserInfo();
    },
    async fetchUserInfo() {
      try {
        if (this.userId) {
          const response = await publicApiRequest<UserInfo>(
            `/user/${this.userId}`,
            'get'
          );
          this.userInfo = response;
          return response;
        }
      } catch (error) {
        console.error('獲取用戶信息時出錯:', error);
        throw error;
      }
    },
    async updateUserInfo(updatedInfo: Partial<UserInfo>) {
      try {
        if (this.userId) {
          const response = await publicApiRequest<UserInfo>(
            `/user/${this.userId}`,
            'put',
            updatedInfo
          );
          this.userInfo = { ...this.userInfo, ...response };
          return response;
        }
      } catch (error) {
        console.error('更新用戶信息時出錯:', error);
        throw error;
      }
    },
  },
});
