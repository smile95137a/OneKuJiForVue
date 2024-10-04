<script setup lang="ts">
import logoImg from '@/assets/image/logo1.png';
import { useAuthStore, useDialogStore, useSlidebarStore } from '@/stores';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const API_URL = import.meta.env.VITE_BASE_API_URL;

const slidebarStore = useSlidebarStore();
const authStore = useAuthStore();
const router = useRouter();
const dialogStore = useDialogStore();
const marqueeMessage = ref<string | null>(null);

// WebSocket 客戶端
let stompClient: Client | null = null;
let messageTimeout: NodeJS.Timeout | null = null;

const connectWebSocket = () => {
  const socket = new SockJS(`${API_URL}/ws`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      console.log('Connected to WebSocket');
      stompClient?.subscribe('/topic/lottery', (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          marqueeMessage.value = `玩家 ${data.nickName} 獲得了 ${data.name}`;

          if (messageTimeout) {
            clearTimeout(messageTimeout);
          }

          messageTimeout = setTimeout(() => {
            marqueeMessage.value = null;
          }, 20000);
        }
      });
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  stompClient.activate();
};

// 在組件掛載時連接 WebSocket
onMounted(() => {
  connectWebSocket();
});

// 組件卸載時關閉 WebSocket 連接
onBeforeUnmount(() => {
  if (stompClient) {
    stompClient.deactivate();
  }

  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }
});

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
            扭蛋
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
          <div class="header__btn header__btn--cart">
            <router-link class="cartBtn__main" to="/mall-checkout">
              <i class="fa-solid fa-cart-shopping"></i>
            </router-link>
          </div>
          <div
            class="header__btn header__btn--dailySignIn"
            @click="handleDailySignIn"
          >
            <i class="fa-solid fa-pen"></i>
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
    <div class="header__marquee" v-if="marqueeMessage">
      <p class="header__text">
        {{ marqueeMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
