<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import NoData from '@/components/common/NoData.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { getAllCategories } from '@/services/frontend/productCategoryService';
import { getAllProduct, IProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);
const activeBtn = ref('official');
const title = ref('官方一番賞');
const searchTerm = ref('');

const buttons = [
  { type: 'official', title: '官方一番賞', category: 'FIGURE' },
  { type: 'selfMade', title: '自製賞', category: 'PRIZESELF' },
  { type: '3c', title: '3C一番賞', category: 'C3' },
  { type: 'bonus', title: '紅利賞', category: 'BONUS' },
];

const selectedTypes = ref<number[]>([]);

const categories = ref([]);

const filteredProducts = computed(() => {
  const buttonCategory = buttons.find(
    (btn) => btn.type === activeBtn.value
  )?.category;

  return products.value.filter(
    (product) =>
      product.status === 'AVAILABLE' &&
      product.productType === 'PRIZE' &&
      product.prizeCategory === buttonCategory &&
      (selectedTypes.value.length === 0 ||
        selectedTypes.value.includes(product.categoryUUid)) &&
      product.productName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fetchCategories = async () => {
  try {
    loadingStore.startLoading();
    const { success, message, data } = await getAllCategories();
    loadingStore.stopLoading();
    if (success) {
      categories.value = data;
    } else {
      console.log(message);
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
};

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

// Navigate to product details
const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail1', params: { id: productId.toString() } });
};

// Fetch data and initialize component on mount
onMounted(() => {
  const queryType = router.currentRoute.value.query.type as string;
  const selectedButton = buttons.find((btn) => btn.type === queryType);
  if (selectedButton) {
    activeBtn.value = selectedButton.type;
    title.value = selectedButton.title;
  }

  fetchProducts();
  fetchCategories();
});
</script>

<style scoped></style>

<template>
  <div class="product">
    <div class="product__title">
      <div class="product__text" data-text="一番賞">一番賞</div>
    </div>
    <Card customClass="mcard--ichiban">
      <template #header>
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
      </template>
      <div class="product__list">
        <div class="product__list-title">
          <div class="product__list-btns">
            <label
              v-for="category in categories"
              :key="category.categoryUUid"
              class="product__list-btn"
              :class="{
                'product__list-btn--active': selectedTypes.includes(
                  category.categoryUUid
                ),
              }"
              :for="String(category.categoryUUid)"
            >
              <input
                type="checkbox"
                :value="category.categoryUUid"
                v-model="selectedTypes"
                @change="handleTypeChange"
                :id="String(category.categoryUUid)"
              />
              {{ category.categoryName }}
            </label>
          </div>
          <div class="product__list-search">
            <div class="product__input">
              <div class="product__input-main">
                <input
                  type="text"
                  v-model="searchTerm"
                  placeholder="搜尋商品名稱"
                />
              </div>
              <div class="product__input-icon font-size-28">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
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
