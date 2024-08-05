<template>
  <div class="memberCenter">
    <div class="memberCenter__nav">
      <div class="memberCenter__nav-item">
        <router-link
          to="/member-center/profile-edit"
          class="memberCenter__nav-link"
          active-class="memberCenter__nav-link--active"
          >會員資料修改</router-link
        >
      </div>
      <div class="memberCenter__nav-item">
        <router-link
          to="/member-center/purchase-history"
          class="memberCenter__nav-link"
          active-class="memberCenter__nav-link--active"
          >消費紀錄</router-link
        >
      </div>
      <div class="memberCenter__nav-item">
        <router-link
          to="/member-center/rewards"
          class="memberCenter__nav-link"
          active-class="memberCenter__nav-link--active"
          >消費獎勵</router-link
        >
      </div>
      <div class="memberCenter__nav-item">
        <router-link
          to="/member-center/order-history"
          class="memberCenter__nav-link"
          active-class="memberCenter__nav-link--active"
          >訂單記錄</router-link
        >
      </div>
    </div>
    <div class="memberCenter__main">
      <Card title="會員中心" customClass="mcard--memberCenter">
        <router-view></router-view>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
</script>

<style scoped>
.nav {
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.nav-item {
  margin-right: 15px;
}

.nav-link {
  text-decoration: none;
  color: blue;
}

.active-link {
  font-weight: bold;
  color: red;
}
</style>
