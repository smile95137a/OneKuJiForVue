<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="`${customClass} dialog--info`"
    @close="handleClose"
  >
    <div class="infoDialog">
      <div class="infoDialog__header">
        <div class="infoDialog__logo">
          <img :src="logoImg" class="infoDialog__logo-img" />
        </div>
      </div>

      <div class="infoDialog__main">
        <div class="infoDialog__main-content">
          <p
            class="infoDialog__text infoDialog__text--title"
            v-if="infoDialogOptions?.title"
          >
            {{ infoDialogOptions?.title }}
          </p>
          <p class="infoDialog__text">{{ infoDialogOptions?.message }}</p>
        </div>
        <div class="infoDialog__main-btns">
          <div
            class="infoDialog__main-btn infoDialog__main-btn--confirm"
            @click="handleClose"
          >
            確認
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';
import logoImg from '@/assets/image/logo1.png';
import { computed } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isInfoDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const infoDialogOptions = computed(() => dialogStore.infoDialogOptions);

const handleClose = () => {
  dialogStore.closeInfoDialog();
};
</script>

<style scoped></style>
