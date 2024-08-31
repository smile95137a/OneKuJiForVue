<template>
  <div
    :class="['productCard2', `productCard2--${product.grade.toLowerCase()}`]"
  >
    <div class="productCard2__img">
      <MImage :src="product.imageUrls[0]" />
      <div class="productCard2__img-pHeightText">{{ product.description }}</div>
      <div class="productCard2__img-detail">
        <div class="productCard2__img-balance">
          <p class="productCard2__text productCard2__text--title">
            {{ gradeDescription }}
          </p>
          <p class="productCard2__text productCard2__text--num">
            {{ product.quantity }}/{{ product.stockQuantity }}
          </p>
        </div>
      </div>
    </div>
    <div class="productCard2__detail">
      <div class="productCard2__detail-title">{{ product.productName }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MImage from '@/components/frontend/MImage.vue';
import { computed, defineProps } from 'vue';

interface IProductCard2Props {
  product: any;
  customClass?: string;
}
const props = defineProps<IProductCard2Props>();

const ProductGrade = {
  A: 'Ａ賞',
  B: 'Ｂ賞',
  C: 'Ｃ賞',
  D: 'Ｄ賞',
  E: 'Ｅ賞',
  F: 'Ｆ賞',
  G: 'Ｇ賞',
  H: 'H賞',
  LAST: '最後賞',
};

const gradeDescription = computed(() => ProductGrade[props.product.grade]);
</script>

<style scoped></style>
