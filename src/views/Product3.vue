<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="">扭蛋</div>
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

    <Card title="扭蛋" customClass="mcard--home">
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
import { Product, queryProducts } from '@/services/Front/Frontapi';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const GACHAProducts = ref<Product[]>([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');

const fetchProducts = async () => {
  try {
    console.log('Fetching products for GACHA...');
    loading.value = true;
    const products = await queryProducts();
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

<style scoped>
.product3 {
  padding: 20px;
}

.product3__title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.product3__btns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.product3__btns-selects {
  display: flex;
  gap: 10px;
}

.product3__input {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 5px 10px;
}

.product3__input--select {
  cursor: pointer;
}

.product3__input-main {
  flex: 1;
}

.product3__input-icon {
  margin-left: 10px;
}

.product3__list-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product3__loading,
.product3__error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.product3__error {
  color: #ff4444;
}

input[type='text'] {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  outline: none;
}
</style>
