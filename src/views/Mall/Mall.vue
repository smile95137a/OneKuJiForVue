<template>
  <div class="mall">
    <div class="mall__title">
      <div class="mall__text" data-text="商城">商城</div>
    </div>
    <div class="mall__btns">
      <label
        v-for="category in categories"
        :key="category.categoryId"
        class="mall__btn"
        :class="{
          'mall__btn--active': selectedTypes.includes(category.categoryId),
        }"
        :for="String(category.categoryId)"
      >
        <input
          type="checkbox"
          :value="category.categoryId"
          v-model="selectedTypes"
          @change="handleTypeChange"
          :id="String(category.categoryId)"
        />
        {{ category.categoryName }}
      </label>
    </div>
    <Card customClass="card--mall">
      <template #header>
        <div class="mall__sort">
          <div
            class="mall__sort-btn"
            :class="{ active: sortOrder === 'newest' }"
            @click="setSortOrder('newest')"
          >
            最新
          </div>
          <div
            class="mall__sort-btn"
            :class="{ active: sortOrder === 'price-asc' }"
            @click="setSortOrder('price-asc')"
          >
            價格低到高<i class="fa-solid fa-arrow-up-short-wide"></i>
          </div>
          <div
            class="mall__sort-btn"
            :class="{ active: sortOrder === 'price-desc' }"
            @click="setSortOrder('price-desc')"
          >
            價格高到低<i class="fa-solid fa-arrow-up-wide-short"></i>
          </div>
        </div>
      </template>
      <div class="product__list">
        <div class="product__list-products">
          <ProductCard
            v-for="(product, index) in showProducts"
            :key="index"
            :product="product"
            :card-type="'mall'"
            @click="goToProductDetail(product.productId)"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import {
  getPagedStoreProducts,
  IStoreProduct,
} from '@/services/frontend/storeProductService';
import {
  getAllCategories,
  IStoreCategory,
} from '@/services/frontend/storeCategoryService';

const products = ref<IStoreProduct[]>([]);
const showProducts = ref<IStoreProduct[]>([]);
const categories = ref<IStoreCategory[]>([]);
const loading = ref(false);
const page = ref(0);
const size = ref(20);
const allLoaded = ref(false);
const sortOrder = ref('newest');
const selectedTypes = ref<number[]>([]);
const router = useRouter();

const loadCategories = async () => {
  try {
    const { data } = await getAllCategories();
    categories.value = data;
  } catch (error) {
    console.error('獲取類別時發生錯誤:', error);
  }
};

const loadMoreProducts = async () => {
  if (allLoaded.value || loading.value) return;

  loading.value = true;
  try {
    const { data } = await getPagedStoreProducts(size.value, page.value);
    const newProducts = data;
    if (newProducts.length < size.value) {
      allLoaded.value = true;
    }

    products.value = [...products.value, ...newProducts];
    page.value++;

    filterAndSortProducts();
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

const setSortOrder = (order: string) => {
  sortOrder.value = order;
  filterAndSortProducts();
};

const handleTypeChange = () => {
  filterAndSortProducts();
};

const filterAndSortProducts = () => {
  let filteredProducts = products.value;

  if (selectedTypes.value.length > 0) {
    filteredProducts = filteredProducts.filter((product: IStoreProduct) =>
      selectedTypes.value.includes(~~product.categoryId)
    );
  }

  if (sortOrder.value === 'newest') {
    // filteredProducts.sort(
    //   (a: IStoreProduct, b: IStoreProduct) =>
    //     new Date(b.date).getTime() - new Date(a.date).getTime()
    // );
  } else if (sortOrder.value === 'bestseller') {
    // filteredProducts.sort(
    //   (a: IStoreProduct, b: IStoreProduct) => b.sales - a.sales
    // );
  } else if (sortOrder.value === 'price-asc') {
    filteredProducts.sort(
      (a: IStoreProduct, b: IStoreProduct) => a.specialPrice - b.specialPrice
    );
  } else if (sortOrder.value === 'price-desc') {
    filteredProducts.sort(
      (a: IStoreProduct, b: IStoreProduct) => b.specialPrice - a.specialPrice
    );
  }

  showProducts.value = filteredProducts;
};

const goToProductDetail = (productId: number) => {
  router.push({ name: 'MallProduct', params: { id: productId } });
};

onMounted(() => {
  loadCategories();
  window.addEventListener('scroll', handleScroll);
  loadMoreProducts();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
