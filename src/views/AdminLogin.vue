<template>
  <div class="login-container">
    <h1>後台登入</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">用戶名</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="login-btn">登入</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginJwt, setAuthToken } from '@/services/api'; // 確保路徑和文件名正確

export default defineComponent({
  name: 'AdminLogin',
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        const response = await loginJwt.post('/auth/login', {
          username: username.value,
          password: password.value
        });
        const token = response.data.accessToken;
        localStorage.setItem('token', token);
        setAuthToken(token); // 設置認證頭
        router.push('/admin');
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    return {
      username,
      password,
      login,
    };
  },
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

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

.login-btn:hover {
  background-color: #0056b3;
}
</style>
