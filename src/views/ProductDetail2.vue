<template>
  <div>
    <div class="breadcrumbs">
      <div class="breadcrumbs__items">
        <div class="breadcrumbs__item">首頁</div>
        <div class="breadcrumbs__item">扭蛋抽獎</div>
        <div class="breadcrumbs__item breadcrumbs__item--active">
          {{ product?.productName }}
        </div>
      </div>
    </div>
    <div class="product-detail">
      <div class="product-detail__main">
        <div class="product-detail__img">
          <img :src="product?.imageUrl" :alt="product?.productName" />
        </div>
        <div class="product-detail__title">
          <p class="product-detail__text">
            {{ product?.productName }}
          </p>
        </div>
        <div class="product-detail__other">
          <div
            v-for="(x, index) in productDetail"
            :key="index"
            class="product-detail__other-img"
          >
            <img :src="x.image" :alt="`Image ${index}`" />
          </div>
        </div>
      </div>

      <div class="product-detail__action">
        <div class="product-detail__price">
          <p class="product-detail__price-money">
            <span class="product-detail__text">{{ product?.price }}</span>
          </p>
          <p class="product-detail__price-unit">
            <span class="product-detail__text product-detail__text--icon"
              >金</span
            >
            <span class="product-detail__text">/抽</span>
          </p>
        </div>
        <div class="product-detail__action-btn" @click="handleDraw">開抽！</div>
      </div>
      <div class="product-detail__infos">
        <div class="product-detail__info product-detail__info--one">
          {{ product?.description }}
        </div>
        <div class="product-detail__info product-detail__info--two">
          {{ product?.description }}
        </div>
      </div>

      <div class="product-detail__likes">
        <div class="product-detail__likes-title">
          <p class="product-detail__text">你可能會喜歡</p>
        </div>
        <div class="product-detail__likes-products">
          <ProductCard
            v-for="(product, index) in productAll"
            :key="index"
            :product="product"
            :customClass="`productCard--style2 productCard--like`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDialogStore, useLoadingStore } from '@/stores';
import {
  getAllProducts,
  getProduct,
  getProductDetail,
  ProductDetail,
} from '@/services/Front/productService';
import { drawPrize } from '@/services/Front/drawService';
import { Product } from '@/services/Front/Frontapi';
import ProductCard from '@/components/Frontend/ProductCard.vue';

const route = useRoute();
const productId = ref(Number(route.params.id));
const product = ref<Product | null>(null);
const productDetail = ref<ProductDetail[] | null>(null);
const productAll = ref<any[] | null>(null);
const dialogStore = useDialogStore();
const loadingStore = useLoadingStore();

const fetchProduct = async (id: number) => {
  try {
    const data = await getProduct(id);
    if (data) {
      product.value = data;
    } else {
      throw new Error('Product not found');
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchProductDetail = async (id: number) => {
  try {
    const data = await getProductDetail(id);
    if (data) {
      productDetail.value = data;
    } else {
      throw new Error('Product not found');
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchAllProduct = async () => {
  try {
    const data = await getAllProducts();
    if (data) {
      const gachaList = data.filter(
        (x) =>
          x.productId !== product.value?.productId && x.productType === 'GACHA'
      );
      productAll.value = gachaList;
    } else {
      throw new Error('Product not found');
    }
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  loadingStore.startLoading();
  await fetchProduct(productId.value);
  await fetchProductDetail(productId.value);
  await fetchAllProduct();
  loadingStore.stopLoading();
});

watch(
  () => route.params.id,
  async (newId) => {
    loadingStore.startLoading();
    productId.value = Number(newId);
    await fetchProduct(productId.value);
    await fetchProductDetail(productId.value);
    await fetchAllProduct();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    loadingStore.stopLoading();
  }
);

const handleDraw = async () => {
  try {
    const {
      productId,
      productName,
      productType,
      prizeCategory,
      price,
      stockQuantity,
      soldQuantity,
    } = product.value!;
    const { productDetailId } = productDetail.value!;
    console.log(productDetail.value);

    loadingStore.startLoading();
    const { amount } = await drawPrize(
      1,
      {
        productDetailId,
        productName,
        productType,
        prizeCategory,
        amount: price,
        totalDrawCount: stockQuantity,
        remainingDrawCount: soldQuantity,
      },
      productId
    );
    loadingStore.stopLoading();
    await dialogStore.openOneKujiDialog({}, 'gacha');
    await dialogStore.openConfirmDialog(
      { customClass: '' },
      {
        remainingQuantity: 0,
        count: 1,
        total: amount,
      }
    );
  } catch (error) {
    alert('error');
    loadingStore.stopLoading();
  }
};
</script>

<style scoped></style>
