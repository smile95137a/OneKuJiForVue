<template>
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
  <div class="home">
    <Card title="一番賞" customClass="mcard--home">
      <div class="home__products">
        <ProductCard
          v-for="(product, index) in products1"
          :key="index"
          :customClass="product.customClass"
          :imagePath="product.imagePath"
          :imgStatus="product.imgStatus"
          :balanceText="product.balanceText"
          :money="product.money"
          :unitIcon="product.unitIcon"
          :unitText="product.unitText"
          :title="product.title"
          :content="product.content"
        />
      </div>
    </Card>
    <Card title="盲盒" customClass="mcard--home">
      <div class="home__products">
        <ProductCard
          v-for="(product, index) in products2"
          :key="index"
          :customClass="product.customClass"
          :imagePath="product.imagePath"
          :imgStatus="product.imgStatus"
          :balanceText="product.balanceText"
          :money="product.money"
          :unitIcon="product.unitIcon"
          :unitText="product.unitText"
          :title="product.title"
          :content="product.content"
        />
      </div>
    </Card>
    <Card title="扭蛋" customClass="mcard--home">
      <div class="home__products p-y-64">
        <ProductCard
          v-for="(product, index) in products3"
          :key="index"
          :customClass="product.customClass"
          :imagePath="product.imagePath"
          :imgStatus="product.imgStatus"
          :balanceText="product.balanceText"
          :money="product.money"
          :unitIcon="product.unitIcon"
          :unitText="product.unitText"
          :title="product.title"
          :content="product.content"
          :path="product.path"
        />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Navigation } from 'swiper/modules';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import bg from '@/assets/image/bg1.jpeg';
import pImg from '@/assets/image/p.png';
import pImg2 from '@/assets/image/pd3.png';

const products1 = ref([
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '[日版] 一番賞《HUNTER×HUNTER 獵人》REVENGE OF SCARLET',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '[日版] 一番賞《HUNTER×HUNTER 獵人》REVENGE OF SCARLET',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '[日版] 一番賞《HUNTER×HUNTER 獵人》REVENGE OF SCARLET',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '[日版] 一番賞《HUNTER×HUNTER 獵人》REVENGE OF SCARLET',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '[日版] 一番賞《HUNTER×HUNTER 獵人》REVENGE OF SCARLET',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '[日版] 一番賞《HUNTER×HUNTER 獵人》REVENGE OF SCARLET',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上',
    customClass: '',
  },
]);

const products2 = ref([
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《我的英雄學院》~闖入~(日版)',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《我的英雄學院》~闖入~(日版)',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《我的英雄學院》~闖入~(日版)',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《我的英雄學院》~闖入~(日版)',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《我的英雄學院》~闖入~(日版)',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《我的英雄學院》~闖入~(日版)',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
]);

const products3 = ref([
  {
    imagePath: pImg2,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '大耳狗拿鐵色動物造型吊飾',
    content: '',
    customClass: 'productCard3--style2 m-y-36',
    path: '1',
  },
  {
    imagePath: pImg2,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '大耳狗拿鐵色動物造型吊飾',
    content: '',
    customClass: 'productCard3--style2 m-y-36',
    path: '1',
  },
  {
    imagePath: pImg2,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '大耳狗拿鐵色動物造型吊飾',
    content: '',
    customClass: 'productCard3--style2 m-y-36',
    path: '1',
  },
  {
    imagePath: pImg2,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '大耳狗拿鐵色動物造型吊飾',
    content: '',
    customClass: 'productCard3--style2 m-y-36',
    path: '1',
  },
  {
    imagePath: pImg2,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '大耳狗拿鐵色動物造型吊飾',
    content: '',
    customClass: 'productCard3--style2 m-y-36',
    path: '1',
  },
  {
    imagePath: pImg2,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '大耳狗拿鐵色動物造型吊飾',
    content: '',
    customClass: 'productCard3--style2 m-y-36',
    path: '1',
  },
]);
</script>

<style scoped></style>
