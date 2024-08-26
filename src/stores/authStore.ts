import { loadState, saveState, removeState } from '@/utils/Localstorage';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadState<any>('user') || null);
  const token = ref<string | null>(loadState<string>('token') || null);

  const isLogin = computed(() => !!token.value);

  const setUser = (userData: any) => {
    user.value = userData;
    saveState('user', userData);
  };

  const setToken = (accessToken: string) => {
    token.value = accessToken;
    saveState('token', accessToken);
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    removeState('user');
    removeState('token');
  };

  return {
    user,
    token,
    isLogin,
    setUser,
    setToken,
    clearAuthData,
  };
});
