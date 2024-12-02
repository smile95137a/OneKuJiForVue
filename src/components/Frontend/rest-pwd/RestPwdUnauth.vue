<template>
  <div class="restPwdUnauth">
    <div class="restPwdUnauth__logo"></div>
    <div class="restPwdUnauth__content">
      <h1 class="restPwdUnauth__title">{{ title }}</h1>
      <p class="restPwdUnauth__message">{{ message }}</p>
      <div class="restPwdUnauth__actions">
        <button class="restPwdUnauth__btn" @click="goBackToLogin">
          返回登入頁面
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  title: string;
  message: string;
}>();

const router = useRouter();

const goBackToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.restPwdUnauth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 16px;
}

.restPwdUnauth__logo {
  margin-bottom: 20px;
}

.restPwdUnauth__logo-img {
  max-width: 200px;
  height: auto;
}

.restPwdUnauth__content {
  text-align: center;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.restPwdUnauth__title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.restPwdUnauth__message {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.restPwdUnauth__actions {
  margin-top: 16px;
}

.restPwdUnauth__btn {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.restPwdUnauth__btn:hover {
  background-color: #0056b3;
}
</style>
