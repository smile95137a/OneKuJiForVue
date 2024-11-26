<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import NoData from '@/components/common/NoData.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { getProductByType, IProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);
const searchTerm = ref('');
const loading = ref(false);
const page = ref(0);
const size = ref(20);
const allLoaded = ref(false);

const filteredProducts = computed(() => {
  return products.value.filter(
    (product) =>
      (product.status === 'AVAILABLE' ||
        product.status === 'NOT_AVAILABLE_YET') &&
      product.productName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const loadMoreProducts = async () => {
  if (allLoaded.value || loading.value) return;

  loading.value = true;
  try {
    loadingStore.startLoading();
    const { data } = await getProductByType('4');
    loadingStore.stopLoading();
    const newProducts = data;

    if (newProducts.length < size.value) {
      allLoaded.value = true;
    }

    products.value = [...products.value, ...newProducts];
    page.value++;
    loading.value = false;
  } catch (error) {
    console.error('加載產品時發生錯誤:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail1', params: { id: productId.toString() } });
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

<template>
  <div class="product">
    <div class="product__title">
      <div class="product__text" data-text="客製化抽獎">客製化抽獎</div>
    </div>
    <Card customClass="mcard--ichiban">
      <div class="product__list">
        <div v-if="filteredProducts.length === 0" class="product__no-data">
          <NoData />
        </div>
        <div v-else class="product__list-products">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.productId"
            :product="product"
            @click="navigateToDetail(product.productId)"
          />
        </div>
      </div>
    </Card>
  </div>
</template>
