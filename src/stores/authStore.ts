import { loadState, saveState, removeState } from '@/utils/Localstorage';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadState<any>('fuser') || null);
  const token = ref<string | null>(loadState<string>('ftoken') || null);

  const isLogin = computed(() => !!token.value);

  const setUser = (userData: any) => {
    user.value = userData;
    saveState('fuser', userData);
  };

  const setToken = (accessToken: string) => {
    token.value = accessToken;
    saveState('ftoken', accessToken);
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    removeState('fuser');
    removeState('ftoken');
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
