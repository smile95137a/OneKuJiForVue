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
import { IProduct, getAllProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);

const fetchProducts = async () => {
  try {
    loadingStore.startLoading();
    const { success, message, data } = await getAllProduct();
    loadingStore.stopLoading();
    if (success) {
      products.value = data
        .filter((product) => product.productType === 'GACHA')
        .map((product) => ({
          ...product,
        }));
    } else {
      console.log(message);
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail2', params: { id: productId.toString() } });
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped></style>
