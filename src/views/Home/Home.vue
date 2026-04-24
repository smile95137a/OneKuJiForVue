<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import NoData from '@/components/common/NoData.vue';
import MImage from '@/components/frontend/MImage.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { Banner, getAllBanners } from '@/services/frontend/bannerService'; // 引入 getAllBanners
import { getDisplayNews } from '@/services/frontend/newsService';
import {
  IProduct,
  queryProducts,
} from '@/services/frontend/productService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const prizeSelfProducts = ref<IProduct[]>([]);
const prizeProducts = ref<IProduct[]>([]);
const blindBoxProducts = ref<IProduct[]>([]);
const gachaProducts = ref<IProduct[]>([]);
const bannerList = ref<Banner[]>([]); // 保存 Banner 数据
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

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
    const [prizeRes, prizeSelfRes, blindBoxRes, gachaRes] = await Promise.all([
      queryProducts({
        productType: 'PRIZE',
        prizeCategory: 'FIGURE',
        status: 'AVAILABLE',
        page: 1,
        size: 9,
      }),
      queryProducts({
        productType: 'PRIZE',
        prizeCategory: 'PRIZESELF',
        status: 'AVAILABLE',
        page: 1,
        size: 9,
      }),
      queryProducts({
        productType: 'BLIND_BOX',
        status: 'AVAILABLE',
        page: 1,
        size: 9,
      }),
      queryProducts({
        productType: 'GACHA',
        status: 'AVAILABLE',
        page: 1,
        size: 9,
      }),
    ]);
    loadingStore.stopLoading();

    if (prizeRes.success) {
      prizeProducts.value = prizeRes.data.list;
    }

    if (prizeSelfRes.success) {
      prizeSelfProducts.value = prizeSelfRes.data.list;
    }

    if (blindBoxRes.success) {
      blindBoxProducts.value = blindBoxRes.data.list;
    }

    if (gachaRes.success) {
      gachaProducts.value = gachaRes.data.list;
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
const fetchDisplayNews = async () => {
  try {
    const { success, message, data } = await getDisplayNews();
    if (success) {
      if (data.length > 0) {
        dialogStore.openNewBannerDialog({
          newsList: data,
        });
      }
    } else {
      console.log(message);
    }
  } catch (error) {
    console.error('Error fetching display news:', error);
  }
};

onMounted(() => {
  fetchProducts();
  fetchBanners(); // 在组件挂载时获取 Banner 数据
  fetchDisplayNews();
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
        <MCardHeader title="自製賞" />
      </template>
      <div v-if="prizeSelfProducts.length === 0">
        <NoData />
      </div>
      <div v-else class="home__products">
        <ProductCard
          v-for="product in prizeSelfProducts"
          :key="product.productId"
          :product="product"
          @click="navigateToDetail(product)"
        />
      </div>
    </Card>
  </div>
</template>

<style scoped></style>
