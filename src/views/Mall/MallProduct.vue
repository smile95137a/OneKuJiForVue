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
              <div
                class="mall-product__detail-otherNum-btn"
                @click="decreaseQuantity"
              >
                <i class="fa-solid fa-minus"></i>
              </div>
              <div class="mall-product__detail-otherNum-text">
                {{ quantity }}
              </div>
              <div
                class="mall-product__detail-otherNum-btn mall-product__detail-otherNum-btn--active"
                @click="increaseQuantity"
              >
                <i class="fa-solid fa-plus"></i>
              </div>
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
import se from '@/assets/image/711.png';
import familyMart from '@/assets/image/familyMart.png';
import hilife from '@/assets/image/hilife.png';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getStoreProductById,
  IStoreProduct,
} from '@/services/frontend/storeProductService';
import { useCartStore } from '@/stores';
import MImage from '@/components/frontend/MImage.vue';

const breadcrumbItems = ref([{ name: '首頁' }, { name: '商城' }]);
const route = useRoute();

const router = useRouter();
const storeProductId = Number(route.params.id);

const product = ref<IStoreProduct | null>(null);
const cartStore = useCartStore();
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
});
const quantity = ref(1);

const increaseQuantity = () => {
  quantity.value += 1;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};

const addProductToCart = () => {
  if (product.value) {
    const cartItem = {
      id: product.value.storeProductId,
      name: product.value.productName,
      price: product.value.specialPrice,
      quantity: quantity.value,
      isSelected: true,
    };

    cartStore.addToCart(cartItem);
  }
};

const buyItNow = () => {
  if (product.value) {
    const cartItem = {
      id: product.value.storeProductId,
      name: product.value.productName,
      price: product.value.specialPrice,
      quantity: quantity.value,
      isSelected: true,
    };

    cartStore.addToCart(cartItem);
  }
  router.push('/mall-checkout');
};

const tabs = ['詳情', '規格'];
const activeTab = ref('詳情');
const expanded = ref(false);
const showToggle = ref(false);
const contentDiv = ref<HTMLElement | null>(null);

const maxHeight = 100; // 指定內容的最大高度（超過此高度會顯示展開按鈕）

const toggleExpand = () => {
  expanded.value = !expanded.value;
};

onMounted(() => {
  if (contentDiv.value) {
    showToggle.value = contentDiv.value.scrollHeight > maxHeight;
  }
});
</script>
<style scoped></style>
