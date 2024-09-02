<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/common/Card.vue';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import { useRoute, useRouter } from 'vue-router';
import { getStoreProductOrderByOrderNumber } from '@/services/frontend/orderService';

const breadcrumbItems = [{ name: '首頁' }, { name: '訂購成功' }];

const route = useRoute();
const router = useRouter();
const orderNumber = route.params.orderNumber;
const orderData = ref<any>(null);

onMounted(async () => {
  try {
    const res = await getStoreProductOrderByOrderNumber(orderNumber as string);
    orderData.value = res.data;
    console.log('Order Data:', orderData.value);
  } catch (error) {
    console.error('Failed to load order data:', error);
  }
});
const goToHome = () => {
  router.push('/home');
};

const continueShopping = () => {
  router.push('/mall');
};
</script>
<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mallOrderSuccess" v-if="orderData">
    <div class="mallOrderSuccess__title m-t-72">
      <p
        class="mallOrderSuccess__text mallOrderSuccess__text--title"
        data-text="訂購成功"
      >
        訂購成功
      </p>
      <p class="mallOrderSuccess__text mallOrderSuccess__text--subTitle">
        感謝您的消費！以下為您的訂單明細
      </p>
    </div>
    <Card customClass="mcard--mallOrderSuccess">
      <div class="mallOrderSuccess__main">
        <div class="mallOrderSuccess__main-list">
          <div
            class="grid gap-y-24"
            v-for="item in orderData.orderDetails"
            :key="item.orderDetailId"
          >
            <div class="col-100 grid">
              <div class="col-10">
                <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
                  商品資訊
                </p>
              </div>
              <div class="col-65 mallOrderSuccess__main-cell--product">
                <div class="mallOrderSuccess__main-img">
                  <img :src="item.storeProduct.imageUrls[0] || pd1" />
                </div>
                <p class="mallOrderSuccess__text">
                  {{ item.storeProduct.productName }}
                </p>
              </div>
              <div class="col-25">
                <p class="mallOrderSuccess__text text-align-end">
                  ${{ item.unitPrice * item.quantity }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mallOrderSuccess__main-total">
          <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
            總金額：
          </p>
          <p class="mallOrderSuccess__text mallOrderSuccess__text--money">
            ${{ orderData.totalAmount.toFixed(2) }}
          </p>
        </div>
      </div>
    </Card>
    <div class="mallOrderSuccess__btns">
      <div
        class="mallOrderSuccess__btn mallOrderSuccess__btn--backHome"
        @click="goToHome"
      >
        回首頁
      </div>
      <div
        class="mallOrderSuccess__btn mallOrderSuccess__btn--continue"
        @click="continueShopping"
      >
        繼續購買
      </div>
    </div>
  </div>
</template>
