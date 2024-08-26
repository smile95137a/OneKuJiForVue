<template>
  <div>
    <Breadcrumbs :items="breadcrumbItems" />
    <div class="product-detail-one">
      <div class="product-detail-one__main">
        <div class="product-detail-one__img">
          <img :src="product?.imageUrl" :alt="product?.productName" />
        </div>
        <div class="product-detail-one__title">
          <p class="product-detail-one__text">
            {{ product?.productName }}
          </p>
        </div>
        <div class="product-detail-one__action">
          <div class="product-detail-one__price">
            <p class="product-detail-one__price-money">
              <span class="product-detail-one__text">{{ product?.price }}</span>
            </p>
            <p class="product-detail-one__price-unit">
              <span
                class="product-detail-one__text product-detail-one__text--icon"
              >
                金
              </span>
              <span class="product-detail-one__text">/抽</span>
            </p>
          </div>
          <div class="product-detail-one__action-btns">
            <div class="product-detail-one__action-btn">開抽！</div>
            <div
              class="product-detail-one__action-btn product-detail-one__action-btn--status"
            >
              <img :src="btnIcon" alt="" />
              <span>檢視抽況</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product-detail-one__infos">
        <div class="product-detail-one__info product-detail-one__info--one">
          {{ product?.description }}
        </div>
        <div class="product-detail-one__info product-detail-one__info--two">
          {{ product?.description }}
        </div>
      </div>

      <Card customClass="mcard--product-detail-one">
        <template #header>
          <MCardHeader title="商品一覽" />
        </template>
        <div class="product-detail-one__products">
          <ProductCard2
            v-for="(product, index) in productDetail"
            :key="index"
            :product="product"
          />
        </div>
      </Card>

      <Card customClass="mcard--product-detail-one">
        <template #header>
          <MCardHeader title="賞品介紹" />
        </template>
        <div class="product-detail-one__productIntroduce">
          <div
            class="product-detail-one__productIntroduce-box product-detail-one__productIntroduce-box--one"
          >
            <div
              v-for="(product, index) in productDetail?.filter(
                (_, index) => index % 2 !== 0
              )"
              :key="index"
              class="product-detail-one__productIntroduce-img"
            >
              <img :src="product.image" alt="" />
            </div>
          </div>
          <div
            class="product-detail-one__productIntroduce-box product-detail-one__productIntroduce-box--two"
          >
            <div
              v-for="(product, index) in productDetail?.filter(
                (_, index) => index % 2 === 0
              )"
              :key="index"
              class="product-detail-one__productIntroduce-img"
            >
              <img :src="product.image" alt="" />
            </div>
          </div>
        </div>
      </Card>

      <Card customClass="mcard--product-detail-one">
        <template #header>
          <MCardHeader title="檢視抽況" />
        </template>
        <div class="product-detail-one__text">
          剩餘數量：{{ remainingQuantity }} / 總數量：{{ ~~ticketList?.length }}
        </div>
        <div class="product-detail-one__boxs">
          <div
            v-for="(ticket, index) in ticketList"
            :key="index"
            :class="[
              'product-detail-one__boxs-img',
              ticket.prizeNumberId === activeTicket?.prizeNumberId
                ? 'product-detail-one__boxs-img--active'
                : '',
            ]"
            @click="!ticket.isDrawn ? handleTicket(ticket) : null"
          >
            <img :src="getTicketImg(ticket)" alt="" />
          </div>
        </div>
      </Card>
    </div>

    <div class="product-detail-one__backBtns">
      <router-link class="product-detail-one__backBtn" to="/ichiban">
        返回一番賞
      </router-link>
    </div>
    <div class="product-detail-one__option">
      <div class="product-detail-one__btns">
        <div
          class="product-detail-one__btn product-detail-one__btn--exchange"
          @click="handleExchange"
        >
          立即兌換
        </div>
        <div class="product-detail-one__btn product-detail-one__btn--random">
          隨機選擇
        </div>
        <div class="product-detail-one__btn product-detail-one__btn--im">
          返回
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import boxClose from '@/assets/image/box-close.png';
import boxOpen from '@/assets/image/box-open.png';
import btnIcon from '@/assets/image/btn-icon.png';
import ticketImg from '@/assets/image/ticket.png';
import ticketImgA from '@/assets/image/ticket_A.png';
import ticketImgB from '@/assets/image/ticket_B.png';
import ticketImgC from '@/assets/image/ticket_C.png';
import ticketImgD from '@/assets/image/ticket_D.png';
import ticketImgE from '@/assets/image/ticket_E.png';
import ticketImgF from '@/assets/image/ticket_F.png';
import ticketImgG from '@/assets/image/ticket_G.png';
import Card from '@/components/common/Card.vue';
import { useDialogStore, useLoadingStore } from '@/stores';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import ProductCard2 from '@/components/frontend/ProductCard2.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import { getProductById } from '@/services/frontend/productService';
import { getDrawStatus, executeDraw } from '@/services/frontend/drawService';
import {
  getProductDetailById,
  IProductDetail,
} from '@/services/frontend/productDetailService';
import { PRODUCT_TYPE_LABELS } from '@/data/productTypeData';

