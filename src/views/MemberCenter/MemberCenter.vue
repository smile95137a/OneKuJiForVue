<template>
  <div class="memberCenter">
    <MemberCenterNav />
    <div class="memberCenter__main">
      <Card customClass="mcard--memberCenter">
        <template #header>
          <p class="mcard__text">會員中心</p>
        </template>
        <router-view></router-view>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import MemberCenterNav from '@/components/Frontend/memberCenter/MemberCenterNav.vue';
</script>

<style scoped></style>
