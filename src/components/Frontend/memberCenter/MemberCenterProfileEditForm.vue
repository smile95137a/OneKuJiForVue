<template>
  <div class="memberCenter__profileEditForm">
    <div class="memberCenter__profileEditForm-title">
      <p class="memberCenter__text">會員資料修改</p>
    </div>
    <div class="memberCenter__profileEditForm-main">
      <div class="memberCenter__profileEditForm-form">
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">暱稱</p>
          <input class="memberCenter__profileEditForm-form-input" />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">
            收貨姓名
          </p>
          <input class="memberCenter__profileEditForm-form-input" />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text">收貨地址</p>
          <input type="text" class="memberCenter__profileEditForm-form-input" />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text">詳細地址</p>
          <input type="text" class="memberCenter__profileEditForm-form-input" />
        </div>
      </div>
      <div
        class="memberCenter__profileEditForm-form memberCenter__profileEditForm-form--other"
      >
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text">LINE ID</p>
          <input type="text" class="memberCenter__profileEditForm-form-input" />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">
            收貨手機
          </p>
          <input type="text" class="memberCenter__profileEditForm-form-input" />
        </div>
      </div>
    </div>
    <div class="memberCenter__profileEditForm-btns">
      <div class="memberCenter__profileEditForm-btn">
        <span class="memberCenter__text">確認修改</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/userstore';
import { updateUser } from '@/services/frontend/userService';

const userStore = useUserStore();

const fetchUserInfo = async () => {};

const updateUserInfo = async () => {};
</script>

<style lang="scss" scoped>
// 您的樣式代碼...
</style>
