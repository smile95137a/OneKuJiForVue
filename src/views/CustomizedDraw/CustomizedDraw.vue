<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import NoData from '@/components/common/NoData.vue';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { getAllCategories } from '@/services/frontend/productCategoryService';
import { getProductByType, IProduct } from '@/services/frontend/productService';
import { useLoadingStore } from '@/stores';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loadingStore = useLoadingStore();
const products = ref<IProduct[]>([]);
const title = ref('自製賞');
const searchTerm = ref('');
const loading = ref(false);
const page = ref(0);
const size = ref(20);
const allLoaded = ref(false);

const selectedTypes = ref<number[]>([]);
const categories = ref([]);

const filteredCategories = computed(() => {
  const pcategoryUUidArr = products.value
    .filter(
      (product) =>
        product.status === 'AVAILABLE' &&
        product.prizeCategory === buttonCategory
    )
    .map((product) => product.categoryUUid);

  return categories.value.filter((category) =>
    pcategoryUUidArr.includes(category.categoryUUid)
  );
});

const filteredProducts = computed(() => {
  return products.value.filter(
    (product) =>
      product.status === 'AVAILABLE' &&
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
  } catch (error) {
    console.error('加載產品時發生錯誤:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail1', params: { id: productId.toString() } });
};

onMounted(() => {
  fetchCategories();
});

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
      <div class="product__text" data-text="一番賞">一番賞</div>
    </div>
    <Card customClass="mcard--ichiban">
      <div class="product__list">
        <div class="product__list-title">
          <div class="product__list-btns">
            <label
              v-for="category in filteredCategories"
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
