<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mall-product">
    <div class="mall-product__main">
      <div class="mall-product__img">
        <div class="mall-product__img-main">
          <MImage :src="product?.imageUrls[0]" />
        </div>
        <div class="mall-product__img-other">
          <div
            class="mall-product__img-otherItem mall-product__img-otherItem--active"
          >
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
        </div>
      </div>
      <!--  -->
      <div class="mall-product__detail">
        <div class="mall-product__detail-title">
          {{ product?.productName }}
        </div>
        <div class="mall-product__detail-prices">
          <div class="mall-product__detail-priceMain">
            <div class="mall-product__detail-priceMoney">
              {{ product?.specialPrice }}
            </div>
            <div class="mall-product__detail-priceUnit">元</div>
          </div>
        </div>

        <div class="mall-product__detail-other">
          <div class="mall-product__detail-otherNum">
            <div class="mall-product__detail-otherNum-title">數量</div>
            <div class="mall-product__detail-otherNum-other">
              <button
                type="button"
                class="mall-product__detail-otherNum-btn"
                @click="decreaseQuantity"
              >
                <i class="fa-solid fa-minus"></i>
              </button>
              <div class="mall-product__detail-otherNum-text">
                {{ quantity }}
              </div>
              <button
                type="button"
                class="mall-product__detail-otherNum-btn mall-product__detail-otherNum-btn--active"
                @click="increaseQuantity"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="mall-product__detail-action">
          <div
            class="mall-product__detail-action-btn"
            @click="addProductToCart()"
          >
            <div class="mall-product__detail-action-btn-icon">
              <i class="fa-solid fa-cart-plus"></i>
            </div>
            <div class="mall-product__detail-action-btn-text">加到購物車</div>
          </div>
          <div
            class="mall-product__detail-action-btn mall-product__detail-action-btn--red"
            @click="buyItNow()"
          >
            <div class="mall-product__detail-action-btn-icon"></div>
            <div class="mall-product__detail-action-btn-text">立即購買!</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mall-product__tabs">
      <div class="mall-product__tab-header">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'mall-product__tab-item',
            { 'mall-product__tab-item--active': activeTab === tab },
          ]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </div>
      </div>
      <div
        class="mall-product__tab-content"
        :style="{
          height: expanded ? 'auto' : '180px',
          overflow: expanded ? 'visible' : 'hidden',
        }"
      >
        <div v-if="activeTab === '詳情'" v-html="product?.description"></div>
        <div v-if="activeTab === '規格'" v-html="product?.specification"></div>
      </div>
      <div
        v-if="!expanded"
        class="mall-product__tab-more"
        @click="toggleExpand"
      >
        <div class="mall-product__tab-more-btn">
          <span>展開更多</span>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import pd1 from '@/assets/image/pd1.png';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getStoreProductById,
  IStoreProduct,
} from '@/services/frontend/storeProductService';
import MImage from '@/components/frontend/MImage.vue';
import { addCartItem } from '@/services/frontend/cartItemService';
import { useAuthStore, useDialogStore, useLoadingStore } from '@/stores';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const storeProductId = Number(route.params.id);

const breadcrumbItems = ref([{ name: '首頁' }, { name: '商城' }]);
const product = ref<IStoreProduct | null>(null);
const quantity = ref(1);
const tabs = ['詳情', '規格'];
const activeTab = ref('詳情');
const expanded = ref(false);
const showToggle = ref(false);
const contentDiv = ref<HTMLElement | null>(null);
const maxHeight = 100;

const increaseQuantity = () => {
  quantity.value += 1;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};

const handleAddToCart = async (redirectToCheckout = false) => {
  if (!authStore.isLogin) {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '請先登入',
    });
    return;
  }

  if (product.value) {
    const cartItem = {
      storeProductId: product.value.storeProductId,
      quantity: quantity.value,
    };
    try {
      loadingStore.startLoading();
      const response = await addCartItem(cartItem);
      loadingStore.stopLoading();
      if (response.success) {
        if (redirectToCheckout) {
          router.push('/mall-checkout');
        } else {
          await dialogStore.openInfoDialog({
            title: '系統消息',
            message: '商品成功加到購物車',
          });
        }
      } else {
        await dialogStore.openInfoDialog({
          title: '系統消息',
          message: `添加購物車失敗: ${response.message}`,
        });
      }
    } catch (error) {
      loadingStore.stopLoading();
      console.error('添加購物車時發生錯誤:', error);
      await dialogStore.openInfoDialog({
        title: '系統消息',
        message: '添加購物車時發生錯誤，請稍後再試。',
      });
    }
  }
};

const addProductToCart = async () => {
  await handleAddToCart();
};

const buyItNow = async () => {
  await handleAddToCart(true);
};

const toggleExpand = () => {
  expanded.value = !expanded.value;
};

onMounted(async () => {
  try {
    const { success, data, message } = await getStoreProductById(
      storeProductId
    );
    if (success) {
      product.value = data;
      breadcrumbItems.value.push({ name: data.productName });
    } else {
      console.log(message);
    }
  } catch (err) {
    console.error(err);
  }
  if (contentDiv.value) {
    showToggle.value = contentDiv.value.scrollHeight > maxHeight;
  }
});
</script>
<style scoped></style>
