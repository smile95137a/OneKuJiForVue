<template>
  <div :class="['productCard', customClass]">
    <div class="productCard__img">
      <MImage :src="product.imageUrls[0]" />
      <ProductContentMain
        v-if="!cardType || cardType === 'main'"
        :product="product"
      />
      <ProductContentMall
        :index="index"
        v-if="cardType === 'mall'"
        :product="product"
        :is-rank="isRank"
      />
    </div>
    <div class="productCard__detail">
      <div class="productCard__detail-title">
        {{ product.productName ? product.productName : product.gachaName }}
      </div>
      <div
        class="productCard__detail-content"
        v-if="product.description"
        v-html="product.description"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import ProductContentMain from '@/components/frontend/ProductContentMain.vue';
import ProductContentMall from '@/components/frontend/ProductContentMall.vue';
import MImage from '@/components/frontend/MImage.vue';

interface IproductCardProps {
  index?: number;
  product: any;
  customClass?: string;
  cardType?: string;
  isRank?: boolean;
}

defineProps<IproductCardProps>();
</script>

<style scoped>
/* Add your styles here */
</style>
