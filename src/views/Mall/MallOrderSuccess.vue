<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/common/Card.vue';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import { useRoute, useRouter } from 'vue-router';
import { getStoreProductOrderByOrderNumber } from '@/services/frontend/orderService';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import MImage from '@/components/frontend/MImage.vue';
import { paymentOptions, shippingOptions } from '@/data/orderOptions';

const breadcrumbItems = [{ name: '首頁' }, { name: '訂購成功' }];

const route = useRoute();
const router = useRouter();
const orderNumber = route.params.orderNumber;
const orderData = ref<any>(null);

const getShippingMethodName = (value: string) => {
  const option = shippingOptions.find((option) => option.value === value);
  return option ? option.name : '未知配送方式';
};

const getPaymentMethodName = (value: string) => {
  const option = paymentOptions.find((option) => option.value === value);
  return option ? option.name : '未知付款方式';
};

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
            class="grid gap-y-24 m-t-24"
            v-for="(item, index) in orderData.orderDetails"
            :key="item.orderDetailId"
          >
            <div class="col-100 grid">
              <div class="col-10">
                <p
                  class="mallOrderSuccess__text mallOrderSuccess__text--title"
                  v-if="index === 0"
                >
                  商品資訊
                </p>
              </div>
              <div class="col-65 mallOrderSuccess__main-cell--product">
                <div class="mallOrderSuccess__main-img">
                  <MImage :src="item.storeProduct.imageUrls[0]" />
                </div>
                <p class="mallOrderSuccess__text">
                  {{ item.storeProduct.productName }}
                </p>
              </div>
              <div class="col-25">
                <p class="mallOrderSuccess__text text-align-end">
                  $
                  <NumberFormatter
                    :number="item.unitPrice * item.quantity ?? 0"
                  />
                </p>
              </div>
            </div>
          </div>

          <div class="grid m-t-72">
            <div class="col-10">
              <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
                寄送資訊
              </p>
            </div>
            <div class="col-65 mallOrderSuccess__main-cell--delivery">
              <p class="mallOrderSuccess__text">
                {{ getShippingMethodName(orderData.shippingMethod) }}：{{
                  orderData.shippingCity
                }}{{ orderData.shippingArea }}{{ orderData.shippingAddress }}
              </p>
              <p class="mallOrderSuccess__text m-t-24">
                發票：{{
                  orderData.invoice === 'donation'
                    ? '捐贈發票'
                    : '個人二聯式發票'
                }}
              </p>
            </div>
            <div class="col-25">
              <p class="mallOrderSuccess__text text-align-end">
                ${{ orderData.shippingCost.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- <div class="grid m-t-48">
            <div class="col-10">
              <p class="mallOrderSuccess__text">優惠</p>
            </div>
            <div class="col-65">滿$499折$50</div>
            <div class="col-25">
              <p class="mallOrderSuccess__text text-align-end">
                ${{
                  (orderData.totalAmount - orderData.shippingCost).toFixed(2)
                }}
              </p>
            </div>
          </div> -->

          <div class="grid m-t-48">
            <div class="col-10">
              <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
                付款
              </p>
            </div>
            <div class="col-65">
              {{ getPaymentMethodName(orderData.paymentMethod) }}
            </div>
            <div class="col-25"></div>
          </div>
        </div>

        <div class="mallOrderSuccess__main-total">
          <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
            總金額：
          </p>
          <p class="mallOrderSuccess__text mallOrderSuccess__text--money">
            $ <NumberFormatter :number="orderData.totalAmount ?? 0" />
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
