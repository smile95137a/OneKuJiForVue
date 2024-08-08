<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="'dialog--oneKuJiDialog'"
    @close="handleClose"
  >
    <div class="oneKuJiDialog">
      <div class="oneKuJiDialog__main">
        <img :src="`${animateSrc}?t=${timestamp}`" @load="onGifLoad" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';
import boxAnimate from '@/assets/image/box_animate.gif';
import ticketAnimate from '@/assets/image/ticket_animate.gif';
import gachaAnimate from '@/assets/image/gacha_animate.gif';
import { useDialogStore } from '@/stores/dialogStore';
import { computed, ref, watch } from 'vue';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isOneKujiDialogOpen);
const animateSrc = ref('');
const timestamp = ref('');

const gifDuration = {
  box: 1000,
  ticket: 1000,
  gacha: 2000,
};

const onGifLoad = () => {
  const duration = gifDuration[dialogStore.oneKujiDialogType] || 1000;
  setTimeout(() => {
    handleGifComplete();
  }, duration);
};

const handleGifComplete = () => {
  dialogStore.closeOneKujiDialog(true);
};

watch(isOpen, (newVal) => {
  if (newVal) {
    if (dialogStore.oneKujiDialogType === 'box') {
      animateSrc.value = boxAnimate;
    } else if (dialogStore.oneKujiDialogType === 'ticket') {
      animateSrc.value = ticketAnimate;
    } else if (dialogStore.oneKujiDialogType === 'gacha') {
      animateSrc.value = gachaAnimate;
    } else {
      animateSrc.value = '';
    }

    timestamp.value = Date.now().toString();
  }
});

const handleClose = (result: boolean) => {
  dialogStore.closeOneKujiDialog(result);
};
</script>

<style scoped></style>
