<template>
  <div>
    <Breadcrumbs :items="breadcrumbItems" />
    <div class="product-detail-one">
      <div class="product-detail-one__main">
        <div class="product-detail-one__img">
          <MImage v-if="product" :src="product?.imageUrls[0]" />
        </div>
        <div class="product-detail-one__title">
          <p class="product-detail-one__text">
            {{ product?.productName }}
          </p>
        </div>
        <div class="product-detail-one__action">
          <div class="product-detail-one__prices">
            <div class="product-detail-one__price" v-if="!showBouns">
              <p class="product-detail-one__price-money">
                <span class="product-detail-one__text">{{
                  product?.price
                }}</span>
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
            <div class="product-detail-one__sliverPrice" v-if="!showBouns">
              <p class="product-detail-one__sliverPrice-money">
                <span class="product-detail-one__text">{{
                  product?.sliverPrice
                }}</span>
              </p>
              <p class="product-detail-one__sliverPrice-unit">
                <span
                  class="product-detail-one__text product-detail-one__text--icon"
                >
                  銀
                </span>
                <span class="product-detail-one__text">/抽</span>
              </p>
            </div>
            <div class="product-detail-one__bonus" v-if="showBouns">
              <p class="product-detail-one__bonus-money">
                <span class="product-detail-one__text">{{
                  product?.bonusPrice
                }}</span>
              </p>
              <p class="product-detail-one__bonus-unit">
                <span
                  class="product-detail-one__text product-detail-one__text--icon"
                >
                  紅
                </span>
                <span class="product-detail-one__text">/抽</span>
              </p>
            </div>
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
        <div class="product-detail-one__info product-detail-one__info--two">
          一番賞、扭蛋、盲盒商品為「線上機率型」商品，一但完成抽獎程序，恕無法接受「退貨及退款」！
          除非有品質瑕疵，「收到商品拆封請全程綠影以保護雙方權益」。
          商品運送及海關檢驗時可能有盒損、原廠二次膠拆檢等狀況。若您對於盒況有相當高的要求，建議您不要購買！
          消費者購買前請「務必」確認我們的消費規範再進行購買，謝謝！
          本公司保留對平台活動、商品及相關規定條款新增、變更、修改、終止之權利。
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
            customClass="product-detail-one__products--card"
          />
        </div>
      </Card>
      <Card customClass="mcard--product-detail-one">
        <template #header>
          <MCardHeader title="檢視抽況" />
        </template>
        <div class="product-detail-one__text" ref="introduceSection">
          剩餘數量：{{ remainingQuantity }} / 總數量：{{ ~~ticketList?.length }}
        </div>
        <p v-if="countdown > 0" class="product-detail-one__countdown">
          剩餘時間: {{ Math.floor(countdown / 60) }} 分 {{ countdown % 60 }} 秒
        </p>
        <div class="product-detail-one__boxs">
          <div
            v-for="(ticket, index) in ticketList"
            :key="index"
            :class="[
              'product-detail-one__boxs-img',
              activeTickets
                ?.map((x) => x.prizeNumberId)
                .includes(ticket.prizeNumberId)
                ? 'product-detail-one__boxs-img--active'
                : '',
            ]"
          >
            <label>
              <input
                type="checkbox"
                :checked="
                  activeTickets
                    ?.map((x) => x.prizeNumberId)
                    .includes(ticket.prizeNumberId)
                "
                @change="handleCheckboxChange(ticket)"
                :disabled="ticket.isDrawn"
                hidden
              />
              <img :src="getTicketImg(ticket)" alt="" />
              <p class="text-center">{{ index + 1 }}</p>
            </label>
          </div>
        </div>
      </Card>
    </div>
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
            v-model.number="customQuantity"
          />
          <div
            class="product-detail-one__random-btn"
            @click="selectCustomRandom"
          >
            自選隨機
          </div>
        </div>
        <div class="product-detail-one__random-list m-t-20">
          <div
            v-for="item in [1, 3, 5, 10]"
            :key="item"
            :class="['product-detail-one__random-list-item']"
            @click="selectRandomItem(item)"
          >
            {{ item }}
          </div>
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
          @click="handleExchange(1)"
          v-if="!showBouns"
        >
          金幣兌換
        </div>
        <div
          class="product-detail-one__btn product-detail-one__btn--im"
          @click="handleExchange(2)"
          v-if="!showBouns"
        >
          銀幣兌換
        </div>
        <div
          class="product-detail-one__btn product-detail-one__btn--im"
          @click="handleExchange(3)"
          v-if="showBouns"
        >
          紅利兌換
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
import ticketImgI from '@/assets/image/ticket_I.png';
import ticketImgBlank from '@/assets/image/ticket_blank.png';
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
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();

