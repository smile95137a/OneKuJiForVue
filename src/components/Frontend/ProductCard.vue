<template>
  <div :class="['productCard', customClass]">
    <div class="productCard__img">
      <img :src="imagePath" alt="Product Card Image" />
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
console.log(props)
const router = useRouter();
console.log(router)
</script>
