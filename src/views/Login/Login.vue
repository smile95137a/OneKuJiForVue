<template>
  <Card customClass="mcard--login">
    <template #header>
      <MCardHeader title="會員登入" />
    </template>
    <div class="login__container">
      <div class="login__main">
        <form class="login__form" @submit.prevent="onSubmit">
          <div class="login__auth">
            <div class="login__auth-btn" @click="handleOauthLogin('google')">
              <div class="login__auth-btn-icon">
                <i class="fa-brands fa-google"></i>
              </div>
              <div class="login__auth-btn-text">Google 帳號登入</div>
            </div>
            <div class="login__auth-btn" @click="handleOauthLogin('facebook')">
              <div class="login__auth-btn-icon">
                <i class="fa-brands fa-facebook-f"></i>
              </div>
              <div class="login__auth-btn-text">Facebook 帳號登入</div>
            </div>
          </div>

          <div class="login__divider">
            <div class="login__divider-line"></div>
            <div class="login__divider-text">或</div>
          </div>
          <div class="login__form-inputs">
            <p class="login__text">帳號</p>
            <input
              class="login__form-input"
              v-model="username"
              v-bind="usernameProps"
              :class="{ 'login__form-input--error': errors.username }"
            />
            <p class="login__text login__text--error">
              {{ errors.username }}
            </p>
          </div>
          <div class="login__form-inputs">
            <p class="login__text">密碼</p>
            <input
              type="password"
              class="login__form-input"
              v-model="password"
              v-bind="passwordProps"
              :class="{ 'login__form-input--error': errors.password }"
            />
            <p class="login__text login__text--error">
              {{ errors.password }}
            </p>
          </div>

          <div class="login__forgot">
            <p class="login__text login__text--forgot">忘記密碼?</p>
          </div>

          <div class="login__btns">
            <button type="submit" class="login__btn">登入</button>
          </div>
        </form>
        <div class="login__other">
          <div class="login__other-img">
            <img :src="p1" alt="Login Illustration" />
          </div>
          <div class="login__other-info">
            <p class="login__text">歡迎來到 再來一抽 官方網站!</p>
            <p class="login__text">
              如果你還沒有帳號，請立即註冊， 開啟更多功能哦！
            </p>
          </div>
          <div class="login__other-btn">
            <div class="login__btn" @click="forwardRegistration">註冊</div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import p1 from '@/assets/image/login.png';
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import { login } from '@/services/frontend/AuthService';
import { useAuthStore, useLoadingStore } from '@/stores';
import { getLoginUrl } from '@/utils/AuthUtils';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const schema = yup.object({
  username: yup.string().required('帳號為必填'),
  password: yup.string().required('密碼為必填'),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    password: '',
  },
});

const [username, usernameProps] = defineField('username');
const [password, passwordProps] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { accessToken, username } = await login(values);
    authStore.setToken(accessToken);
    authStore.setUser({ username });
    loadingStore.stopLoading();
    router.push('/home');
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
});

const forwardRegistration = () => {
  router.push('/register');
};

const handleOauthLogin = (provider: string) => {
  location.href = getLoginUrl(provider);
};
</script>

<style scoped></style>
