<script setup lang="ts">
import logoImg from '@/assets/image/logo1.png';
import { getAllMarquees } from '@/services/frontend/marqueeService';
import { useAuthStore, useDialogStore, useSlidebarStore } from '@/stores';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
const API_URL = import.meta.env.VITE_BASE_API_URL;

const handleScroll = () => {
  const threshold = 100;
  isSticky.value = window.scrollY >= threshold;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const isSticky = ref(false);
const slidebarStore = useSlidebarStore();
const authStore = useAuthStore();
const router = useRouter();
const dialogStore = useDialogStore();
const marqueeMessage = ref<string | null>(null);
let marqueeInterval = null;

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
          processMarqueeData();
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

onMounted(async () => {
  connectWebSocket();
  await processMarqueeData(); // 調用主邏輯函式
  marqueeInterval = setInterval(() => {
    processMarqueeData();
  }, 20000);
});

onUnmounted(() => {
  clearInterval(marqueeInterval);
});

const processMarqueeData = async () => {
  try {
    const { success, data } = await getAllMarquees();
    if (success) {
      const currentTime = moment();

      // 處理公告資料
      const result = Object.keys(data).map((key) => {
        const processedGroup = data[key].map((marquee) => {
          const createDate = moment(marquee.createDate);
          const updatedDate = moment(createDate).add(20, 'seconds');
          const shouldDisplay = updatedDate.isAfter(currentTime);
          return {
            ...marquee,
            shouldDisplay,
          };
        });

        return processedGroup; // 不過濾，直接返回
      });

      // 過濾符合條件的分組
      const filteredGroup = result
        .filter((x) => x.length > 0 && x[0].shouldDisplay) // 確保分組有效
        .map((group) => {
          const { username } = group[0];
          const prizes = group.map(({ grade, name }) => `${grade}賞 ${name}`);
          return `${username}中獎 ${prizes.join(' 、 ')}`;
        });

      // 若沒有符合條件的，取最後一筆
      const lastGroup = result[result.length - 1];
      const fallbackMessage = lastGroup
        ? (() => {
            const { username } = lastGroup[0]; // 確保取到 username
            const prizes = lastGroup.map(
              ({ grade, name }) => `${grade}賞 ${name}`
            );
            return `${username}中獎 ${prizes.join(' 、 ')}`;
          })()
        : '';

      // 更新公告訊息
      marqueeMessage.value =
        filteredGroup.length > 0 ? filteredGroup.join(' 、 ') : fallbackMessage;
    } else {
      console.error('無法獲取公告或請求失敗');
    }
  } catch (error) {
    console.error('連接失敗:', error);
  }
};

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
    <div
      class="header__marquee"
      v-if="marqueeMessage"
      :class="{ 'header__marquee--sticky': isSticky }"
    >
      <p class="header__text">
        {{ marqueeMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
