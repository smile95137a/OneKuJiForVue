<template>
  <div class="product">
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

    <Card customClass="mcard--home">
      <template #header>
        <div class="flex items-center justify-center">
          <p class="mcard__text">{{ title }}</p>
        </div>
      </template>
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
        <div v-else-if="filteredProducts.length === 0" class="product__no-data">
          沒有找到相關產品
        </div>
        <div v-else class="product__list-products">
          <ProductCard
            v-for="product in filteredProducts"
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
import { queryProducts } from '@/services/front/Frontapi';
import { useDialogStore } from '@/stores/dialogStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const dialogStore = useDialogStore();
const router = useRouter();
const products = ref([]);
const activeBtn = ref('official');
const title = ref('官方一番賞');
const loading = ref(true);
const error = ref('');

const buttons = [
  { type: 'official', title: '官方一番賞', category: '一番賞' },
  { type: '3c', title: '3C一番賞', category: '家電一番賞' },
  { type: 'bonus', title: '紅利賞', category: '紅利一番賞' },
];

const filteredProducts = computed(() => {
  const buttonCategory = buttons.find(
    (btn) => btn.type === activeBtn.value
  )?.category;
  return products.value.filter(
    (product) =>
      product.productType === 'PRIZE' &&
      product.prizeCategory === buttonCategory
  );
});

const handleBtnClick = (btnType: string, btnTitle: string) => {
  activeBtn.value = btnType;
  title.value = btnTitle;
};

const fetchProducts = async () => {
  if (products.value.length > 0) return;
  loading.value = true;
  error.value = '';
  try {
    const response = await queryProducts();
    if (Array.isArray(response)) {
      products.value = response
        .filter((product) => product.productType === 'PRIZE')
        .map((product) => ({
          ...product,
          imageUrl: ensureFullImageUrl(product.imageUrl),
        }));

      console.log('1231231', products.value);
    } else {
      throw new Error('API 返回的數據格式不正確');
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = '獲取產品數據時出錯，請稍後再試';
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'productDetail1', params: { id: productId.toString() } });
};

const getProductStatus = (product) => {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};

const ensureFullImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
  return `https://3574-2402-7500-4dc-948-7df7-96b-239b-ae80.ngrok-free.app${
    url.startsWith('/') ? '' : '/'
  }${url}`;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped></style>
