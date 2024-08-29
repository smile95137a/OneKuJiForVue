<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import NoData from '@/components/common/NoData.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import { computed, onMounted, ref } from 'vue';
import { getAllProduct, IProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);
const activeBtn = ref('official');
const title = ref('官方一番賞');

const buttons = [
  { type: 'official', title: '官方一番賞', category: 'FIGURE' },
  { type: '3c', title: '3C一番賞', category: 'C3' },
  { type: 'bonus', title: '紅利賞', category: 'BONUS' },
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
  try {
    loadingStore.startLoading();
    const { success, message, data } = await getAllProduct();
    loadingStore.stopLoading();
    if (success) {
      products.value = data;
    } else {
      console.log(message);
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
};
const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail1', params: { id: productId.toString() } });
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped></style>

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
        <MCardHeader :title="title" />
      </template>
      <div class="product__list">
        <div class="product__list-title">
          <div class="product__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>

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
