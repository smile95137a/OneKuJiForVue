import {
  getAuthToken,
  publicApiRequest,
  removeUserInfo,
  setAuthToken
} from '@/services/Front/Frontapi';
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
    userId: null as number | null,
    username: '',
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
      } else {
        console.error('Login failed: Invalid user data');
        // 可以在这里触发一个错误通知
      }
    },
    logout() {
      this.username = '';
      this.userId = null;
      this.isLoggedIn = false;
      this.userInfo = null;
      removeUserInfo(); // 确保也会清除 API 中的 token
    },
    async fetchUserInfo() {
      try {
        if (this.userId) {
          const response = await publicApiRequest<UserInfo>(`/user/${this.userId}`, 'get');
          this.userInfo = response;
          return response;
        }
      } catch (error) {
        console.error('获取用户信息时出错:', error);
        throw error;
      }
    },
    async updateUserInfo(updatedInfo: Partial<UserInfo>) {
      try {
        if (this.userId) {
          const response = await publicApiRequest<UserInfo>(`/user/${this.userId}`, 'put', updatedInfo);
          this.userInfo = { ...this.userInfo, ...response };
          return response;
        }
      } catch (error) {
        console.error('更新用户信息时出错:', error);
        throw error;
      }
    },
  },
});
