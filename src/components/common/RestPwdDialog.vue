<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--restPwdDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <form class="restPwdDialog__form" @submit.prevent="onSubmit">
      <div class="restPwdDialog">
        <div class="restPwdDialog__header">
          <div class="restPwdDialog__logo">
            <img :src="logoImg" class="restPwdDialog__logo-img" />
          </div>
          <div class="restPwdDialog__close" @click="handleClose(false)">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>

        <div class="restPwdDialog__main">
          <div class="restPwdDialog__main-content">
            <div class="restPwdDialog__form-inputs">
              <p class="restPwdDialog__text">電子信箱</p>
              <input
                class="restPwdDialog__form-input"
                v-model="username"
                v-bind="usernameProps"
                :class="{ 'restPwdDialog__form-input--error': errors.username }"
              />
              <p class="restPwdDialog__text restPwdDialog__text--error">
                {{ errors.username }}
              </p>
            </div>
          </div>
          <div class="restPwdDialog__main-btns">
            <div
              class="restPwdDialog__main-btn restPwdDialog__main-btn--cancel"
              @click="handleClose(false)"
            >
              取消
            </div>
            <button
              class="restPwdDialog__main-btn restPwdDialog__main-btn--confirm"
              type="submit"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';
import logoImg from '@/assets/image/logo1.png';
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useDialogStore, useLoadingStore } from '@/stores';
import { generateResetPasswordLink } from '@/services/frontend/passwordResetService';

const dialogStore = useDialogStore();
const loadingStore = useLoadingStore();

const isOpen = computed(() => dialogStore.isRestPwdDialogOpen);
const customClass = computed(() => dialogStore.customClass);

const schema = yup.object({
  username: yup.string().required('電子信箱為必填'),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
  },
});

const [username, usernameProps] = defineField('username');

const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { success, data, message } = await generateResetPasswordLink(
      values.username
    );
    loadingStore.stopLoading();
    if (success) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '密碼重置連結已發送至您的信箱，請檢查收件匣。',
      });
    } else {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message,
      });
    }
    handleConfirm();
  } catch (error) {
    loadingStore.stopLoading();
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '系統問題，請稍後再嘗試。',
    });
  }
});

const handleClose = (result: boolean) => {
  dialogStore.closeRestPwdDialog(result);
};

const handleConfirm = () => {
  dialogStore.closeRestPwdDialog(true);
};
</script>

<style scoped></style>
