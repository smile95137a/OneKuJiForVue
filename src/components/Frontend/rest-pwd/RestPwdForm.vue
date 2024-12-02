<template>
  <div class="restPwdForm">
    <div class="restPwdForm__header">
      <h1>重置密碼</h1>
      <p>請輸入新密碼以完成重置。</p>
    </div>
    <form @submit.prevent="onSubmit" class="restPwdForm__form">
      <div class="restPwdForm__field">
        <label for="password" class="restPwdForm__label">新密碼</label>
        <input
          id="password"
          type="password"
          v-model="password"
          class="restPwdForm__input"
          :class="{ 'restPwdForm__input--error': errors.password }"
          placeholder="輸入新密碼"
        />
        <p class="restPwdForm__error">{{ errors.password }}</p>
      </div>
      <div class="restPwdForm__field">
        <label for="confirmPassword" class="restPwdForm__label">確認密碼</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          class="restPwdForm__input"
          :class="{ 'restPwdForm__input--error': errors.confirmPassword }"
          placeholder="再次輸入新密碼"
        />
        <p class="restPwdForm__error">{{ errors.confirmPassword }}</p>
      </div>
      <div class="restPwdForm__actions">
        <button type="submit" class="restPwdForm__btn">提交</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDialogStore } from '@/stores';
import { resetPassword } from '@/services/frontend/passwordResetService';

const route = useRoute();
const router = useRouter();
const dialogStore = useDialogStore();

const password = ref('');
const confirmPassword = ref('');
const errors = ref({
  password: '',
  confirmPassword: '',
});

const validateForm = () => {
  let isValid = true;
  errors.value.password = '';
  errors.value.confirmPassword = '';

  if (!password.value) {
    errors.value.password = '請輸入新密碼';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = '密碼長度至少為 6 個字元';
    isValid = false;
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = '請輸入確認密碼';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = '密碼不一致';
    isValid = false;
  }

  return isValid;
};

const onSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const token = route.params.token as string;

  try {
    const response = await resetPassword(token, password.value);
    if (response.success) {
      await dialogStore.openInfoDialog({
        title: '成功',
        message: '密碼已成功重置，請使用新密碼登入。',
      });
      router.push('/login');
    } else {
      await dialogStore.openInfoDialog({
        title: '錯誤',
        message: response.message || '無法重置密碼，請稍後再試。',
      });
    }
  } catch (error: any) {
    console.error('Error resetting password:', error);
    await dialogStore.openInfoDialog({
      title: '系統錯誤',
      message: '發生未知錯誤，請稍後再試。',
    });
  }
};
</script>

<style scoped>
.restPwdForm {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.restPwdForm__header {
  margin-bottom: 20px;
}

.restPwdForm__header h1 {
  font-size: 24px;
  color: #333;
}

.restPwdForm__header p {
  font-size: 16px;
  color: #666;
}

.restPwdForm__form {
  display: flex;
  flex-direction: column;
}

.restPwdForm__field {
  margin-bottom: 20px;
  text-align: left;
}

.restPwdForm__label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.restPwdForm__input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.restPwdForm__input--error {
  border-color: red;
}

.restPwdForm__error {
  font-size: 12px;
  color: red;
  margin-top: 4px;
}

.restPwdForm__actions {
  margin-top: 20px;
}

.restPwdForm__btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.restPwdForm__btn:hover {
  background-color: #0056b3;
}
</style>
