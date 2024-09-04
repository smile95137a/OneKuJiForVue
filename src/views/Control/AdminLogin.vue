<template>
  <div class="login-container">
    <h2>Admin Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model.trim="loginForm.username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model.trim="loginForm.password" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? 'Logging in...' : 'Login' }}</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminServices } from '@/services/backend/adminservices';
import { useAdminStore } from '@/stores/adminStore';
import { LoginDto } from '@/interfaces/admin';

export default defineComponent({
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const adminStore = useAdminStore();

    const loginForm = reactive<LoginDto>({
      username: '',
      password: '',
    });

    const isLoading = ref(false);
    const errorMessage = ref('');

    const handleLogin = async () => {
      isLoading.value = true;
      errorMessage.value = '';

      try {
        const response = await adminServices.login(loginForm);
        console.log('Login response:', response);

        if (response.success && response.data) {
          adminStore.setAuth(response.data);
          console.log('Admin authenticated:', adminStore.isAuthenticated);
          router.push('/admin');
        } else {
          errorMessage.value = response.message || 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorMessage.value = 'An unexpected error occurred. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      loginForm,
      handleLogin,
      isLoading,
      errorMessage,
    };
  },
});
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>