<template>
  <router-link :class="['productCard', customClass]" :to="getProductDetailLink">
    <div class="productCard__img">
      <img
        :src="product.imageUrl"
        alt="Product Card Image"
        @error="handleImageError"
      />
      <div class="productCard__img-status">{{ getProductStatus(product) }}</div>
      <div class="productCard__img-detail">
        <div class="productCard__img-balance">
          <p class="productCard__text">剩餘{{ product.stockQuantity }}抽</p>
        </div>
        <div class="productCard__img-price">
          <p class="productCard__img-money">
            <span class="productCard__text">{{ product.money }}</span>
          </p>
          <p class="productCard__img-unit">
            <span class="productCard__text productCard__text--icon"> 金 </span>
            <span class="productCard__text">/抽</span>
          </p>
        </div>
      </div>
    </div>
    <div class="productCard__detail">
      <div class="productCard__detail-title">{{ product.productName }}</div>
      <div class="productCard__detail-content">{{ product.description }}</div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';

interface IproductCardProps {
  product: any;
  customClass?: string;
}

const props = defineProps<IproductCardProps>();

const getProductStatus = (product: any): string => {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};
const getProductDetailLink = computed(() => {
  const { productType, productId } = props.product;
  if (productType === 'PRIZE' || productType === 'BLIND_BOX') {
    return `/product-detail1/${productId}`;
  } else if (productType === 'GACHA') {
    return `/product-detail2/${productId}`;
  } else {
    return `#`;
  }
});

const handleImageError = (event: Event) => {
  console.error(
    'Image failed to load:',
    (event.target as HTMLImageElement).src
  );
  (event.target as HTMLImageElement).src = '/path/to/default/image.jpg';
};
</script>

<style scoped></style>
