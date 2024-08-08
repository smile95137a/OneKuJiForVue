<template>
  <div class="product">
    <button @click="showOneKuJiDialog">點擊我</button>
    <div class="product__title">
      <div class="product__text" data-text="一番賞">一番賞</div>
    </div>
    <div class="product__btns">
      <div
        v-for="btn in buttons"
        :key="btn.type"
        :class="[
          'product__btn',
          { 'product__btn--active': activeBtn === btn.type },
        ]"
        @click="handleBtnClick(btn.type, btn.title)"
      >
        {{ btn.title }}
      </div>
    </div>

    <Card :title="title" customClass="mcard--home">
      <div class="product__list">
        <div class="product__list-title">
          <div class="product__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>

        <div v-if="loading" class="product__loading">加載中...</div>
        <div v-else-if="error" class="product__error">
          {{ error }}
        </div>
        <div v-else class="product__list-products">
          <ProductCard
            v-for="product in filteredProducts"
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
            @click="navigateToDetail(product.productId)"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import { queryProducts } from '@/services/Front/Frontapi';
import { useDialogStore } from '@/stores/dialogStore';
const dialogStore = useDialogStore();

const router = useRouter();
const products = ref([]);
const activeBtn = ref('official');
const title = ref('官方一番賞');
const loading = ref(true);
const error = ref('');

const buttons = [
  { type: 'official', title: '官方一番賞' },
  { type: '3c', title: '3C一番賞' },
  { type: 'bonus', title: '紅利賞' },
];

const filteredProducts = computed(() => {
  return products.value.filter(
    (product) =>
      product.productType === 'PRIZE' &&
      (activeBtn.value === 'official'
        ? product.prizeCategory === 'OFFICIAL'
        : activeBtn.value === '3c'
        ? product.prizeCategory === '3C'
        : product.prizeCategory === 'BONUS')
  );
});

const handleBtnClick = (btnType: string, btnTitle: string) => {
  activeBtn.value = btnType;
  title.value = btnTitle;
};

const showOneKuJiDialog = async () => {
  const result = await dialogStore.openOneKujiDialog({}, 'box');
  console.log(result);
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = '';
  try {
    console.log('Fetching products for PRIZE...');
    const response = await queryProducts();
    console.log('API response:', response);
    if (Array.isArray(response)) {
      products.value = response.filter(
        (product) => product.productType === 'PRIZE'
      );
    } else {
      throw new Error('API 返回的數據格式不正確');
    }
    console.log('PRIZE products:', products.value);
  } catch (err) {
    console.error('Error fetching PRIZE products:', err);
    error.value = '獲取產品數據時出錯，請稍後再試';
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'product-detail', params: { id: productId } });
};

const getProductStatus = (product) => {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};

onMounted(() => {
  console.log('Product component mounted, fetching products...');
  fetchProducts();
});
</script>

<style scoped>
.product {
  padding: 20px;
}

.product__list-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product__btn {
  cursor: pointer;
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.product__btn--active {
  background-color: #007bff;
  color: white;
}

.product__loading,
.product__error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.product__error {
  color: red;
}
</style>
