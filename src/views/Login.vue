<script setup lang="ts">
import Card from '@/components/common/Card.vue';
</script>

<template>
  <Card title="登入" customClass="mcard--login">
    <div class="login__container">
      <div class="login__main">
        <div class="login__tab">
          <div
            class="login__tab-btn login__tab-btn--phone login__tab-btn--active"
          >
            手機
          </div>
          <div class="login__tab-btn login__tab-btn--mail">信箱</div>
        </div>

        <div class="login__form grid">
          <div class="col-100 m-t-16">
            <p class="login__text">帳號</p>
            <input type="text" class="login__form-input" />
          </div>
          <div class="col-100 m-t-16">
            <p class="login__text">密碼</p>
            <input type="text" class="login__form-input" />
          </div>
        </div>

        <div class="login__forgot">
          <p class="login__text login__text--forgot">忘記密碼?</p>
        </div>

        <div class="login__btns">
          <div class="login__btn">登入</div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped></style>
