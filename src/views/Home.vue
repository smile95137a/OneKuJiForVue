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

    <Card customClass="mcard--home">
      <template #header>
        <p class="mcard__text">一番賞</p>
      </template>

      <div class="home__products">
        <ProductCard
          v-for="product in prizeProducts"
          :key="product.productId"
          :product="product"
        />
      </div>
    </Card>

    <Card customClass="mcard--home">
      <template #header>
        <p class="mcard__text">盲盒</p>
      </template>
      <div class="home__products">
        <ProductCard
          v-for="product in blindBoxProducts"
          :key="product.productId"
          :product="product"
        />
      </div>
    </Card>

    <Card customClass="mcard--home">
      <template #header>
        <p class="mcard__text">扭蛋</p>
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
import { Product, queryProducts } from '@/services/Front/Frontapi';
import { useLoadingStore } from '@/stores';
import axios from 'axios';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref } from 'vue';

const prizeProducts = ref<Product[]>([]);
const blindBoxProducts = ref<Product[]>([]);
const gachaProducts = ref<Product[]>([]);
const loadingStore = useLoadingStore();

const fetchProducts = async () => {
  try {
    loadingStore.startLoading();
    const products = await queryProducts();
    loadingStore.stopLoading();
    prizeProducts.value = products.filter(
      (p: Product) => p.productType === 'PRIZE'
    );
    blindBoxProducts.value = products.filter(
      (p: Product) => p.productType === 'BLIND_BOX'
    );
    gachaProducts.value = products.filter(
      (p: Product) => p.productType === 'GACHA'
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
