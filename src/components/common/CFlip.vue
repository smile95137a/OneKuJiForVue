<template>
  <div :class="['menu-flip']">
    <div v-if="index === 0" class="menu-flip__header-title grid text-center">
      <div class="col-20 p-12">日期</div>
      <div class="col-20 p-12">訂單編號</div>
      <div class="col-20 p-12">物流單號</div>
      <div class="col-10 p-12">狀態</div>
      <div class="col-10 p-12">明細</div>
      <div class="col-20 p-12">功能</div>
    </div>
  </div>
  <div :class="['menu-flip', isActive ? 'menu-flip--active' : '']">
    <div class="menu-flip__header">
      <div class="menu-flip__header-info grid text-center">
        <div class="col-20 p-12" @click="togglePanel">
          {{ formatDate(orderData.createdAt) }}
        </div>
        <div
          class="col-20 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">{{ orderData.orderNumber }}</p>
        </div>

        <div
          class="col-20 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">{{ orderData.trackingNumber || '-' }}</p>
        </div>
        <div
          class="col-10 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">
            {{ getShipStatusByKey(orderData.resultStatus) }}
          </p>
        </div>
        <div
          class="col-10 flex items-center justify-center"
          @click="togglePanel"
        >
          <p class="menu-flip__text">明細</p>
        </div>
        <div class="col-20 flex items-center justify-center">
          <div v-if="orderData.resultStatus === 'NO_PAY'">
            <button class="menu-flip__btn" @click="handlePayment(orderData)">
              付款
            </button>
            <button
              class="menu-flip__btn"
              @click="handleCancelOrder(orderData)"
            >
              取消訂單
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="['menu-flip__panel', isActive ? 'menu-flip__panel--active' : '']"
    >
      <div class="grid m-b-16">
        <div class="col-25">名稱</div>
        <div class="col-25">數量</div>
        <div class="col-25">單價</div>
        <div class="col-25">總金額</div>
      </div>
      <div class="grid" v-for="item in orderData.orderDetails" :key="item.id">
        <div class="col-25 p-x-12">
          {{ item.storeProduct?.productName }}
        </div>
        <div class="col-25 p-x-12">
          {{ item.quantity }}
        </div>
        <div class="col-25 p-x-12">
          {{ item.unitPrice }}
        </div>
        <div class="col-25 p-x-12">
          {{ item.totalPrice }}
        </div>
      </div>
      <div class="grid m-t-16" v-if="orderData.paymentMethod === '2'">
        <div class="col-25">轉帳帳號</div>
      </div>
      <div class="grid" v-if="orderData.paymentMethod === '2'">
        <div class="col-25 p-x-12">
          {{ orderData.billNumber }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getShipStatusByKey } from '@/enums/ShipmentStatus';
import { cancelOrder } from '@/services/frontend/paymentService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { PropType, ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['refreshOrders']);
const props = defineProps({
  index: Number,
  orderData: Object as PropType<any>,
  user: Object as PropType<any>,
});

const isActive = ref(false);
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const togglePanel = () => {
  isActive.value = !isActive.value;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const handlePayment = (orderData) => {
  if (orderData.paymentMethod === '1') {
    const form = document.createElement('form');
    form.action = import.meta.env.VITE_PAYMENT_GATEWAY_URL;
    form.method = 'post';

    const appendField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    appendField('Send_Type', '0');
    appendField('Pay_Mode_No', '2');
    appendField('CustomerId', import.meta.env.VITE_PAYMENT_CUSTOMER_ID);
    appendField('Order_No', orderData.orderNumber);
    appendField('TransMode', '1');
    appendField('Amount', orderData.totalAmount);
    appendField('Installment', '0');
    appendField('TransCode', '00');
    appendField('Buyer_Memo', '商品購買');
    appendField(
      'Return_url',
      `${window.location.origin}/paymentCBO?isGoToOrderQuery=1`
    );
    document.body.appendChild(form);
    form.submit();
  } else if (orderData.paymentMethod === '2') {
    const form = document.createElement('form');
    form.action = import.meta.env.VITE_PAYMENT_GATEWAY_URL;
    form.method = 'post';

    const appendField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    appendField('Send_Type', '4');
    appendField('Pay_Mode_No', '2');
    appendField('CustomerId', import.meta.env.VITE_PAYMENT_CUSTOMER_ID);
    appendField('Order_No', orderData.orderNumber);
    appendField('Amount', orderData.totalAmount);

    appendField('Buyer_Name', orderData.billingName);
    appendField('Buyer_Telm', props.user?.phoneNumber || '');
    appendField('Buyer_Mail', props.user?.email || '');
    appendField('Buyer_Memo', '儲值代幣');
    appendField(
      'Callback_Url',
      'https://api.onemorelottery.tw:8081/payment/paymentCallback'
    );
    document.body.appendChild(form);
    form.submit();
  }
};

// 處理取消訂單邏輯
const handleCancelOrder = async (orderData) => {
  try {
    loadingStore.startLoading();
    const { success, data, code, message } = await cancelOrder({
      orderNumber: orderData.orderNumber,
    });
    loadingStore.stopLoading();
    if (success) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '訂單取消成功',
      });
      emit('refreshOrders');
    } else {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message,
      });
    }
  } catch (error) {
    console.log(error);

    loadingStore.stopLoading();
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '系統問題，請稍後再嘗試。',
    });
  }
  console.log('取消訂單按鈕被點擊', orderData);
};
</script>
