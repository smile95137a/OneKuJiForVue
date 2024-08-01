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
    
    <Card title="一番賞" customClass="mcard--home">
      <div class="home__products">
        <ProductCard
          v-for="product in prizeProducts"
          :key="product.productId"
          :customClass="''"
          :imagePath="product.imageUrl"
          :imgStatus="getProductStatus(product)"
          :balanceText="`剩餘${product.stockQuantity}抽`"
          :money="product.price.toString()"
          :unitIcon="'金'"
          :unitText="'/抽'"
          :title="product.productName"
          :content="product.description"
        />
      </div>
    </Card>
    
    <Card title="盲盒" customClass="mcard--home">
      <div class="home__products">
        <ProductCard
          v-for="product in blindBoxProducts"
          :key="product.productId"
          :customClass="''"
          :imagePath="product.imageUrl"
          :imgStatus="getProductStatus(product)"
          :balanceText="`剩餘${product.stockQuantity}抽`"
          :money="product.price.toString()"
          :unitIcon="'金'"
          :unitText="'/抽'"
          :title="product.productName"
          :content="product.description"
        />
      </div>
    </Card>
    
    <Card title="扭蛋" customClass="mcard--home">
      <div class="home__products p-y-64">
        <ProductCard
          v-for="product in gachaProducts"
          :key="product.productId"
          :customClass="'productCard3--style2 m-y-36'"
          :imagePath="product.imageUrl"
          :imgStatus="getProductStatus(product)"
          :balanceText="`剩餘${product.stockQuantity}抽`"
          :money="product.price.toString()"
          :unitIcon="'金'"
          :unitText="'/抽'"
          :title="product.productName"
          :content="product.description"
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
import axios from 'axios';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref } from 'vue';

const prizeProducts = ref<Product[]>([]);
const blindBoxProducts = ref<Product[]>([]);
const gachaProducts = ref<Product[]>([]);

const fetchProducts = async () => {
  try {
    console.log('Fetching products...');
    const products = await queryProducts();
    console.log('Products fetched:', products);
    
    prizeProducts.value = products.filter((p: Product) => p.productType === 'PRIZE');
    blindBoxProducts.value = products.filter((p: Product) => p.productType === 'BLIND_BOX');
    gachaProducts.value = products.filter((p: Product) => p.productType === 'GACHA');

    console.log('Prize products:', prizeProducts.value);
    console.log('Blind box products:', blindBoxProducts.value);
    console.log('Gacha products:', gachaProducts.value);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching products:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Config:', error.config);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

const getProductStatus = (product: Product): string => {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};

onMounted(() => {
  console.log('Component mounted, fetching products...');
  fetchProducts();
});
</script>

<style scoped>
.slider {
  width: 100%;
  overflow: hidden;
}

.home {
  padding: 20px;
}

.home__products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>