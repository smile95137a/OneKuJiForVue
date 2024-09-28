<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mall-product">
    <div class="mall-product__main">
      <div class="mall-product__img">
        <div class="mall-product__img-main">
          <MImage v-if="selectedImage" :src="selectedImage" />
        </div>

        <div class="mall-product__img-other">
          <div
            v-for="(imageUrl, index) in product?.imageUrls"
            :key="index"
            :class="[
              'mall-product__img-otherItem',
              {
                'mall-product__img-otherItem--active':
                  selectedImageIndex === index,
              },
            ]"
            @click="changeMainImage(index)"
          >
            <MImage :src="imageUrl" />
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
              {{
                product?.isSpecialPrice ? product?.specialPrice : product?.price
              }}
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
          <div class="mall-product__detail-otherPreOrder">
            <div class="mall-product__detail-otherPreOrder-title">預購</div>
            <div class="mall-product__detail-otherPreOrder-other">
              <div class="mall-product__detail-otherPreOrder-other-text">
                即日起 ~ 2024/11/30，商品預計將於 2024/11/30 陸續發貨
              </div>
            </div>
          </div>
          <div class="mall-product__detail-otherLogistics">
            <div class="mall-product__detail-otherLogistics-title">物流</div>
            <div class="mall-product__detail-otherLogistics-other">
              <i class="fa-solid fa-truck"></i>
              <div class="mall-product__detail-otherLogistics-other-text">
                $160 ~ {{ product?.shippingPrice }}
              </div>
              <div class="mall-product__detail-otherLogistics-other-icon">
                <img :src="se" />
                <img :src="familyMart" />
              </div>
            </div>
          </div>
          <div class="mall-product__detail-otherPay">
            <div class="mall-product__detail-otherPreOrder-title">付款</div>
            <div class="mall-product__detail-otherPreOrder-other">
              <div class="mall-product__detail-otherPreOrder-other-text">
                信用卡、超商取貨付款
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
    <div class="mall-product__link grid m-t-24 gap-y-24">
      <div class="col-50 col-sm-100 grid gap-y-24">
        <div class="col-100 mall-product__link-item">
          <div class="mall-product__link-item-title">分享</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--share"
          >
            <img :src="lineImg" @click="copyToClipboard(lineShareUrl)" />
            <img :src="metaImg" @click="copyToClipboard(metaShareUrl)" />
            <img :src="linkImg" @click="copyToClipboard(currentUrl)" />
          </div>
        </div>
        <div class="col-100 mall-product__link-item">
          <div class="mall-product__link-item-title">收藏</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--like"
          >
            <span
              @click="handleToggleFavorite"
              class="mall-product__link-item-main-likeIcon"
              :class="{
                'mall-product__link-item-main-likeIcon--active': isFavorite,
              }"
            >
              <i class="fa-regular fa-heart"></i>
            </span>
            <p class="mall-product__text">({{ favoriteCount }})</p>
          </div>
        </div>
      </div>

      <div class="col-50 col-sm-100 grid gap-y-24">
        <div class="col-100 mall-product__link-item">
          <div class="mall-product__link-item-title">分類</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--category"
          >
            主分類 > {{ product?.categoryName }}
          </div>
        </div>
        <div class="col-100 mall-product__link-item">
          <div class="mall-product__link-item-title">關鍵字</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--hashTag"
          >
            <span
              v-for="(keywordObj, index) in product?.keywordList"
              :key="index"
            >
              {{ keywordObj.keyword }}
              <span v-if="index < product.keywordList.length - 1">、</span>
            </span>
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
        <div v-if="activeTab === '詳情'" v-html="product?.details"></div>
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
    <MallProductSlider
      v-if="likedProducts.length > 0"
      sliderClass="mall-product__slider--likes"
      title="你可能會喜歡"
      :products="likedProducts"
      icon='<i class="fa-regular fa-face-grin-hearts"></i>'
    />
    <MallProductSlider
      v-if="recommendedProducts.length > 0"
      sliderClass="mall-product__slider--recommend"
      title="店長推薦"
      :products="recommendedProducts"
      icon='<i class="fa-solid fa-crown"></i>'
    />
    <MallProductSlider
      v-if="hotProducts.length > 0"
      :slidesPerView="4"
      sliderClass="mall-product__slider--hot"
      title="熱銷排行"
      :products="hotProducts"
      icon='<i class="fa-solid fa-fire-flame-curved"></i>'
      slideClass="p-y-12 p-x-12"
      :spaceBetween="0"
      :isRank="true"
    />
  </div>
</template>

