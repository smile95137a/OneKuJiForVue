<!-- FrontLogin.vue -->
<template>
  <div class="login-container">
    <h1>用戶登入</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">{{ loginType === 'phone' ? '手機號碼' : '電子郵箱' }}</label>
        <input 
          type="text" 
          id="username" 
          v-model="formData.username" 
          :placeholder="loginType === 'phone' ? '請輸入手機號碼' : '請輸入電子郵箱'"
          required 
        />
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="formData.password" placeholder="請輸入密碼" required />
      </div>
      <div class="login-type">
        <span 
          :class="{ active: loginType === 'phone' }" 
          @click="switchLoginType('phone')"
        >
          手機登入
        </span>
        <span 
          :class="{ active: loginType === 'email' }" 
          @click="switchLoginType('email')"
        >
          郵箱登入
        </span>
      </div>
      <button type="submit" class="login-btn" :disabled="isLoading">
        {{ isLoading ? '登入中...' : '登入' }}
      </button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { login } from '@/services/Front/Frontapi';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'FrontLogin',
  setup() {
    const formData = reactive({
      username: '',
      password: '',
    });
    const loginType = ref('phone');
    const error = ref('');
    const isLoading = ref(false);
    const router = useRouter();

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
        console.log('登入成功:', response);
        // 儲存 token 到 localStorage
        localStorage.setItem('token', response.accessToken);
        // 導航到首頁或其他受保護的路由
        router.push('/');
      } catch (err) {
        console.error('登入失敗:', err);
        error.value = '登入失敗，請檢查您的帳號和密碼';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      loginType,
      error,
      isLoading,
      switchLoginType,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.login-type {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.login-type span {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-type span.active {
  background-color: #007bff;
  color: #fff;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>