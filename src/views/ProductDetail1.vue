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
      <!-- <Card title="商品一覽" customClass="mcard--product-detail-one">
        <div class="product-detail-one__products">
          <ProductCard2
            v-for="(product, index) in products3"
            :key="index"
            :customClass="product.customClass"
            :imagePath="product.imagePath"
            :productHeightText="product.productHeightText"
            :balanceText="product.balanceText"
            :balanceNum="product.balanceNum"
            :title="product.title"
          />
        </div>
      </Card> -->

      <!-- <Card title="賞品介紹" customClass="mcard--product-detail-one">
        <div class="product-detail-one__productIntroduce">
          <div
            class="product-detail-one__productIntroduce-box product-detail-one__productIntroduce-box--one"
          >
            <div
              v-for="(product, index) in products4.filter(
                (_, index) => index % 2 !== 0
              )"
              :key="index"
              class="product-detail-one__productIntroduce-img"
            >
              <img :src="product.imagePath" alt="" />
            </div>
          </div>
          <div
            class="product-detail-one__productIntroduce-box product-detail-one__productIntroduce-box--two"
          >
            <div
              v-for="(product, index) in products4.filter(
                (_, index) => index % 2 === 0
              )"
              :key="index"
              class="product-detail-one__productIntroduce-img"
            >
              <img :src="product.imagePath" alt="" />
            </div>
          </div>
        </div>
      </Card> -->

      <!-- <Card title="檢視抽況" customClass="mcard--product-detail-one">
        <div class="product-detail-one__text">剩餘數量：31 / 總數量：40</div>
        <div class="product-detail-one__tickets">
          <div
            v-for="(product, index) in products5"
            :key="index"
            class="product-detail-one__tickets-img"
          >
            <img :src="product.imagePath" alt="" />
          </div>
        </div>
      </Card> -->

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
            @click="handleTicket(ticket)"
          >
            <img :src="ticket1" alt="" />
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
        <div
          class="product-detail-one__btn product-detail-one__btn--random"
          @click="showConfirmDialog"
        >
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
import ticket1 from '@/assets/image/ticket1.png';
import Card from '@/components/common/Card.vue';
import { useDialogStore } from '@/stores';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { Product } from '@/services/Front/Frontapi';
import { getProduct, getProductDetail } from '@/services/Front/productService';
import { executeDraw, getDrawStatus } from '@/services/Front/drawService';

const route = useRoute();
const productId = Number(route.params.id);
const product = ref<Product | null>(null);
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
const showConfirmDialog = async () => {
  const result = await dialogStore.openConfirmDialog();
  console.log(result);
};

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
  const data = await executeDraw(productId, 1, number);
  console.log(data);
};
</script>

<style scoped></style>
