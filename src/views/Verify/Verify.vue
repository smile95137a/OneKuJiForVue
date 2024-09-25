<template>
  <div class="verification">
    <h1>帳戶驗證</h1>
    <p v-if="message">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { verifyUser } from '@/services/frontend/verificationService';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const message = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const route = useRoute();
const token = route.params.token as string;

onMounted(async () => {
  if (token) {
    try {
      const response = await verifyUser(token);
      message.value = response.message; // 驗證成功，顯示後端返回的訊息
    } catch (error: any) {
      // 根據錯誤類型提供更具體的錯誤訊息
      if (error.response && error.response.status === 400) {
        errorMessage.value = '驗證失敗，請確認您的驗證連結是否正確。';
      } else if (error.response && error.response.status === 404) {
        errorMessage.value = '找不到此驗證令牌，請確認您的驗證連結。';
      } else if (error.response && error.response.status === 410) {
        errorMessage.value = '您的驗證令牌已過期，請重新請求新的驗證連結。';
      } else {
        errorMessage.value = '系統錯誤，請稍後再試。';
      }
    }
  } else {
    errorMessage.value = '無效的驗證令牌，請確認您的驗證連結。';
  }
});
</script>

<style scoped>
.verification {
  padding: 20px;
  text-align: center;
}

.error {
  color: red;
}
</style>
