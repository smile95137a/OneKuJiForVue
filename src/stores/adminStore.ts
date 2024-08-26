import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  adminLogin,
  adminLogout,
  getAdminToken,
} from '@/services/backend/AdminAuthService';
import { loadState, saveState, removeState } from '@/utils/Localstorage';

export const useAdminStore = defineStore('adminStore', () => {
  // 从 localStorage 加载初始状态
  const storedIsLoggedIn = loadState<boolean>('adminIsLoggedIn');
  const storedAdminInfo = loadState<any>('adminInfo');

  const isLoggedIn = ref<boolean>(storedIsLoggedIn || false);
  const adminInfo = ref<any>(storedAdminInfo || null);

  const setAdmin = (adminData: any) => {
    adminInfo.value = adminData;
    isLoggedIn.value = true;
    saveState('adminInfo', adminData);
    saveState('adminIsLoggedIn', true);
  };

  const clearAdmin = () => {
    adminInfo.value = null;
    isLoggedIn.value = false;
    removeState('adminInfo');
    removeState('adminIsLoggedIn');
  };

  const checkAdminAuthStatus = () => {
    const token = getAdminToken();
    if (token) {
      isLoggedIn.value = true;
      // 如果需要，可以在这里加载更多的管理员信息并设置 adminInfo
    } else {
      clearAdmin();
    }
  };

  const loginAdminAction = async (credentials: any) => {
    try {
      const response = await adminLogin(credentials);
      setAdmin(response.data);
    } catch (error) {
      clearAdmin();
      throw error;
    }
  };

  const logoutAdminAction = async () => {
    await adminLogout();
    clearAdmin();
  };

  return {
    isLoggedIn,
    adminInfo,
    setAdmin,
    clearAdmin,
    checkAdminAuthStatus,
    loginAdminAction,
    logoutAdminAction,
  };
});
