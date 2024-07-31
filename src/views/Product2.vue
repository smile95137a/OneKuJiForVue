<template>
  <div class="product2">
    <div class="product2__title">
      <div class="product2__text" data-text="盲盒">盲盒</div>
    </div>
    <div class="product2__btns">
      <div class="product2__btns-selects">
        <div class="product2__input product2__input--select">
          <div class="product2__input-main">全部狀態</div>
          <div class="product2__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
        <div class="product2__input product2__input--select">
          <div class="product2__input-main">全部廠商</div>
          <div class="product2__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
      </div>
      <div class="product2__btns-search">
        <div class="product2__input">
          <div class="product2__input-main">
            <input type="text" />
          </div>
          <div class="product2__input-icon font-size-28">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
    </div>

    <Card>
      <div class="product2__list">
        <div class="product2__list-title">
          <div class="product2__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>

        <div class="product2__list-products">
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
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import pImg from '@/assets/image/p.png';

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

const products1 = ref<Product[]>([
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
</script>

<style scoped></style>
