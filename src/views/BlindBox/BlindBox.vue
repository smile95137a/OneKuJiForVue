<template>
  <div class="product2">
    <div class="product2__title">
      <div class="product2__text" data-text="盲盒">盲盒</div>
    </div>
    <div class="product2__btns">
      <div class="product2__btns-search">
        <div class="product2__input">
          <div class="product2__input-main">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="搜尋商品名稱"
            />
          </div>
          <div class="product2__input-icon font-size-28">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
    </div>

    <Card customClass="mcard--home">
      <template #header>
        <MCardHeader title="盲盒" />
      </template>
      <div class="product2__list">
        <div class="product2__list-title">
          <div class="product2__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="product__no-data">
          <NoData />
        </div>

        <div v-else class="product2__list-products">
          <ProductCard
            v-for="(product, index) in filteredProducts"
            :key="index"
            :product="product"
            @click="navigateToDetail(product.productId)"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import NoData from '@/components/common/NoData.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { IProduct, getAllProduct } from '@/services/frontend/productService';
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
  if (!searchTerm.value) {
    return products.value;
  }
  return products.value.filter(
    (product) =>
      product.status === 'AVAILABLE' &&
      product.productName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail1', params: { id: productId.toString() } });
};

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
      (p: IProduct) => p.status === 'AVAILABLE' && p.productType === 'BLIND_BOX'
    );

    products.value = [...products.value, ...availableGachaProducts];
    page.value++;
  } catch (error) {
    console.error('加載產品時發生錯誤:', error);
  } finally {
    loading.value = false;
  }
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
