<template>
  <div class="home">
    <div class="slider">
      <Swiper
        :slidesPerView="1.5"
        :spaceBetween="30"
        :centeredSlides="true"
        navigation
        :modules="[Navigation]"
        class="mySwiper"
      >
        <SwiperSlide v-for="index in 7" :key="index">
          <div class="slider__item">
            <img :src="bg" class="slider__item-img" :alt="'Slide ' + index" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <Card customClass="mcard--home" v-if="prizeProducts.length > 0">
      <template #header>
        <MCardHeader title="一番賞" />
      </template>
      <div class="home__products">
        <ProductCard
          v-for="product in prizeProducts"
          :key="product.productId"
          :product="product"
        />
      </div>
    </Card>

    <Card customClass="mcard--home" v-if="blindBoxProducts.length > 0">
      <template #header>
        <MCardHeader title="盲盒" />
      </template>
      <div class="home__products">
        <ProductCard
          v-for="product in blindBoxProducts"
          :key="product.productId"
          :product="product"
        />
      </div>
    </Card>

    <Card customClass="mcard--home" v-if="gachaProducts.length > 0">
      <template #header>
        <MCardHeader title="扭蛋" />
      </template>
      <div class="home__products p-y-64">
        <ProductCard
          v-for="product in gachaProducts"
          :key="product.productId"
          :customClass="'productCard3--style2 m-y-36'"
          :product="product"
        />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import bg from '@/assets/image/bg1.jpeg';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';

import { getAllProducts } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import axios from 'axios';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref } from 'vue';

const prizeProducts = ref<any[]>([]);
const blindBoxProducts = ref<any[]>([]);
const gachaProducts = ref<any[]>([]);
const loadingStore = useLoadingStore();

const fetchProducts = async () => {
  try {
    loadingStore.startLoading();
    const products = await getAllProducts();
    loadingStore.stopLoading();
    prizeProducts.value = products.filter(
      (p: any) => p.productType === 'PRIZE'
    );
    blindBoxProducts.value = products.filter(
      (p: any) => p.productType === 'BLIND_BOX'
    );
    gachaProducts.value = products.filter(
      (p: any) => p.productType === 'GACHA'
    );
  } catch (error) {
    loadingStore.stopLoading();
    if (axios.isAxiosError(error)) {
      console.error('Config:', error.config);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.slider {
  width: 100%;
  overflow: hidden;
}
</style>
