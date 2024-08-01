<template>
  <div :class="['productCard', customClass]">
    <div class="productCard__img">
      <img :src="imagePath" alt="Product Card Image" @error="handleImageError" />
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
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

interface IproductCardProps {
  customClass?: string;
  imagePath: string;
  imgStatus?: string;
  balanceText?: string;
  money?: string;
  unitIcon?: string;
  unitText?: string;
  title?: string;
  content?: string;
}

const props = defineProps<IproductCardProps>();

const handleImageError = (event: Event) => {
  console.error('Image failed to load:', (event.target as HTMLImageElement).src);
  // 设置一个默认图片
  (event.target as HTMLImageElement).src = '/path/to/default/image.jpg';
};
</script>

<style scoped>
/* 样式部分 */
.productCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 10px;
}

.productCard__img {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.productCard__img img {
  max-width: 100%;
  max-height: 100%;
}

.productCard__detail {
  padding-top: 10px;
}
</style>
