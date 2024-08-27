<template>
  <div :class="['productCard', customClass]">
    <div class="productCard__img">
      <div v-if="isLoading" class="productCard__img-loader">
        <img :src="p1" loading="lazy" />
      </div>
      <img
        v-else
        :src="pd1"
        @error="handleImageError"
        @load="handleImageLoad"
        loading="lazy"
      />

      <img :src="pd1" alt="Product Card Image" @error="handleImageError" />
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
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import p1 from '@/assets/image/login.png';
import pd1 from '@/assets/image/pd1.png';
import ProductContentMain from '@/components/frontend/ProductContentMain.vue';
import ProductContentMall from '@/components/frontend/ProductContentMall.vue';

interface IproductCardProps {
  index?: number;
  product: any;
  customClass?: string;
  cardType?: string;
  isRank?: boolean;
}

defineProps<IproductCardProps>();
const isLoading = ref(true);

const handleImageLoad = () => {
  isLoading.value = false;
};

const handleImageError = (event: Event) => {
  console.error(
    'Image failed to load:',
    (event.target as HTMLImageElement).src
  );
  (event.target as HTMLImageElement).src = pd1;
  isLoading.value = false;
};
</script>

<style scoped></style>
