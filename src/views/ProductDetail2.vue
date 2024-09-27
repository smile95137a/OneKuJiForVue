<template>
  <div>
    <Breadcrumbs :items="breadcrumbItems" />
    <div class="product-detail">
      <div class="product-detail__main">
        <div class="product-detail__img">
          <MImage v-if="product" :src="product?.imageUrls[0]" />
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
            <MImage :src="x.imageUrls[0]" />
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
        <div
          class="product-detail__info product-detail__info--one"
          v-html="product?.description"
        ></div>
        <div
          class="product-detail__info product-detail__info--two"
          v-html="product?.description"
        ></div>
      </div>

      <div class="product-detail__likes" v-if="gachaList?.length > 0">
        <div class="product-detail__likes-title">
          <p class="product-detail__text">你可能會喜歡</p>
        </div>
        <div class="product-detail__likes-products">
          <ProductCard
            v-for="(product, index) in gachaList"
            :key="index"
            :product="product"
            :customClass="` productCard--like`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore, useDialogStore, useLoadingStore } from '@/stores';
import ProductCard from '@/components/frontend/ProductCard.vue';
import { PRODUCT_TYPE_LABELS } from '@/data/productTypeData';
import {
  getProductDetailById,
  IProductDetail,
} from '@/services/frontend/productDetailService';
import {
  getAllProduct,
  getProductById,
  IProduct,
} from '@/services/frontend/productService';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import MImage from '@/components/frontend/MImage.vue';
import { drawPrize, getDrawStatus } from '@/services/frontend/drawService';
import { getMappingById } from '@/services/frontend/recommendationService';

const route = useRoute();
const productId = Number(route.params.id);
const breadcrumbItems = ref([{ name: '首頁' }]);
const product = ref<IProduct | null>(null);
const productDetail = ref<IProductDetail[] | null>(null);
const gachaList = ref<IProduct[] | null>(null);
const dialogStore = useDialogStore();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const ticketList = ref<any[]>([]);
const remainingQuantity = computed(() => {
  if (!ticketList.value) {
    return 0;
  }
  return ticketList.value.filter((x) => !x.isDrawn).length;
});
onMounted(async () => {
  loadingStore.startLoading();
  try {
    const [
      productRes,
      productDetailRes,
      drawStatusResponse,
      allProductRes,
      recommendationRes,
    ] = await Promise.all([
      getProductById(productId),
      getProductDetailById(productId),
      getDrawStatus(productId),
      getAllProduct(),
      getAllProduct(),
    ]);

    if (productRes.data) {
      product.value = productRes.data;
      const { productType } = productRes.data;
      const productTypeLabel = PRODUCT_TYPE_LABELS[productType];
      if (productTypeLabel) {
        breadcrumbItems.value.push({ name: productTypeLabel });
      }
      breadcrumbItems.value.push({ name: productRes.data.productName });
    }

    if (productDetailRes.data) {
      productDetail.value = productDetailRes.data;
    }

    if (drawStatusResponse.data) {
      ticketList.value = drawStatusResponse.data.prizeNumberList;
    }

    if (recommendationRes.data) {
      console.log(recommendationRes.data);

      gachaList.value = recommendationRes.data;
    }
  } catch (err) {
    console.error('An error occurred:', err);
  }
  loadingStore.stopLoading();
});

const handleDraw = async () => {
  try {
    const { productId } = product.value!;
    loadingStore.startLoading();
    const { success, data } = await drawPrize(1, productId);
    const totalAmount = data.reduce(
      (sum: number, item: any) => sum + item.amount,
      0
    );

    loadingStore.stopLoading();
    if (success) {
      await dialogStore.openOneKujiDialog({}, 'gacha');
      await fetchDrawStatus();
      await dialogStore.openConfirmDialog(
        { customClass: '' },
        {
          remainingQuantity: remainingQuantity.value,
          count: 1,
          total: totalAmount,
        }
      );
    }
  } catch (error: any) {
    loadingStore.stopLoading();
    console.log(error);

    const errorMessage = error.response?.data?.message || '未知錯誤';
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: errorMessage,
    });
  }
};

const fetchDrawStatus = async () => {
  try {
    const { data } = await getDrawStatus(productId);

    if (data) {
      ticketList.value = data.prizeNumberList;
    } else {
      dialogStore.openInfoDialog({
        title: '系統通知',
        message: '系統錯誤',
      });
    }
  } catch (error: any) {
    const { message } = error.response.data;
    dialogStore.openInfoDialog({
      title: '系統通知',
      message,
    });
  }
};
</script>

<style scoped></style>
