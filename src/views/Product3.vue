<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="扭蛋抽獎">扭蛋抽獎</div>
    </div>

    <div class="product3__list">
      <div class="product3__list-products">
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import pImg from '@/assets/image/pd3.png';

interface Product {
  customClass: string;
  imagePath: string;
  imgStatus: string;
  balanceText: string;
  money: string;
  unitIcon: string;
  unitText: string;
  title: string;
  content: string;
}

const products1 = ref<Product[]>([
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '遊戲王桌上小物系列收藏(BOX)(隨機出貨)',
    content: '',
    customClass: 'productCard--style2 productCard--like',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '遊戲王桌上小物系列收藏(BOX)(隨機出貨)',
    content: '',
    customClass: 'productCard--style2 productCard--like',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '遊戲王桌上小物系列收藏(BOX)(隨機出貨)',
    content: '',
    customClass: 'productCard--style2 productCard--like',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '遊戲王桌上小物系列收藏(BOX)(隨機出貨)',
    content: '',
    customClass: 'productCard--style2 productCard--like',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '遊戲王桌上小物系列收藏(BOX)(隨機出貨)',
    content: '',
    customClass: 'productCard--style2 productCard--like',
  },
  {
    imagePath: pImg,
    imgStatus: '開抽中',
    balanceText: '剩餘100抽',
    money: '250',
    unitIcon: '金',
    unitText: '/抽',
    title: '遊戲王桌上小物系列收藏(BOX)(隨機出貨)',
    content: '',
    customClass: 'productCard--style2 productCard--like',
  },
]);
</script>

<style scoped></style>
