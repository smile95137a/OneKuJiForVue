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

      <Card title="商品一覽" customClass="mcard--product-detail-one">
        <div class="product-detail-one__products">
          <ProductCard2
            v-for="(product, index) in productDetail"
            :key="index"
            :customClass="`productCard2--${product.grade.toLowerCase()}`"
            :imagePath="product.image"
            :productHeightText="product.description"
            :balanceText="product.quantity"
            :balanceNum="product.quantity"
            :title="product.productName"
          />
        </div>
      </Card>

      <Card title="賞品介紹" customClass="mcard--product-detail-one">
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

      <Card title="檢視抽況" customClass="mcard--product-detail-one">
        <div class="product-detail-one__text">
          剩餘數量：{{ remainingQuantity }} / 總數量：{{ ticketList?.length }}
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
      <router-link class="product-detail-one__backBtn" to="/product">
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
import ticketImgA from '@/assets/image/ticketF.png';
import ticketImgB from '@/assets/image/ticketB.png';
import ticketImgC from '@/assets/image/ticketC.png';
import ticketImgD from '@/assets/image/ticketF.png';
import ticketImgE from '@/assets/image/ticketE.png';
import ticketImgF from '@/assets/image/ticketF.png';
import ticketImgG from '@/assets/image/ticketF.png';
import Card from '@/components/common/Card.vue';
import { useDialogStore } from '@/stores';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { Product } from '@/services/Front/Frontapi';
import {
  getProduct,
  getProductDetail,
  ProductDetail,
} from '@/services/Front/productService';
import { executeDraw, getDrawStatus } from '@/services/Front/drawService';
import ProductCard2 from '@/components/Frontend/ProductCard2.vue';
const route = useRoute();
const productId = Number(route.params.id);
const product = ref<Product | null>(null);
const productDetail = ref<ProductDetail[] | null>(null);
const ticketList = ref<any[]>([]);
const activeTicket = ref<any | null>(null);

const fetchProduct = async () => {
  try {
    const data = await getProduct(productId);
    if (data) {
      product.value = data;
    } else {
      throw new Error('Product not found');
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchProductDetail = async () => {
  try {
    const data = await getProductDetail(productId);
    if (data) {
      productDetail.value = data;
    } else {
      throw new Error('Product not found');
    }
  } catch (err) {
    console.error(err);
  }
};

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

onMounted(() => {
  fetchProductDetail();
  fetchProduct();
  fetchDrawStatus();
});

const dialogStore = useDialogStore();

const remainingQuantity = computed(() => {
  return ticketList.value
    ? ticketList.value.filter((x) => !x.isDrawn).length
    : 0;
});

const handleTicket = (ticket: any) => {
  activeTicket.value = ticket;
};
const handleExchange = async () => {
  const { productId, number } = activeTicket.value;
  await dialogStore.openOneKujiDialog({}, 'ticket');
  const { amount } = await executeDraw(productId, 1, number);
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
