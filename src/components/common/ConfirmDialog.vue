<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--confirmDialog', customClass]"
    @close="handleClose"
  >
    <div class="confirmDialog">
      <div class="confirmDialog__header">
        <div class="confirmDialog__logo">
          <img :src="logoImg" class="confirmDialog__logo-img" />
        </div>
        <div class="confirmDialog__close" @click="handleClose(false)">
          <i class="fa-solid fa-xmark"></i>
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
        <div class="confirmDialog__main-product-divider m-y-24">
          <p class="confirmDialog__text">抽中賞品</p>
        </div>
        <div class="confirmDialog__main-product grid">
          <div
            v-for="(group, productId) in groupedDrawData"
            :key="productId"
            class="col-25 col-lg-25 col-md-25 col-sm-100"
          >
            <div class="grid p-x-12">
              <div class="col-50">
                <MImage :src="group[0].imageUrls" />
              </div>
              <div class="col-50">
                {{ group[0].productName }}*
                <NumberFormatter :number="group?.length ?? 0" />
              </div>
            </div>
          </div>
        </div>
        <div class="confirmDialog__main-product-divider m-y-24"></div>
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
import { computed, onMounted, ref } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';
import MImage from '@/components/frontend/MImage.vue';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isConfirmDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const confirmDialogData = computed(() => dialogStore.confirmDialogData);

const groupedDrawData = ref([]);

const handleClose = (result: boolean) => {
  dialogStore.closeConfirmDialog(result);
};

const handleConfirm = () => {
  dialogStore.closeConfirmDialog(true);
};

onMounted(() => {
  if (confirmDialogData?.value.drawData) {
    const groupedData = confirmDialogData?.value.drawData.reduce(
      (acc: any, draw: any) => {
        const productId = draw.productId;
        if (!acc[productId]) {
          acc[productId] = [];
        }
        acc[productId].push(draw);
        return acc;
      },
      {}
    );

    groupedDrawData.value = groupedData;
  }
});
</script>

<style scoped></style>
