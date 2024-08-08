<template>
  <Card :title="isRegistering ? '會員註冊' : '會員登入'" customClass="mcard--login">
    <div class="login__container">
      <div class="login__main">
        <div class="login__form">
          <template v-if="!isRegistering">
            <div class="login__auth">
              <div class="login__auth-btn" @click="loginWithGoogle">
                <div class="login__auth-btn-icon" >
                  <i class="fa-brands fa-google"></i>
                </div>
                <div class="login__auth-btn-text">Google 帳號登入</div>
              </div>
              <div class="login__auth-btn">
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
              <input v-model="loginForm.username" type="text" class="login__form-input" />
            </div>
            <div class="login__form-inputs">
              <p class="login__text">密碼</p>
              <input v-model="loginForm.password" type="password" class="login__form-input" />
            </div>

            <div class="login__forgot">
              <p class="login__text login__text--forgot">忘記密碼?</p>
            </div>

            <div class="login__btns">
              <div class="login__btn" @click="handleLogin">登入</div>
            </div>
          </template>

          <template v-else>
            <div class="login__form-inputs">
              <p class="login__text">帳號</p>
              <input v-model="registrationForm.username" type="text" class="login__form-input" />
            </div>
            <div class="login__form-inputs">
              <p class="login__text">密碼</p>
              <input v-model="registrationForm.password" type="password" class="login__form-input" />
            </div>
            <div class="login__form-inputs">
              <p class="login__text">暱稱</p>
              <input v-model="registrationForm.nickname" type="text" class="login__form-input" />
            </div>
            <div class="login__form-inputs">
              <p class="login__text">電子郵件</p>
              <input v-model="registrationForm.email" type="email" class="login__form-input" />
            </div>
            <div class="login__form-inputs">
              <p class="login__text">電話號碼</p>
              <input v-model="registrationForm.phoneNumber" type="tel" class="login__form-input" />
            </div>
            <div class="login__form-inputs">
              <p class="login__text">地址</p>
              <input v-model="registrationForm.address" type="text" class="login__form-input" />
            </div>

            <div class="login__btns">
              <div class="login__btn" @click="handleRegister">註冊</div>
            </div>
          </template>

          <p v-if="errorMessage" class="login__error">{{ errorMessage }}</p>
        </div>
        <div class="login__other">
          <div class="login__other-img">
            <img :src="p1" alt="" srcset="" />
          </div>
          <div class="login__other-info">
            <p class="login__text">歡迎來到 再來一抽 官方網站!</p>
            <p class="login__text">
              {{ isRegistering ? '已經有帳號了嗎？請立即登入！' : '如果你還沒有帳號，請立即註冊， 開啟更多功能哦！' }}
            </p>
          </div>
          <div class="login__other-btn">
            <div class="login__btn" @click="toggleRegistration">
              {{ isRegistering ? '返回登入' : '註冊' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import p1 from '@/assets/image/login.png';
import Card from '@/components/common/Card.vue';
import { login, LoginRequest, register, RegisterRequest } from '@/services/Front/Frontapi';
import { useUserStore } from '@/stores/userstore';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userstore = useUserStore();

const loginForm = reactive({
  username: '',
  password: '',
});

const registrationForm = reactive({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phoneNumber: '',
  address: '',
});

const isRegistering = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    console.log('Attempting login with:', loginForm);
    const loginData: LoginRequest = {
      username: loginForm.username,
      password: loginForm.password,
    };
    const response = await login(loginData);
    console.log('Login response:', response);
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken); // Store JWT token
      userstore.login(loginForm.username);
      router.push('/home');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      errorMessage.value = `登錄失敗: ${error.response.data.message || '請檢查您的憑證。'}`;
    } else {
      errorMessage.value = '登錄失敗。請檢查您的憑證。';
    }
  }
};

const handleRegister = async () => {
  try {
    const registerData: RegisterRequest = {
      username: registrationForm.username,
      password: registrationForm.password,
      nickname: registrationForm.nickname,
      email: registrationForm.email,
      phoneNumber: registrationForm.phoneNumber,
      address: registrationForm.address
    };
    const response = await register(registerData);
    console.log('Registration successful', response);
    isRegistering.value = false;
    errorMessage.value = '註冊成功。請登錄。';
  } catch (error) {
    console.error('Registration failed', error);
    if (axios.isAxiosError(error) && error.response) {
      errorMessage.value = `註冊失敗: ${error.response.data.message || '請稍後再試。'}`;
    } else {
      errorMessage.value = '註冊失敗。請稍後再試。';
    }
  }
};

const toggleRegistration = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = '';
};

const loginWithGoogle = () => {
  window.location.href = 'http://localhost:8081/oauth2/authorization/google';
};

const handleOAuth2Callback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('accessToken');

  if (accessToken) {
    localStorage.setItem('token', accessToken);
    console.log('登录成功，AccessToken:', accessToken);
    userstore.login('Google User'); // 假設使用 Google 登入的用戶名為 'Google User'
    router.push('/home');
  } else {
    errorMessage.value = '登录失败，请稍后重试。';
  }
};

onMounted(() => {
  handleOAuth2Callback();
});
</script>

<style scoped>
.login__error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>