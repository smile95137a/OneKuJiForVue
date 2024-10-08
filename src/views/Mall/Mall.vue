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
            :class="{ active: sortOrder === 'bestseller' }"
            @click="setSortOrder('bestseller')"
          >
            最熱銷
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
            @click="goToProductDetail(product.productCode)"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import {
  getAllCategories,
  IStoreCategory,
} from '@/services/frontend/storeCategoryService';
import {
  getPagedStoreProducts,
  IStoreProduct,
} from '@/services/frontend/storeProductService';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const products = ref<any[]>([]);
const showProducts = ref<any[]>([]);
const categories = ref<IStoreCategory[]>([]);
const loading = ref(false);
const page = ref(0);
const size = ref(20);
const allLoaded = ref(false);
const sortOrder = ref('newest');
const selectedTypes = ref<number[]>([0]);
const router = useRouter();

const loadCategories = async () => {
  try {
    const { data } = await getAllCategories();
    const allCategory: IStoreCategory = {
      categoryId: 0,
      categoryName: '全部',
    };
    categories.value = [allCategory, ...data];
  } catch (error) {
    console.error('獲取類別時發生錯誤:', error);
  }
};

const loadMoreProducts = async () => {
  if (allLoaded.value || loading.value) return;

  loading.value = true;
  try {
    const { data } = await getPagedStoreProducts(page.value, size.value);
    const newProducts = data.filter(
      (product) => product.status === 'AVAILABLE'
    );

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

  if (selectedTypes.value.length > 0 && !selectedTypes.value.includes(0)) {
    filteredProducts = filteredProducts.filter((product: IStoreProduct) =>
      selectedTypes.value.includes(~~product.categoryId)
    );
  }

  if (sortOrder.value === 'newest') {
    filteredProducts.sort(
      (a: IStoreProduct, b: IStoreProduct) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortOrder.value === 'bestseller') {
    filteredProducts.sort((a: any, b: any) => ~~b.popularity - ~~a.popularity);
  } else if (sortOrder.value === 'price-asc') {
    filteredProducts.sort((a: any, b: any) => {
      const priceA = a.isSpecialPrice ? a.specialPrice : a.price;
      const priceB = b.isSpecialPrice ? b.specialPrice : b.price;
      return priceA - priceB;
    });
  } else if (sortOrder.value === 'price-desc') {
    filteredProducts.sort((a: any, b: any) => {
      const priceA = a.isSpecialPrice ? a.specialPrice : a.price;
      const priceB = b.isSpecialPrice ? b.specialPrice : b.price;
      return priceB - priceA;
    });
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

const lockScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
  document.body.style.overflow = '';
};
</script>
