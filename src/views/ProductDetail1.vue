<template>
  <div>
    <Breadcrumbs :items="breadcrumbItems" />
    <div class="product-detail-one">
      <div class="product-detail-one__main">
        <div class="product-detail-one__img">
          <MImage :src="product?.imageUrls[0]" />
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
            <div
              class="product-detail-one__action-btn"
              @click="scrollToIntroduce(true)"
            >
              開抽！
            </div>
            <div
              class="product-detail-one__action-btn product-detail-one__action-btn--status"
              @click="scrollToIntroduce()"
            >
              <img :src="btnIcon" alt="" />
              <span>檢視抽況</span>
            </div>
          </div>
        </div>
      </div>

      <div class="product-detail-one__infos">
        <div
          class="product-detail-one__info product-detail-one__info--one"
          v-html="product?.description"
        ></div>
        <div
          class="product-detail-one__info product-detail-one__info--two"
          v-html="product?.description"
        ></div>
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
              <MImage :src="product.imageUrls[0]" />
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
              <MImage :src="product.imageUrls[0]" />
            </div>
          </div>
        </div>
      </Card>

      <Card customClass="mcard--product-detail-one">
        <template #header>
          <MCardHeader title="檢視抽況" />
        </template>
        <div class="product-detail-one__text" ref="introduceSection">
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
    <div class="product-detail-one__option" v-if="showOption">
      <div class="product-detail-one__random" v-if="showOptionRandom">
        <div class="product-detail-one__random-inputs">
          <input
            type="number"
            class="product-detail-one__random-input"
            placeholder="輸入自訂數量"
            step="1"
            min="1"
          />
          <div class="product-detail-one__random-btn">自選隨機</div>
        </div>
        <div class="product-detail-one__random-list">
          <div class="product-detail-one__random-list-item">1</div>
          <div class="product-detail-one__random-list-item">3</div>
          <div class="product-detail-one__random-list-item">5</div>
          <div class="product-detail-one__random-list-item">10</div>
        </div>
      </div>

      <div class="product-detail-one__btns">
        <div
          class="product-detail-one__btn product-detail-one__btn--random"
          @click="toggleShowOptionRandom"
        >
          隨機選擇
        </div>
        <div
          class="product-detail-one__btn product-detail-one__btn--im"
          @click="handleExchange"
        >
          立即兌換
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
import ticketImgH from '@/assets/image/ticket_H.png';
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import MImage from '@/components/frontend/MImage.vue';
import ProductCard2 from '@/components/frontend/ProductCard2.vue';
import { PRODUCT_TYPE_LABELS } from '@/data/productTypeData';
import { executeDraw, getDrawStatus } from '@/services/frontend/drawService';
import {
  getProductDetailById,
  IProductDetail,
} from '@/services/frontend/productDetailService';
import { getProductById, IProduct } from '@/services/frontend/productService';
import { useAuthStore, useDialogStore, useLoadingStore } from '@/stores';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();

const route = useRoute();
const productId = Number(route.params.id);

const breadcrumbItems = ref([{ name: '首頁' }]);
const product = ref<IProduct | null>(null);
const productDetail = ref<IProductDetail[] | null>(null);
const ticketList = ref<any[]>([]);
const activeTicket = ref<any | null>(null);

const introduceSection = ref<HTMLElement | null>(null);
const showOption = ref(false);
const showOptionRandom = ref(false);

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

    if (drawStatusResponse.data) {
      ticketList.value = drawStatusResponse.data;
    }
  } catch (error: any) {
    const { message } = error.response.data;
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message,
    });
  }
  loadingStore.stopLoading();
});

const fetchDrawStatus = async () => {
  try {
    const { data } = await getDrawStatus(productId);
    if (data) {
      ticketList.value = data;
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

const handleTicket = (ticket: any) => {
  showOption.value = true;
  activeTicket.value = ticket;
};

const handleExchange = async () => {
  if (!authStore.isLogin) {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '請先登入',
    });
    return;
  }

  if (!activeTicket.value) {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '請先選擇要抽的項目。',
    });
    return;
  }

  if (product.value) {
    const { productType } = product.value;
    const { productId, number } = activeTicket.value;
    try {
      loadingStore.startLoading();
      const response = await executeDraw(
        productId,
        authStore.user.userUid,
        number
      );
      loadingStore.stopLoading();

      if (response && response.data) {
        const { data } = response;

        await dialogStore.openOneKujiDialog(
          {},
          productType === 'PRIZE' ? 'ticket' : 'box'
        );

        activeTicket.value = null;

        const totalAmount = data.reduce(
          (sum: number, item: any) => sum + item.amount,
          0
        );

        await fetchDrawStatus();
        await dialogStore.openConfirmDialog(
          { customClass: '' },
          {
            remainingQuantity: remainingQuantity.value - 1,
            count: 1,
            total: totalAmount,
          }
        );
      } else {
        throw new Error('Invalid response from executeDraw');
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
  }
};

const getTicketImg = (ticket: any) => {
  const { productType } = product.value;
  const { level, isDrawn } = ticket;

  if (productType === 'PRIZE') {
    const ticketImages: Record<string, string> = {
      A: ticketImgA,
      B: ticketImgB,
      C: ticketImgC,
      D: ticketImgD,
      E: ticketImgE,
      F: ticketImgF,
      G: ticketImgG,
      H: ticketImgH,
    };

    return isDrawn ? ticketImages[level] || ticketImg : ticketImg;
  } else {
    return isDrawn ? boxOpen : boxClose;
  }
};

const scrollToIntroduce = (isShowOption = false) => {
  showOption.value = isShowOption;
  introduceSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const toggleShowOptionRandom = () => {
  showOptionRandom.value = !showOptionRandom.value;
};
</script>

<style scoped></style>