const route = useRoute();
const productId = Number(route.params.id);

const breadcrumbItems = ref([{ name: '首頁' }]);
const product = ref<IProduct | null>(null);
const productDetail = ref<IProductDetail[] | null>(null);
const ticketList = ref<any[]>([]);
const activeTickets = ref<any[]>([]);

const introduceSection = ref<HTMLElement | null>(null);
const showOption = ref(false);
const showBouns = ref(false);
const showOptionRandom = ref(false);
const customQuantity = ref(1);

const countdown = ref<number>(0);
let countdownInterval: NodeJS.Timeout | null = null;

const endTimes = ref<string | null>(null);

const startCountdown = (endTime: string) => {
  const endMoment = moment(endTime);
  const now = moment();

  const duration = endMoment.diff(now, 'seconds');
  countdown.value = duration > 0 ? duration : 0;

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);
};

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
      showBouns.value = productResponse.data.prizeCategory === 'BONUS';
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
      ticketList.value = drawStatusResponse.data.prizeNumberList;

      if (product.value?.productType === 'PRIZE') {
        const endTime = drawStatusResponse.data.endTimes || null;
        if (endTime) {
          endTimes.value = endTime;
          startCountdown(endTime);
        }
      }
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

onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

const fetchDrawStatus = async () => {
  try {
    const { data } = await getDrawStatus(productId);
    if (data) {
      ticketList.value = data.prizeNumberList;

      if (product.value?.productType === 'PRIZE') {
        const newEndTime = data.endTimes || null;
        if (newEndTime) {
          endTimes.value = newEndTime;
          startCountdown(newEndTime);
        }
      }
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

const handleCheckboxChange = (ticket: any) => {
  showOption.value = true;
  const isActive = activeTickets.value
    ?.map((x) => x.prizeNumberId)
    .includes(ticket.prizeNumberId);
  if (isActive) {
    activeTickets.value = activeTickets.value.filter(
      (x) => x.prizeNumberId !== ticket.prizeNumberId
    );
  } else {
    activeTickets.value.push(ticket);
  }
};

const handleExchange = async (exchangeType: number) => {
  if (!authStore.isLogin) {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '請先登入',
    });
    return;
  }

  if (activeTickets.value?.length === 0) {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '請先選擇要抽的項目。',
    });
    return;
  }

  if (product.value) {
    const { productType } = product.value;

    try {
      loadingStore.startLoading();
      const { success, data } = await executeDraw(
        productId,
        activeTickets.value?.map((x) => x.number),
        exchangeType
      );

      loadingStore.stopLoading();

      if (success) {
        await dialogStore.openOneKujiDialog(
          {},
          productType === 'PRIZE' ? 'ticket' : 'box'
        );

        activeTickets.value = [];

        const totalAmount = data.reduce(
          (sum: number, item: any) => sum + item.amount,
          0
        );

        await fetchDrawStatus();
        await dialogStore.openConfirmDialog(
          { customClass: '' },
          {
            remainingQuantity: remainingQuantity.value,
            count: data.length,
            total: totalAmount,
            drawData: data,
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
      I: ticketImgI,
    };

    return isDrawn ? ticketImages[level] || ticketImgBlank : ticketImg;
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

const selectRandomItem = (item: number) => {
  const availableTickets = ticketList.value.filter((x) => !x.isDrawn);
  const selectCount =
    item > availableTickets.length ? availableTickets.length : item;
  const shuffledTickets = availableTickets.sort(() => 0.5 - Math.random());
  activeTickets.value = shuffledTickets.slice(0, selectCount);
};

const selectCustomRandom = () => {
  const availableTickets = ticketList.value.filter((x) => !x.isDrawn);
  const selectCount =
    customQuantity.value > availableTickets.length
      ? availableTickets.length
      : customQuantity.value;
  const shuffledTickets = availableTickets.sort(() => 0.5 - Math.random());
  activeTickets.value = shuffledTickets.slice(0, selectCount);
};
</script>

<style scoped>
.product-detail-one__random-input::-webkit-outer-spin-button,
.product-detail-one__random-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.product-detail-one__random-input[type='number'] {
  -moz-appearance: textfield;
}
</style>
