<template>
  <div class="memberCenter__nav">
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/profile-edit"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-user"></i
        ></span>
        <span class="memberCenter__text">會員資料修改 </span>
      </router-link>
    </div>
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/purchase-history"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-coins"></i>
        </span>
        <span class="memberCenter__text">消費紀錄 </span>
      </router-link>
    </div>
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/rewards"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-trophy"></i
        ></span>
        <span class="memberCenter__text"> 消費獎勵</span>
      </router-link>
    </div>
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/order-history"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-receipt"></i
        ></span>
        <span class="memberCenter__text">訂單記錄 </span>
      </router-link>
    </div>
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/draw-history"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-receipt"></i
        ></span>
        <span class="memberCenter__text">抽獎記錄 </span>
      </router-link>
    </div>
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/deposit"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-receipt"></i
        ></span>
        <span class="memberCenter__text">會員儲值</span>
      </router-link>
    </div>
    <div class="memberCenter__nav-item">
      <router-link
        to="/member-center/prize-checkout"
        class="memberCenter__nav-link"
        active-class="memberCenter__nav-link--active"
      >
        <span class="memberCenter__nav-icon"
          ><i class="fa-solid fa-receipt"></i
        ></span>
        <span class="memberCenter__text">賞品盒</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
