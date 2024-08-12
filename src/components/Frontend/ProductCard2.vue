<template>
  <div
    :class="['productCard2', `productCard2--${product.grade.toLowerCase()}`]"
    @click="handleClick"
  >
    <div class="productCard2__img">
      <img :src="product.image" alt="productCard2 Image" />
      <div class="productCard2__img-pHeightText">{{ product.description }}</div>
      <div class="productCard2__img-detail">
        <div class="productCard2__img-balance">
          <p class="productCard2__text productCard2__text--title">
            {{ product.quantity }}
          </p>
          <p class="productCard2__text productCard2__text--num">
            {{ product.quantity }}
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
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

interface IProductCard2Props {
  product: any;
  customClass?: string;
}

defineProps<IProductCard2Props>();

const router = useRouter();

const handleClick = () => {
  router.push('/productDetail2');
};
</script>

<style scoped></style>
