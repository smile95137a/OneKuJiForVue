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
  <ConfirmDialog v-if="dialogStore.isConfirmDialogOpen" />
  <YesOrNoDialog v-if="dialogStore.isYesNoDialogOpen" />
  <RestPwdDialog v-if="dialogStore.isRestPwdDialogOpen" />
  <OneKuJiDialog />
  <InfoDialog />
  <ImageDialog v-if="dialogStore.isImageDialogOpen" />
  <DaliyDialog v-if="dialogStore.isDaliyDialogOpen" />
  <LoadingMask v-if="loadingStore.isLoading" />
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import YesOrNoDialog from '@/components/common/YesOrNoDialog.vue';
import RestPwdDialog from '@/components/common/RestPwdDialog.vue';
import { useRoute } from 'vue-router';
import OneKuJiDialog from './components/common/OneKuJiDialog.vue';
import InfoDialog from './components/common/InfoDialog.vue';
import LoadingMask from './components/common/LoadingMask.vue';
import { useDialogStore, useLoadingStore } from './stores';
import DaliyDialog from '@/components/common/DaliyDialog.vue';
import ImageDialog from './components/common/ImageDialog.vue';

const route = useRoute();
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
</script>

<style scoped>
.layout__body {
  display: flex;
}
.layout__main {
  flex: 1;
}
</style>
