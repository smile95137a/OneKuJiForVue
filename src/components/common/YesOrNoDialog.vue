<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--yesOrNoDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="yesOrNoDialog">
      <div class="yesOrNoDialog__header">
        <div class="yesOrNoDialog__logo">
          <img :src="logoImg" class="yesOrNoDialog__logo-img" />
        </div>
        <div class="yesOrNoDialog__close" @click="handleClose(false)">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="yesOrNoDialog__main">
        <div class="yesOrNoDialog__main-content">
          <p
            class="yesOrNoDialog__text yesOrNoDialog__text--title"
            v-if="yesNoDialogOptions?.title"
          >
            {{ yesNoDialogOptions?.title }}
          </p>
          <p
            class="yesOrNoDialog__text"
            v-html="yesNoDialogOptions?.message"
          ></p>
        </div>
        <div class="yesOrNoDialog__main-btns">
          <div
            class="yesOrNoDialog__main-btn yesOrNoDialog__main-btn--cancel"
            @click="handleClose(false)"
          >
            取消
          </div>
          <div
            class="yesOrNoDialog__main-btn yesOrNoDialog__main-btn--confirm"
            @click="handleConfirm"
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

const isOpen = computed(() => dialogStore.isYesNoDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const yesNoDialogOptions = computed(() => dialogStore.yesNoDialogOptions);

const handleClose = (result: boolean) => {
  dialogStore.closeYesNoDialog(result);
};

const handleConfirm = () => {
  dialogStore.closeYesNoDialog(true);
};
</script>

<style scoped></style>