const route = useRoute();
const productId = Number(route.params.id);
const breadcrumbItems = ref([{ name: '首頁' }]);
const product = ref<any | null>(null);
const productDetail = ref<IProductDetail[] | null>(null);
const ticketList = ref<any[]>([]);
const activeTicket = ref<any | null>(null);
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const remainingQuantity = computed(() => {
  if (!ticketList.value) {
    return 0;
  }
  return ticketList.value.filter((x) => !x.isDrawn).length;
});

onMounted(async () => {
  loadingStore.startLoading();
  try {
    const [productResponse, productDetailResponse, drawStatusResponse] =
      await Promise.all([
        getProductById(productId),
        getProductDetailById(productId),
        getDrawStatus(productId),
      ]);

    if (productResponse.data) {
      product.value = productResponse.data;
      const { productType } = productResponse.data;
      const productTypeLabel = PRODUCT_TYPE_LABELS[productType];
      if (productTypeLabel) {
        breadcrumbItems.value.push({ name: productTypeLabel });
      }
      breadcrumbItems.value.push({ name: productResponse.data.productName });
      console.log(breadcrumbItems.value);
    }

    if (productDetailResponse.data) {
      productDetail.value = productDetailResponse.data;
    }
    if (drawStatusResponse) {
      ticketList.value = drawStatusResponse.data;
    }
  } catch (err) {
    console.error('An error occurred:', err);
  }
  loadingStore.stopLoading();
});

const fetchDrawStatus = async () => {
  try {
    const data = await getDrawStatus(productId);
    if (data) {
      ticketList.value = data;
    } else {
      throw new Error('Draw status not found');
    }
  } catch (err) {
    console.error(err);
  }
};

const handleTicket = (ticket: any) => {
  activeTicket.value = ticket;
};

const handleExchange = async () => {
  const { productType } = product.value;
  const { productId, number } = activeTicket.value;
  loadingStore.startLoading();
  const { amount } = await executeDraw(productId, 1, number);

  loadingStore.stopLoading();
  await dialogStore.openOneKujiDialog(
    {},
    productType === 'PRIZE' ? 'ticket' : 'box'
  );
  activeTicket.value = null;
  fetchDrawStatus();
  await dialogStore.openConfirmDialog(
    { customClass: '' },
    {
      remainingQuantity: remainingQuantity.value - 1,
      count: 1,
      total: amount,
    }
  );
};

const getTicketImg = (ticket: any) => {
  const { productType } = product.value;
  const { grade, isDrawn } = ticket;

  if (productType === 'PRIZE') {
    const ticketImages: Record<string, string> = {
      A: ticketImgA,
      B: ticketImgB,
      C: ticketImgC,
      D: ticketImgD,
      E: ticketImgE,
      F: ticketImgF,
      G: ticketImgG,
    };

    return isDrawn ? ticketImages[grade] || ticketImg : ticketImg;
  } else {
    return isDrawn ? boxOpen : boxClose;
  }
};
</script>

<style scoped></style>
