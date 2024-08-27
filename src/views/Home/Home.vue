<script lang="ts" setup>
import bg from '@/assets/image/bg1.jpeg';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import NoData from '@/components/common/NoData.vue';
import { getAllProduct, IProduct } from '@/services/frontend/productService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const prizeProducts = ref<IProduct[]>([]);
const blindBoxProducts = ref<IProduct[]>([]);
const gachaProducts = ref<IProduct[]>([]);
const loadingStore = useLoadingStore();
const fetchProducts = async () => {
  try {
    loadingStore.startLoading();
    const { success, message, data } = await getAllProduct();
    loadingStore.stopLoading();
    if (success) {
      prizeProducts.value = data.filter(
        (p: IProduct) => p.productType === 'PRIZE'
      );
      blindBoxProducts.value = data.filter(
        (p: IProduct) => p.productType === 'BLIND_BOX'
      );
      gachaProducts.value = data.filter(
        (p: IProduct) => p.productType === 'GACHA'
      );
    } else {
      console.log(message);
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
};
const navigateToDetail = (product: IProduct) => {
  const { productType, productId } = product;

  if (productType === 'PRIZE' || productType === 'BLIND_BOX') {
    router.push({
      name: 'ProductDetail1',
      params: { id: productId.toString() },
    });
  } else if (productType === 'GACHA') {
    router.push({
      name: 'ProductDetail2',
      params: { id: productId.toString() },
    });
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

<template>
  <div class="home">
    <div class="slider">
      <Swiper
        :slidesPerView="1.5"
        :spaceBetween="30"
        :centeredSlides="true"
        :loop="true"
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
        <MCardHeader title="一番賞" />
      </template>
      <div v-if="prizeProducts.length === 0">
        <NoData />
      </div>
      <div v-else class="home__products">
        <ProductCard
          v-for="product in prizeProducts"
          :key="product.productId"
          :product="product"
          @click="navigateToDetail(product)"
        />
      </div>
    </Card>

    <Card customClass="mcard--home">
      <template #header>
        <MCardHeader title="盲盒" />
      </template>
      <div v-if="blindBoxProducts.length === 0">
        <NoData />
      </div>
      <div v-else class="home__products">
        <ProductCard
          v-for="product in blindBoxProducts"
          :key="product.productId"
          :product="product"
          @click="navigateToDetail(product)"
        />
      </div>
    </Card>

    <Card customClass="mcard--home">
      <template #header>
        <MCardHeader title="扭蛋" />
      </template>
      <div v-if="gachaProducts.length === 0">
        <NoData />
      </div>
      <div v-else class="home__products p-y-64">
        <ProductCard
          v-for="product in gachaProducts"
          :key="product.productId"
          :customClass="'productCard--style2 m-y-36'"
          x
          :product="product"
          @click="navigateToDetail(product)"
        />
      </div>
    </Card>
  </div>
</template>
