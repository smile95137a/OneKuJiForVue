<template>
  <router-link :class="['productCard', customClass]" :to="getProductDetailLink">
    <div class="productCard__img">
      <img
        :src="product.imageUrl"
        alt="Product Card Image"
        @error="handleImageError"
      />
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
      <div class="productCard__detail-title">{{ product.productName }}</div>
      <div class="productCard__detail-content" v-if="product.description">
        {{ product.description }}
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';
import pd1 from '@/assets/image/pd1.png';
import ProductContentMain from '@/components/Frontend/ProductContentMain.vue';
import ProductContentMall from '@/components/Frontend/ProductContentMall.vue';

interface IproductCardProps {
  index?: number;
  product: any;
  customClass?: string;
  cardType?: string;
  isRank?: boolean;
}

const props = defineProps<IproductCardProps>();

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
  (event.target as HTMLImageElement).src = pd1;
};
</script>

<style scoped></style>
