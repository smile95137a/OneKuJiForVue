<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="扭蛋抽獎">扭蛋抽獎</div>
    </div>
    <NoData />
  </div>
</template>

<script lang="ts" setup>
import NoData from '@/components/common/NoData.vue';
import { getAllProducts } from '@/services/frontend/productService';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const GACHAProducts = ref<any[]>([]);

const fetchProducts = async () => {
  try {
    console.log('Fetching products for GACHA...');
    const products = await getAllProducts();
    GACHAProducts.value = products.filter(
      (product) => product.productType === 'GACHA'
    );
    console.log('GACHA products:', GACHAProducts.value);
  } catch (err) {
    console.error('Error fetching GACHA products:', err);
  } finally {
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
