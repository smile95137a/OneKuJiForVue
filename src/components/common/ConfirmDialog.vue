<template>
  <Dialog :isOpen="isOpen" :customClass="customClass" @close="handleClose">
    <div class="confirmDialog">
      <div class="confirmDialog__header">
        <div class="confirmDialog__logo">
          <img :src="logoImg" class="confirmDialog__logo-img" />
        </div>
      </div>

      <div class="confirmDialog__main">
        <div class="confirmDialog__main-content">
          <div class="confirmDialog__main-balance">
            <p class="confirmDialog__text">
              目前剩餘
              <span class="confirmDialog__text confirmDialog__text--red">
                <NumberFormatter
                  :number="confirmDialogData?.remainingQuantity ?? 0"
                />
              </span>
              抽
            </p>
          </div>
          <div class="confirmDialog__main-count">
            <p class="confirmDialog__text">
              連續次數
              <span class="confirmDialog__text confirmDialog__text--red">
                <NumberFormatter :number="confirmDialogData?.count ?? 0" />
              </span>
              抽
            </p>
          </div>
          <div class="confirmDialog__main-total">
            <p class="confirmDialog__text">
              共花費
              <span
                class="confirmDialog__text confirmDialog__text--red confirmDialog__text--bold"
              >
                <NumberFormatter :number="confirmDialogData?.total ?? 0" />
              </span>
            </p>
          </div>
        </div>
        <div class="confirmDialog__main-btns">
          <div
            class="confirmDialog__main-btn confirmDialog__main-btn--cancel"
            @click="handleClose(false)"
          >
            取消
          </div>
          <div
            class="confirmDialog__main-btn confirmDialog__main-btn--confirm"
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
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { computed } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isConfirmDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const confirmDialogData = computed(() => dialogStore.confirmDialogData);

const handleClose = (result: boolean) => {
  dialogStore.closeConfirmDialog(result);
};

const handleConfirm = () => {
  dialogStore.closeConfirmDialog(true);
};
</script>

<style scoped></style>
