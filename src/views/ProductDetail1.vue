<template>
  <div class="product">
    <h1 class="product__title">一番賞</h1>
    <div class="product__btns">
      <button 
        v-for="btn in buttons" 
        :key="btn.type"
        :class="['product__btn', { 'product__btn--active': activeBtn === btn.type }]"
        @click="handleBtnClick(btn.type, btn.title)"
      >
        {{ btn.title }}
      </button>
    </div>

    <div class="product__list">
      <div class="product__list-header">
        <h2 class="product__list-title">{{ title }}</h2>
        <button class="product__list-filter">
          <i class="fa-solid fa-filter"></i>
        </button>
      </div>

      <div class="product__list-products">
        <div 
          v-for="product in products" 
          :key="product.productId" 
          class="product-card"
          @click="navigateToDetail(product.productId)"
        >
          <img :src="product.imageUrl" :alt="product.productName" class="product-card__image">
          <div class="product-card__status">{{ product.status }}</div>
          <div class="product-card__info">
            <h3 class="product-card__title">{{ product.productName }}</h3>
            <p class="product-card__description">{{ product.description }}</p>
            <div class="product-card__price">
              <span class="product-card__price-value">{{ product.price }}</span>
              <span class="product-card__price-unit">金/抽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { queryProducts } from '@/services/Front/Frontapi'; // 假設這是您的API函數

const router = useRouter();
const products = ref([]);
const activeBtn = ref('official');
const title = ref('官方一番賞');

const buttons = [
  { type: 'official', title: '官方一番賞' },
  { type: '3c', title: '3C一番賞' },
  { type: 'bonus', title: '紅利賞' }
];

const handleBtnClick = async (btnType: string, btnTitle: string) => {
  activeBtn.value = btnType;
  title.value = btnTitle;
  await fetchProducts(btnType);
};

const fetchProducts = async (type: string) => {
  try {
    const response = await queryProducts();
    // 這裡可能需要根據type過濾產品
    products.value = response.filter(product => product.productType === type);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'product-detail', params: { id: productId } });
};

onMounted(() => {
  fetchProducts('official');
});
</script>

<style scoped>
/* 這裡添加所需的CSS樣式 */
</style>