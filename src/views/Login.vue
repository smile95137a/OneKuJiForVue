<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import { login } from '@/services/Front/Frontapi';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginType = ref('phone'); // 'phone' or 'email'
const formData = reactive({
  username: '',
  password: '',
});
const error = ref('');
const isLoading = ref(false);

const switchLoginType = (type: 'phone' | 'email') => {
  loginType.value = type;
  formData.username = '';
};

const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    error.value = '請填寫所有欄位';
    return;
  }

  error.value = '';
  isLoading.value = true;

  try {
    const response = await login({
      username: formData.username,
      password: formData.password,
      userId: 0, // 假設後端不需要這個字段進行登錄
    });
    console.log('Login successful:', response);
    // 假設登錄成功後跳轉到首頁
    router.push('/');
  } catch (err) {
    console.error('Login failed:', err);
    error.value = '登錄失敗，請檢查您的帳號和密碼';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Card title="登入" customClass="mcard--login">
    <div class="login__container">
      <div class="login__main">
        <div class="login__tab">
          <div
            :class="['login__tab-btn', 'login__tab-btn--phone', { 'login__tab-btn--active': loginType === 'phone' }]"
            @click="switchLoginType('phone')"
          >
            手機
          </div>
          <div
            :class="['login__tab-btn', 'login__tab-btn--mail', { 'login__tab-btn--active': loginType === 'email' }]"
            @click="switchLoginType('email')"
          >
            信箱
          </div>
        </div>

        <div class="login__form grid">
          <div class="col-100 m-t-16">
            <p class="login__text">{{ loginType === 'phone' ? '手機號碼' : '電子郵箱' }}</p>
            <input
              type="text"
              class="login__form-input"
              v-model="formData.username"
              :placeholder="loginType === 'phone' ? '請輸入手機號碼' : '請輸入電子郵箱'"
            />
          </div>
          <div class="col-100 m-t-16">
            <p class="login__text">密碼</p>
            <input
              type="password"
              class="login__form-input"
              v-model="formData.password"
              placeholder="請輸入密碼"
            />
          </div>
        </div>

        <div class="login__forgot">
          <p class="login__text login__text--forgot">忘記密碼?</p>
        </div>

        <div v-if="error" class="login__error">
          {{ error }}
        </div>

        <div class="login__btns">
          <div
            class="login__btn"
            @click="handleLogin"
            :class="{ 'login__btn--disabled': isLoading }"
          >
            {{ isLoading ? '登入中...' : '登入' }}
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.login__error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.login__btn--disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>