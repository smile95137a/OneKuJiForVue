<template>
  <Card customClass="mcard--login">
    <template #header>
      <MCardHeader title="重置密碼" />
    </template>
    <div class="login__container">
      <div class="login__main">
        <form class="login__form" @submit.prevent="onSubmit">
          <div class="login__form-inputs">
            <p class="login__text">新密碼</p>

            <input
              id="password"
              type="password"
              v-model="password"
              class="login__form-input"
              :class="{ 'login__form-input--error': errors.password }"
              placeholder="輸入新密碼"
            />

            <p class="login__text login__text--error">
              {{ errors.password }}
            </p>
          </div>
          <div class="login__form-inputs">
            <p class="login__text">確認密碼</p>

            <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              class="login__form-input"
              :class="{ 'restPwdForm__input--error': errors.confirmPassword }"
              placeholder="再次輸入新密碼"
            />

            <p class="login__text login__text--error">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <div class="login__btns">
            <button type="submit" class="login__btn">登入</button>
          </div>
        </form>
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
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