<script lang="ts" setup>
import MallProductSlider from '@/components/frontend/MallProductSlider.vue';
import se from '@/assets/image/711.png';
import familyMart from '@/assets/image/familyMart.png';
import lineImg from '@/assets/image/line.png';
import linkImg from '@/assets/image/link.png';
import metaImg from '@/assets/image/meta.png';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import MImage from '@/components/frontend/MImage.vue';
import {
  addCartItem,
  checkQuantity,
} from '@/services/frontend/cartItemService';
import {
  getPagedStoreProducts,
  getStoreProductById,
  toggleFavorite,
  updateProductPopularity,
} from '@/services/frontend/storeProductService';
import { useAuthStore, useDialogStore, useLoadingStore } from '@/stores';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMappingById } from '@/services/frontend/recommendationService';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const productCode = route.params.id;

const breadcrumbItems = ref([{ name: '首頁' }, { name: '商城' }]);
const product = ref<any | null>(null);
const quantity = ref(1);
const tabs = ['詳情', '規格'];
const activeTab = ref('詳情');
const expanded = ref(false);
const showToggle = ref(false);
const contentDiv = ref<HTMLElement | null>(null);
const maxHeight = 100;

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const favoriteCount = ref(0);
const isFavorite = ref(false);

const selectedImageIndex = ref(0);
const selectedImage = ref('');
const likedProducts = ref<any[]>([]);
const recommendedProducts = ref<any[]>([]);
const hotProducts = ref<any[]>([]);
const changeMainImage = (index: number) => {
  selectedImageIndex.value = index;
  selectedImage.value = product.value.imageUrls[index];
};

// 分享 URL
const lineShareUrl =
  'https://line.me/R/msg/text/?' + encodeURIComponent(window.location.href);
const metaShareUrl =
  'https://www.facebook.com/sharer/sharer.php?u=' +
  encodeURIComponent(window.location.href);
const currentUrl = window.location.href;

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '已複製連結',
    });
  } catch (err) {
    console.error('複製失敗:', err);
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '複製失敗，請稍後再試',
    });
  }
};

const handleToggleFavorite = async () => {
  if (!authStore.isLogin) {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '請先登入',
    });
    return;
  }

  try {
    const response = await toggleFavorite(productCode);
    if (response.success) {
      isFavorite.value = !isFavorite.value;
      if (isFavorite.value) {
        favoriteCount.value += 1;
        await dialogStore.openInfoDialog({
          title: '系統消息',
          message: '已收藏',
        });
      } else {
        favoriteCount.value -= 1;
        await dialogStore.openInfoDialog({
          title: '系統消息',
          message: '已取消收藏',
        });
      }
    } else {
      await dialogStore.openInfoDialog({
        title: '系統消息',
        message: '收藏狀態更新失敗，請稍後再試',
      });
    }
  } catch (error) {
    console.error('收藏狀態更新失敗:', error);
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '收藏狀態更新失敗，請稍後再試',
    });
  }
};

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
      productCode: product.value.productCode,
      quantity: quantity.value,
    };
    const isCanAddCart = await checkQuantity(cartItem);
    if (isCanAddCart) {
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
    } else {
      await dialogStore.openInfoDialog({
        title: '系統消息',
        message: '超出庫存數量。',
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

const updatePopularity = async () => {
  try {
    const response = await updateProductPopularity(productCode);
    if (response.success) {
      console.log('成功更新產品熱度');
    } else {
      console.error('更新產品熱度失敗', response.message);
    }
  } catch (error) {
    console.error('更新產品熱度時發生錯誤:', error);
  }
};

onMounted(async () => {
  try {
    const [{ success, data, message }, likedResponse, recommendedResponse] =
      await Promise.all([
        getStoreProductById(productCode),
        getPagedStoreProducts(0, 20),
        getPagedStoreProducts(0, 20),
      ]);
    if (success) {
      product.value = data;
      selectedImage.value = data.imageUrls[0] ?? '';
      favoriteCount.value = data.favoritesCount ?? 0;
      isFavorite.value = data.favorited ?? false;
      breadcrumbItems.value.push({ name: data.productName });
    } else {
      console.log(message);
    }

    if (likedResponse?.success) {
      likedProducts.value = likedResponse.data;
    } else {
      console.log('Failed to load liked products');
    }

    if (recommendedResponse?.success) {
      recommendedProducts.value = recommendedResponse.data;
    } else {
      console.log('Failed to load recommended products');
    }
  } catch (err) {
    console.error(err);
  }
  if (contentDiv.value) {
    showToggle.value = contentDiv.value.scrollHeight > maxHeight;
  }

  timeoutId = setTimeout(() => {
    updatePopularity();
  }, 30000);
});

onBeforeUnmount(() => {
  // 清除計時器
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
<style scoped></style>
