<template>
  <div class="productCard__img-content">
    <div class="productCard__img-status">{{ getProductStatus(product) }}</div>
    <div class="productCard__img-detail">
      <div class="productCard__img-balance">
        <p class="productCard__text">剩餘 {{ product.stockQuantity }} 抽</p>
      </div>
      <div class="productCard__img-price">
        <p class="productCard__img-money">
          <span class="productCard__text">{{ product.price }}</span>
        </p>
        <p class="productCard__img-unit">
          <span class="productCard__text productCard__text--icon"> 金 </span>
          <span class="productCard__text">/抽</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

interface IproductContentAProps {
  product: {
    productName: string;
    description: string;
    price: number;
    stockQuantity: number;
    money: number;
    startDate: string;
    endDate: string;
  };
}

defineProps<IproductContentAProps>();

const getProductStatus = (product: any): string => {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};
</script>
