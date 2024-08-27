<template>
  <div :class="['productCard', customClass]">
    <div class="productCard__img">
      <img
        v-show="!isLoading"
        :src="product.imageUrls[0]"
        @error="handleImageError"
        @load="handleImageLoad"
        loading="lazy"
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
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
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
  (event.target as HTMLImageElement).src = p1;
  isLoading.value = false;
};

onMounted(() => {
  const img = new Image();
  img.src = pd1;
  img.onload = handleImageLoad;
  img.onerror = handleImageError;
});
</script>

<style scoped>
/* Add your styles here */
</style>
