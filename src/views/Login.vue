<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import p1 from '@/assets/image/login.png';
</script>

<template>
  <Card title="會員登入" customClass="mcard--login">
    <div class="login__container">
      <div class="login__main">
        <div class="login__form">
          <div class="login__auth">
            <div class="login__auth-btn">
              <div class="login__auth-btn-icon">
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
            <input type="text" class="login__form-input" />
          </div>
          <div class="col-100 m-t-16">
            <p class="login__text">密碼</p>
            <input type="text" class="login__form-input" />
          </div>

          <div class="login__forgot">
            <p class="login__text login__text--forgot">忘記密碼?</p>
          </div>

          <div class="login__btns">
            <div class="login__btn">登入</div>
          </div>
        </div>
        <div class="login__other">
          <div class="login__other-img">
            <img :src="p1" alt="" srcset="" />
          </div>
          <div class="login__other-info">
            <p class="login__text">歡迎來到 再來一抽 官方網站!</p>
            <p class="login__text">
              如果你還沒有帳號，請立即註冊， 開啟更多功能哦！
            </p>
          </div>
          <div class="login__other-btn">
            <div class="login__btn">註冊</div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped></style>
