<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="扭蛋">扭蛋</div>
    </div>
    <div class="product3__btns">
      <div class="product3__btns-selects">
        <div class="product3__input product3__input--select">
          <div class="product3__input-main">全部狀態</div>
          <div class="product3__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
        <div class="product3__input product3__input--select">
          <div class="product3__input-main">全部廠商</div>
          <div class="product3__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
      </div>
      <div class="product3__btns-search">
        <div class="product3__input">
          <div class="product3__input-main">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索 扭蛋..."
            />
          </div>
          <div class="product3__input-icon font-size-28">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
    </div>

    <Card customClass="mcard--home">
      <template #header>
        <MCardHeader title="扭蛋" />
      </template>
      <div class="product3__list">
        <div class="product3__list-title">
          <div class="product3__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>
        <div v-if="loading" class="product3__loading">載入中...</div>
        <div v-else-if="error" class="product3__error">{{ error }}</div>
        <div v-else class="product3__list-products">
          <ProductCard
            v-for="product in filteredGACHAProducts"
            :key="product.productId"
            :product="product"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';

import { getAllProducts } from '@/services/frontend/productService';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const GACHAProducts = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');

const fetchProducts = async () => {
  try {
    console.log('Fetching products for GACHA...');
    loading.value = true;
    const products = await getAllProducts();
    GACHAProducts.value = products.filter(
      (product) => product.productType === 'GACHA'
    );
    console.log('GACHA products:', GACHAProducts.value);
  } catch (err) {
    console.error('Error fetching GACHA products:', err);
    error.value = '獲取產品時出錯，請稍後再試';
  } finally {
    loading.value = false;
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

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail2', params: { id: productId.toString() } });
};

const filteredGACHAProducts = computed(() => {
  return GACHAProducts.value.filter(
    (product) =>
      product.productName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  console.log('Product3 component mounted, fetching products...');
  fetchProducts();
});
</script>

<style scoped></style>
