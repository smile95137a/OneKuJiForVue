<template>
  <div class="productCard__img-content">
    <div class="productCard__img-status">{{ getProductStatus(product) }}</div>
    <div class="productCard__img-balance">
      <p class="productCard__text">
        剩餘 <NumberFormatter :number="product.detailQuantity || 0" />抽
      </p>
    </div>
    <div class="productCard__img-detail">
      <div class="productCard__img-price">
        <p class="productCard__img-money">
          <span class="productCard__text">
            <NumberFormatter :number="product.price" />
          </span>
        </p>
        <p class="productCard__img-unit">
          <span class="productCard__text productCard__text--icon"> 金 </span>
          <span class="productCard__text">/抽</span>
        </p>
      </div>
      <div class="productCard__img-sliverPrice">
        <p class="productCard__img-money">
          <span class="productCard__text">
            <NumberFormatter :number="product.sliverPrice" />
          </span>
        </p>
        <p class="productCard__img-unit">
          <span class="productCard__text productCard__text--icon">銀</span>
          <span class="productCard__text">/抽</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { IProduct } from '@/services/frontend/productService';
import { defineProps } from 'vue';

defineProps<{ product: IProduct }>();

const getProductStatus = (product: IProduct): string => {
  const now = new Date().getTime();
  const startDate = new Date(product.startDate).getTime();
  const endDate = new Date(product.endDate).getTime();

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};
</script>
