import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
  }),
  actions: {
    login(username: string) {
      this.isLoggedIn = true;
      this.username = username;
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
    },
  },
});