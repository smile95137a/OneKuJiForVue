<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useRoute } from 'vue-router';
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('token');
});
const route = useRoute();
</script>

<template>
  <div class="layout">
    <Header v-if="route.meta.layout !== 'admin'" />
    <div class="layout__body">
      <Sidebar v-if="route.meta.showSidebar" />
      <main class="layout__main">
        <router-view></router-view>
      </main>
    </div>
    <Footer v-if="route.meta.layout !== 'admin'" />
  </div>
  <ConfirmDialog />
</template>

<style scoped>
.layout__body {
  display: flex;
}
.layout__main {
  flex: 1;
}
</style>
