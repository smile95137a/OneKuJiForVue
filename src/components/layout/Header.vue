<script setup lang="ts">
import logoImg from '@/assets/image/logo1.png';
import { useAuthStore, useDialogStore, useSlidebarStore } from '@/stores';
import { useRouter } from 'vue-router';

const slidebarStore = useSlidebarStore();
const authStore = useAuthStore();
const router = useRouter();
const dialogStore = useDialogStore();

const handleLogout = () => {
  authStore.clearAuthData();
  router.push('/home');
};

const handleDailySignIn = async () => {
  dialogStore.openDaliyDialog({});
};
</script>

<template>
  <div class="header">
    <div class="header__main">
      <div class="header__menu" @click="slidebarStore.toggleSlidebar">
        <i class="fa-solid fa-bars"></i>
      </div>

      <button @click="handleDailySignIn">每日簽到</button>
      <router-link to="/home" class="header__logo">
        <img :src="logoImg" class="header__logo-img" alt="Logo" />
      </router-link>
      <div
        :class="['header__nav', { 'header__nav--open': slidebarStore.isOpen }]"
        @click="slidebarStore.closeSlidebar"
      >
        <div class="header__nav-items">
          <div class="header__nav-item header__nav-item--logo">
            <img :src="logoImg" class="header__logo-img" alt="Logo" />
          </div>
          <router-link
            class="header__nav-item"
            to="/ichiban"
            active-class="header__nav-item--active"
          >
            一番賞
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link
            class="header__nav-item"
            to="/blindox"
            active-class="header__nav-item--active"
          >
            盲盒
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link
            class="header__nav-item"
            to="/mall"
            active-class="header__nav-item--active"
          >
            商城
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link
            class="header__nav-item"
            to="/gacha"
            active-class="header__nav-item--active"
          >
            扭蛋抽獎
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link
            class="header__nav-item"
            to="/news"
            active-class="header__nav-item--active"
          >
            最新消息
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
          <router-link
            class="header__nav-item"
            to="/customized-draw"
            active-class="header__nav-item--active"
          >
            客製化抽獎
            <div class="header__nav-item-icon">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </router-link>
        </div>
      </div>
      <div class="header__btns">
        <template v-if="authStore.isLogin">
          <router-link
            class="header__btn header__btn--member"
            to="/member-center"
          >
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
