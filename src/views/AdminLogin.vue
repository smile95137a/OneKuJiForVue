<template>
  <div class="admin-login">
    <div class="login-container">
      <h1>管理系統登入</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">帳號</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">登入</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/auth';  // 导入 login 方法

export default defineComponent({
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const loginUser = async () => {
      try {
        const response = await login(username.value, password.value);
        // 假设服务器返回一个 token
        localStorage.setItem('token', response.token);
        console.log('登入成功');
        router.push('/admin-dashboard');
      } catch (error) {
        console.log('登入失敗');
        alert('使用者帳號或密碼錯誤');
      }
    };

    return { username, password, login: loginUser };
  }
});
</script>

<style scoped>
.admin-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
}

.login-container {
  background: white;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

h1 {
  margin-bottom: 1.5em;
  font-size: 1.8em;
  color: #333;
}

.form-group {
  margin-bottom: 1.5em;
}

label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
  color: #555;
}

input {
  width: calc(100% - 2em);
  padding: 0.5em 1em;
  margin-bottom: 0.5em;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button {
  width: 100%;
  padding: 0.7em;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
