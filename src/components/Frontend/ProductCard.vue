<template>
  <router-link :class="['productCard', customClass]" :to="getProductDetailLink">
    <div class="productCard__img">
      <img
        :src="imagePath"
        alt="Product Card Image"
        @error="handleImageError"
      />
      <div class="productCard__img-status">{{ imgStatus }}</div>
      <div class="productCard__img-detail">
        <div class="productCard__img-balance">
          <p class="productCard__text">{{ balanceText }}</p>
        </div>
        <div class="productCard__img-price">
          <p class="productCard__img-money">
            <span class="productCard__text">{{ money }}</span>
          </p>
          <p class="productCard__img-unit">
            <span class="productCard__text productCard__text--icon">
              {{ unitIcon }}
            </span>
            <span class="productCard__text">{{ unitText }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="productCard__detail">
      <div class="productCard__detail-title">{{ title }}</div>
      <div class="productCard__detail-content">{{ content }}</div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';

interface IproductCardProps {
  productId?: number;
  customClass?: string;
  imagePath: string;
  imgStatus?: string;
  balanceText?: string;
  money?: string;
  unitIcon?: string;
  unitText?: string;
  title?: string;
  content?: string;
  productType?: string;
}

const props = defineProps<IproductCardProps>();

const getProductDetailLink = computed(() => {
  if (props.productType === 'PRIZE' || props.productType === 'BLIND_BOX') {
    return `/product-detail1/${props.productId}`;
  } else if (props.productType === 'GACHA') {
    return `/product-detail2/${props.productId}`;
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
