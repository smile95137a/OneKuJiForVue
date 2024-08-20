<template>
  <div class="mall">
    <div class="mall__title">
      <div class="mall__text" data-text="商城">商城</div>
    </div>
    <div class="mall__btns">
      <div
        v-for="btn in buttonLabels"
        :key="btn.id"
        :class="['mall__btn', { 'mall__btn--active': activeBtn === btn.id }]"
      >
        {{ btn.label }}
      </div>
    </div>
    <Card customClass="card--mall">
      <template #header>
        <div class="mall__sort">
          <div class="mall__sort-btn">最新</div>
          <div class="mall__sort-btn">最熱銷</div>
          <div class="mall__sort-btn">
            價格低到高<i class="fa-solid fa-arrow-up-short-wide"></i>
          </div>
          <div class="mall__sort-btn">
            價格高到低<i class="fa-solid fa-arrow-up-wide-short"></i>
          </div>
        </div>
      </template>
      <div class="product__list">
        <div class="product__list-products">
          <ProductCard
            v-for="product in products"
            :key="product.productId"
            :product="product"
            :card-type="'mall'"
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
const buttonLabels: any[] = [
  { id: 'type1', label: '全部' },
  { id: 'type2', label: '日系品牌' },
  { id: 'type3', label: '美系品牌' },
  { id: 'type4', label: '模型' },
  { id: 'type5', label: '扭蛋' },
  { id: 'type6', label: '盒玩' },
  { id: 'type7', label: '一番賞' },
  { id: 'type8', label: '樂高/積木' },
  { id: 'type9', label: 'PVC人偶' },
  { id: 'type10', label: '日本景品' },
  { id: 'type11', label: '可動人偶' },
  { id: 'type12', label: '紙牌/桌遊' },
  { id: 'type13', label: '懷舊童玩' },
];

const activeBtn = 'type1';

const products = ref([
  {
    productId: 'p1',
    productName: 'Product 1',
    money: 100,
    spMoney: 100,
    imageUrl: '/path/to/product1.jpg',
  },
  {
    productId: 'p2',
    productName: 'Product 2',
    money: 100,
    spMoney: 100,
    imageUrl: '/path/to/product2.jpg',
  },
  {
    productId: 'p3',
    productName: 'Product 3',
    money: 100,
    spMoney: 100,
    imageUrl: '/path/to/product3.jpg',
  },
  {
    productId: 'p4',
    productName: 'Product 4',
    money: 100,
    spMoney: 100,
    imageUrl: '/path/to/product4.jpg',
  },
  {
    productId: 'p5',
    productName: 'Product 5',
    money: 100,
    spMoney: 100,
    imageUrl: '/path/to/product5.jpg',
  },
]);
</script>

<style scoped></style>
