<template>
  <div class="header">
    <div class="header__main">
      <div class="header__menu" @click="slidebarStore.toggleSlidebar">
        <i class="fa-solid fa-bars"></i>
      </div>
      <router-link to="/home" class="header__logo">
        <img :src="logoImg" class="header__logo-img" alt="Logo" />
      </router-link>
      <!-- Navigation Items -->
      <div :class="['header__nav', { 'header__nav--open': slidebarStore.isOpen }]" @click="slidebarStore.closeSlidebar">
        <!-- Nav Items here -->
      </div>
      <div class="header__btns">
        <template v-if="isLoggedIn">
          <router-link class="header__btn header__btn--member" to="/member-center">會員中心</router-link>
          <div class="header__btn header__btn--logout" @click="handleLogout">登出</div>
        </template>
        <template v-else>
          <router-link class="header__btn header__btn--login" to="/login">登入</router-link>
          <router-link class="header__btn header__btn--register" to="/register">註冊</router-link>
        </template>
      </div>
    </div>
    <div class="header__marquee">
      <p class="header__text">一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImg from '@/assets/image/logo1.png';
import { useSlidebarStore } from '@/stores';
import { useAdminStore } from '@/stores/adstore'; // 引入后台状态管理
import { useUserStore } from '@/stores/userstore';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const slidebarStore = useSlidebarStore();
const userStore = useUserStore();
const adminStore = useAdminStore(); // 后台状态存储
const router = useRouter();

// 根据路由判断是否处于后台
const isBackend = computed(() => router.currentRoute.value.path.startsWith('/admin'));

// 计算属性来决定是否已登录
const isLoggedIn = computed(() => isBackend.value ? adminStore.isLoggedIn : userStore.isLoggedIn);

const handleLogout = () => {
  if (isBackend.value) {
    adminStore.logout();
    router.push('/admin-login');
  } else {
    userStore.logout();
    router.push('/login');
  }
  localStorage.removeItem('token');
};

onMounted(() => {
  if (isBackend.value && !adminStore.isLoggedIn) {
    adminStore.logout(); // 如果是后台路由但状态不符，强制登出
  }
});
</script>

<style scoped>
/* 這裡保留原有的樣式 */
</style>
