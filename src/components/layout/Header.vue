<template>
  <div class="header">
    <div class="header__main">
      <div class="header__menu"></div>
      <router-link to="/home" class="header__logo">
        <img :src="logoImg" class="header__logo-img" />
      </router-link>
      <div :class="'header__nav header__nav--open'">
        <div class="header__nav-items">
          <div class="header__nav-item header__nav-item--logo">
            <img class="header__logo-img" />
          </div>
          <router-link class="header__nav-item" to="/product">
            一番賞
            <div class="header__nav-item-icon"></div>
          </router-link>
          <router-link class="header__nav-item" to="/product2">
            盲盒
            <div class="header__nav-item-icon"></div>
          </router-link>
          <router-link class="header__nav-item" to="/product3">
            扭蛋抽獎
            <div class="header__nav-item-icon"></div>
          </router-link>
        </div>
      </div>
      <div class="header__btns">
        <router-link class="header__btn header__btn--login" to="/login">
          登入
        </router-link>
        <router-link class="header__btn header__btn--register" to="/register">
          註冊
        </router-link>
      </div>
    </div>
    <div class="header__marquee">
      <p class="header__text">
        一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈一番賞通知跑馬燈...
      </p>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import logoImg from '@/assets/image/logo1.png';
</script>
