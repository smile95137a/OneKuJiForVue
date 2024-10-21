<template>
  <div :class="['menu-flip']">
    <div v-if="index === 0" class="menu-flip__header-title grid text-center">
      <div class="col-20 p-12">日期</div>
      <div class="col-20 p-12">訂單編號</div>
      <div class="col-20 p-12">內容</div>
      <div class="col-20 p-12">狀態</div>
      <div class="col-20 p-12">明細</div>
    </div>
  </div>
  <div :class="['menu-flip', isActive ? 'menu-flip--active' : '']">
    <div class="menu-flip__header">
      <div class="menu-flip__header-info grid text-center">
        <div class="col-20 p-12" @click="togglePanel">
          {{ formatDate(orderData.createdAt) }}
        </div>
        <div
          class="col-20 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">{{ orderData.orderNumber }}</p>
        </div>
        <div
          class="col-20 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">{{ orderData.content }}</p>
        </div>
        <div
          class="col-20 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">{{ orderData.resultStatus }}</p>
        </div>
        <div
          class="col-20 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">明細</p>
        </div>
      </div>
    </div>
    <div
      :class="['menu-flip__panel', isActive ? 'menu-flip__panel--active' : '']"
    >
      <div class="grid m-b-16">
        <div class="col-25">名稱</div>
        <div class="col-25">數量</div>
        <div class="col-25">單價</div>
        <div class="col-25">總金額</div>
      </div>
      <div class="grid" v-for="item in orderData.orderDetails" :key="item.id">
        <div class="col-25 p-x-12">
          {{ item.storeProduct?.productName }}
        </div>
        <div class="col-25 p-x-12">
          {{ item.quantity }}
        </div>
        <div class="col-25 p-x-12">
          {{ item.unitPrice }}
        </div>
        <div class="col-25 p-x-12">
          {{ item.totalPrice }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';

const props = defineProps({
  index: Number,
  orderData: Object as PropType<any>,
});

const isActive = ref(false);
const togglePanel = () => {
  isActive.value = !isActive.value;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
/* Your existing styles here */
</style>
