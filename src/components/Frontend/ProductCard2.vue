<template>
  <div :class="['productCard2', customClass]" @click="handleClick">
    <div class="productCard2__img">
      <img :src="imagePath" alt="productCard2 Image" />
      <div class="productCard2__img-pHeightText">{{ productHeightText }}</div>
      <div class="productCard2__img-detail">
        <div class="productCard2__img-balance">
          <p class="productCard2__text productCard2__text--title">
            {{ balanceText }}
          </p>
          <p class="productCard2__text productCard2__text--num">
            {{ balanceNum }}
          </p>
        </div>
      </div>
    </div>
    <div class="productCard2__detail">
      <div class="productCard2__detail-title">{{ title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

interface IProductCard2Props {
  customClass?: string;
  imagePath: string;
  imgStatus?: string;
  balanceText?: string;
  balanceNum?: string;
  title?: string;
  productHeightText?: string;
}

const props = defineProps<IProductCard2Props>();
console.log(props)

const router = useRouter();

const handleClick = () => {
  router.push('/productDetail2');
};
</script>

<style scoped></style>
