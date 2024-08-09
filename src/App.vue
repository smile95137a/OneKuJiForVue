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
  <OneKuJiDialog />
  <LoadingMask v-if="loadingStore.isLoading" />
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userstore';
import OneKuJiDialog from './components/common/OneKuJiDialog.vue';
import LoadingMask from './components/common/LoadingMask.vue';
import { useLoadingStore } from './stores';

const route = useRoute();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // You might want to verify the token here
    userStore.login('User'); // Replace 'User' with actual username if available
  }
});

window.addEventListener('beforeunload', () => {
  localStorage.removeItem('token');
});
</script>

<style scoped>
.layout__body {
  display: flex;
}
.layout__main {
  flex: 1;
}
</style>
