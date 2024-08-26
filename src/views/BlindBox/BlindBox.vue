<template>
  <div class="product2">
    <div class="product2__title">
      <div class="product2__text" data-text="盲盒">盲盒</div>
    </div>
    <div class="product2__btns">
      <div class="product2__btns-selects">
        <MSelect :options="options1" v-model="selectedValue1" />
        <MSelect :options="options2" v-model="selectedValue2" />
      </div>
      <div class="product2__btns-search">
        <div class="product2__input">
          <div class="product2__input-main">
            <input type="text" />
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

        <div v-if="products.length === 0" class="product__no-data">
          <NoData />
        </div>

        <div v-else class="product2__list-products">
          <ProductCard
            v-for="(product, index) in products"
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
import ProductCard from '@/components/frontend/ProductCard.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import MSelect from '@/components/common/MSelect.vue';
import NoData from '@/components/common/NoData.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IProduct, getAllProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';

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
        .filter((product) => product.productType === 'BLIND_BOX')
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

const selectedValue1 = ref('');
const options1 = ref([
  { value: '', label: '全部狀態' },
  { value: '1', label: '選項1' },
  { value: '2', label: '選項2' },
]);
const selectedValue2 = ref('');
const options2 = ref([
  { value: '', label: '全部廠商' },
  { value: '1', label: '選項1' },
  { value: '2', label: '選項2' },
]);

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail1', params: { id: productId.toString() } });
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped></style>
