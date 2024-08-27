<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="扭蛋抽獎">扭蛋抽獎</div>
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
import { IProduct, getAllProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/frontend/ProductCard.vue';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);

const fetchProducts = async () => {
  try {
    loadingStore.startLoading();
    const { success, message, data } = await getAllProduct();
    loadingStore.stopLoading();
    if (success) {
      products.value = data.filter(
        (product) => product.productType === 'GACHA'
      );
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
