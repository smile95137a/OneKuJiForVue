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
import { defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
  path?: string;
}

const props = defineProps<IproductCardProps>();
const router = useRouter();

const handleImageError = (e: Event) => {
  console.error('Image failed to load:', (e.target as HTMLImageElement).src);
  // 可以在這裡設置一個默認圖片
  // (e.target as HTMLImageElement).src = '/path/to/default/image.jpg';
};

onMounted(() => {
  console.log('ProductCard props:', props);
  // 如果需要使用 router，可以在這裡添加相關邏輯
  console.log('Router:', router);
});
</script>

<style scoped>
/* 如果有任何特定於 ProductCard 的樣式，可以在這裡添加 */
</style>