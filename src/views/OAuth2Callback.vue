<template>
  <div>處理 OAuth2 回調中...</div>
</template>

<script setup lang="ts">
import { handleOAuth2Callback } from '@/services/front/Frontapi';
import { useUserStore } from '@/stores/userstore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (code && state) {
    try {
      // 解析並驗證 state
      const parsedState = JSON.parse(decodeURIComponent(state));
      if (!parsedState.nonce) {
        throw new Error('Invalid state');
      }

      const response = await handleOAuth2Callback(code);
      userStore.login(response.username, response.userId, response.accessToken);
      router.push(parsedState.redirect || '/home');
    } catch (error) {
      console.error('OAuth2 回調處理錯誤:', error);
      router.push('/login?error=oauth2_failed');
    }
  } else {
    router.push('/login?error=invalid_callback');
  }
});
</script>
