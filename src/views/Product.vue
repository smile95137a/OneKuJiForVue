<template>
  <div class="product">
    <div class="product__title">
      <div class="product__text" data-text="一番賞">一番賞</div>
    </div>
    <div class="product__btns">
      <div
        class="product__btn"
        :class="{ 'product__btn--active': activeBtn === 'official' }"
        @click="handleBtnClick(products1, 'official', '官方一番賞')"
      >
        官方一番賞
      </div>
      <div
        class="product__btn"
        :class="{ 'product__btn--active': activeBtn === '3c' }"
        @click="handleBtnClick(products2, '3c', '3C一番賞')"
      >
        3C一番賞
      </div>
      <div
        class="product__btn"
        :class="{ 'product__btn--active': activeBtn === 'bonus' }"
        @click="handleBtnClick(products3, 'bonus', '紅利賞')"
      >
        紅利賞
      </div>
    </div>

    <Card>
      <div class="product__list">
        <div class="product__list-title">
          <div class="product__text">{{ title }}</div>
          <div class="product__list-filter"></div>
        </div>

        <div class="product__list-products">
          <ProductCard
            v-for="(product, index) in selectedProducts"
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
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import pImg from '@/assets/image/p.png';
import p2Img from '@/assets/image/3c1.png';
import p3Img from '@/assets/image/bo1.png';

interface Product {
  imagePath: string;
  imgStatus: string;
  balanceText: string;
  money: string;
  unitIcon: string;
  unitText: string;
  title: string;
  content: string;
  customClass: string;
}

const products1: Product[] = [
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
];

const products2: Product[] = [
  {
    imagePath: p2Img,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '《原神》 幽幽秘法系列毛絨地毯X御建鸣神主尊大御所大人像',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
];

const products3: Product[] = [
  {
    imagePath: p3Img,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '保證有 iPhone 15 Pro MAX 512G',
    content:
      '台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時、方便、公開！台灣最人氣【一番賞】線上抽選網站與日本0時差同步開抽！即時...',
    customClass: '',
  },
];

const selectedProducts = ref<Product[]>(products1);
const activeBtn = ref<string>('official');
const title = ref<string>('官方一番賞');

const handleBtnClick = (
  products: Product[],
  btnName: string,
  newTitle: string
) => {
  selectedProducts.value = products;
  activeBtn.value = btnName;
  title.value = newTitle;
};
</script>

<style scoped></style>
