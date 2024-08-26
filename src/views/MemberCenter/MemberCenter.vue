<template>
  <div class="memberCenter">
    <MemberCenterNav />
    <div class="memberCenter__main">
      <Card customClass="mcard--memberCenter">
        <template #header>
          <MCardHeader title="會員中心" />
        </template>
        <router-view></router-view>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import MemberCenterNav from '@/components/frontend/memberCenter/MemberCenterNav.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
</script>

<style scoped></style>
