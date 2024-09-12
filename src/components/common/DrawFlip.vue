<template>
  <div :class="['menu-flip']">
    <div v-if="index === 0" class="menu-flip__header-title grid text-center">
      <div class="col-20 p-12">圖片</div>
      <div class="col-20 p-12">名稱</div>
      <div class="col-20 p-12">數量</div>
      <div class="col-20 p-12">日期</div>
      <div class="col-20 p-12">金額</div>
    </div>
  </div>
  <div :class="['menu-flip', isActive ? 'menu-flip--active' : '']">
    <div class="menu-flip__header">
      <div class="menu-flip__header-info grid text-center">
        <div class="col-20 p-12">
          <MImage :src="orderData.imageUrls[0]" />
        </div>
        <div class="col-20 flex items-center justify-center">
          <p class="menu-flip__text">{{ orderData.productName }}</p>
        </div>
        <div class="col-20 flex items-center justify-center">
          <p class="menu-flip__text">{{ orderData.drawCount }}</p>
        </div>
        <div class="col-20 flex items-center justify-center">
          <p class="menu-flip__text">{{ formatDate(orderData.createDate) }}</p>
        </div>
        <div class="col-20 flex items-center justify-center">
          <p class="menu-flip__text">{{ orderData.amount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import MImage from '@/components/frontend/MImage.vue';

const props = defineProps({
  index: Number,
  orderData: Object as PropType<any>,
});

const isActive = ref(false);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
/* Your existing styles here */
</style>
