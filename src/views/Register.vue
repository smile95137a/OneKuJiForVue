<script setup lang="ts">
import Card from '@/components/common/Card.vue';
</script>

<template>
  <Card customClass="mcard--register">
    <template #header>
      <p class="mcard__text">註冊會員</p>
    </template>
    <div class="register__container">
      <div class="register__main">
        <div class="register__form">
          <div class="register__form-inputs">
            <p class="register__text register__text--required">email</p>
            <input type="text" class="register__form-input" />
          </div>
          <div class="register__form-inputs m-t-20">
            <p class="register__text register__text--required">手機</p>
            <input type="text" class="register__form-input" />
          </div>
          <div class="register__form-inputs m-t-20">
            <p class="register__text register__text--required">密碼</p>
            <input type="text" class="register__form-input" />
          </div>
          <div class="register__form-inputs m-t-20">
            <p class="register__text register__text--required">確認密碼</p>
            <input type="text" class="register__form-input" />
          </div>
        </div>
        <div class="register__divider">
          <div class="login__divider-line"></div>
        </div>
        <div class="register__form">
          <div class="register__form-inputs">
            <p class="register__text register__text--required">暱稱</p>
            <input type="text" class="register__form-input" />
          </div>
          <div class="register__form-inputs m-t-20">
            <p class="register__text">LINE ID</p>
            <input type="text" class="register__form-input" />
          </div>
          <div class="register__form-inputs m-t-20">
            <p class="register__text">收貨姓名</p>
            <input type="text" class="register__form-input" />
          </div>
          <div class="register__form-inputs--addr">
            <div class="register__form-inputs w-50 m-t-20">
              <p class="register__text">收貨地址</p>
              <input type="text" class="register__form-input" />
            </div>
            <div class="register__form-inputs w-50 m-t-20">
              <input type="text" class="register__form-input" />
            </div>
          </div>

          <div class="register__form-inputs m-t-20">
            <p class="register__text">詳細地址</p>
            <input type="text" class="register__form-input" />
          </div>
        </div>
      </div>
      <div class="register__other">
        <p class="register__text">
          我同意 一番賞 提供的 <u>網站服務條款</u> 與 <u>隱私權政策</u> 。
        </p>
        <div class="register__other-btn">
          <div class="register__btn">註冊成為會員</div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped></style>
