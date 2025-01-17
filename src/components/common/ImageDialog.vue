<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="`${customClass} dialog--image`"
    @close="handleClose"
  >
    <div class="imageDialog">
      <div class="imageDialog__main">
        <MImage
          v-if="imageDialogOptions?.news?.imageUrls?.[0]"
          :src="imageDialogOptions.news.imageUrls[0]"
          custom-class="imageDialog__img"
        />
        <p v-else>無圖片可顯示</p>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from './Dialog.vue';
import MImage from '@/components/frontend/MImage.vue';
import { computed } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isImageDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const imageDialogOptions = computed(() => dialogStore.imageDialogOptions);

const handleClose = () => {
  dialogStore.closeImageDialog();
};
</script>
