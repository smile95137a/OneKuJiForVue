<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
</script>

<template>
  <div class="main">
    <Header />
    <div class="layout">
      <Sidebar />
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
