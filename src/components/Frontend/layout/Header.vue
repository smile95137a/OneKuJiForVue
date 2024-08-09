<template>
  <div class="header">
    <div class="header__main">
      <div class="header__menu" @click="slidebarStore.toggleSlidebar">
        <i class="fa-solid fa-bars"></i>
      </div>
      <router-link to="/home" class="header__logo">
        <img :src="logoImg" class="header__logo-img" />
      </router-link>
      <div
        :class="
          slidebarStore.isOpen ? 'header__nav header__nav--open' : 'header__nav'
        "
        @click="slidebarStore.closeSlidebar"
      >
        <div class="header__nav-items">
          <div class="header__nav-item header__nav-item--logo">
            <img :src="logoImg" class="header__logo-img" />
          </div>
          <router-link class="header__nav-item" to="/product">
            一番賞
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link class="header__nav-item" to="/product2">
            盲盒
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link class="header__nav-item" to="/product3">
            扭蛋抽獎
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
        </div>
      </div>
      <div class="header__btns">
        <template v-if="userStore.isLoggedIn">
          <router-link class="header__btn header__btn--member" to="/member-center">
            會員中心
          </router-link>
          <div class="header__btn header__btn--logout" @click="handleLogout">
            登出
          </div>
        </template>
        <template v-else>
          <router-link class="header__btn header__btn--login" to="/login">
            登入
          </router-link>
          <router-link class="header__btn header__btn--register" to="/register">
            註冊
          </router-link>
        </template>
      </div>
    </div>
    <div class="header__marquee">
      <p class="header__text">
        一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlidebarStore } from '@/stores';
import { useUserStore } from '@/stores/userstore';
import { useRouter } from 'vue-router';
import logoImg from '@/assets/image/logo1.png';

const slidebarStore = useSlidebarStore();
const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  localStorage.removeItem('token');
  router.push('/login');
};
</script>