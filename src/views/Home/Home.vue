<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import NoData from '@/components/common/NoData.vue';
import MImage from '@/components/frontend/MImage.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { Banner, getAllBanners } from '@/services/frontend/bannerService'; // 引入 getAllBanners
import { getAllProduct, IProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
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
const bannerList = ref<Banner[]>([]); // 保存 Banner 数据
const loadingStore = useLoadingStore();

const goToProductDetail = (banner: Banner) => {
  router.push({
    name: `ProductDetail${
      ['PRIZE', 'BLIND_BOX', 'CUSTOMER_PRIZE'].includes(banner.productType)
        ? '1'
        : '2'
    }`,
    params: { id: banner.productId },
  });
};

const fetchProducts = async () => {
  try {
    loadingStore.startLoading();
    const { success, message, data } = await getAllProduct(0, 50);
    loadingStore.stopLoading();
    if (success) {
      const availableProducts = data
        .filter((p: IProduct) => p.status === 'AVAILABLE')
        .slice(0, 6);
      prizeProducts.value = availableProducts
        .filter((p: IProduct) => p.productType === 'PRIZE')
        .slice(0, 6);
      blindBoxProducts.value = availableProducts
        .filter((p: IProduct) => p.productType === 'BLIND_BOX')
        .slice(0, 6);
      gachaProducts.value = availableProducts
        .filter((p: IProduct) => p.productType === 'GACHA')
        .slice(0, 6);
    } else {
      console.log(message);
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
};

const fetchBanners = async () => {
  try {
    const { success, message, data } = await getAllBanners();
    if (success) {
      bannerList.value = data;
    } else {
      console.log(message);
    }
  } catch (error) {
    console.log('Error fetching banners:', error);
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
  fetchBanners(); // 在组件挂载时获取 Banner 数据
});
</script>

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
        <SwiperSlide
          v-for="banner in bannerList"
          :key="banner.bannerUid"
          @click="goToProductDetail(banner)"
        >
          <MImage :src="banner.imageUrls[0]" custom-class="slider__item-img" />
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
      <div v-else class="home__products">
        <ProductCard
          v-for="product in gachaProducts"
          :key="product.productId"
          :customClass="'productCard--style2'"
          :product="product"
          @click="navigateToDetail(product)"
        />
      </div>
    </Card>
  </div>
</template>

<style scoped></style>
