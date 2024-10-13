<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="扭蛋">扭蛋</div>
    </div>
    <div class="product3__list">
      <div v-if="products.length === 0" class="product__no-data">
        <NoData />
      </div>

      <div v-else class="product3__list-products">
        <ProductCard
          v-for="(product, index) in products"
          :key="index"
          :product="product"
          @click="navigateToDetail(product.productId)"
          :customClass="'productCard--style2 productCard--like'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NoData from '@/components/common/NoData.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { IProduct, getAllProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);

const loading = ref(false);
const page = ref(0);
const size = ref(20);
const allLoaded = ref(false);

const loadMoreProducts = async () => {
  if (allLoaded.value || loading.value) return;

  loading.value = true;
  try {
    loadingStore.startLoading();
    const { data } = await getAllProduct(page.value, size.value);
    loadingStore.stopLoading();
    const newProducts = data;

    if (newProducts.length < size.value) {
      allLoaded.value = true;
    }
    const availableGachaProducts = newProducts.filter(
      (p: IProduct) => p.status === 'AVAILABLE' && p.productType === 'GACHA'
    );

    products.value = [...products.value, ...availableGachaProducts];
    page.value++;
  } catch (error) {
    loadingStore.stopLoading();
    console.error('加載產品時發生錯誤:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail2', params: { id: productId.toString() } });
};

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;

  if (scrollTop + clientHeight >= scrollHeight - 10 && !loading.value) {
    loadMoreProducts();
  }
};

const lockScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
  document.body.style.overflow = '';
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  loadMoreProducts();
});

onBeforeUnmount(() => {
  unlockScroll();
  window.removeEventListener('scroll', handleScroll);
});

watch(loading, (newValue) => {
  if (newValue) {
    lockScroll();
  } else {
    unlockScroll();
  }
});
</script>

<style scoped></style>
