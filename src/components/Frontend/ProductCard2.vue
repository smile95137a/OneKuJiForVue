<template>
  <div
    :class="[
      'productCard2',
      `productCard2--${product.grade.toLowerCase()}`,
      customClass,
    ]"
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
  A: 'A賞',
  B: 'B賞',
  C: 'C賞',
  D: 'D賞',
  E: 'E賞',
  F: 'F賞',
  G: 'G賞',
  H: 'H賞',
  SP: 'SP賞',
  LAST: '最後賞',
};

const gradeDescription = computed(() => ProductGrade[props.product.grade]);
</script>

<style scoped></style>
