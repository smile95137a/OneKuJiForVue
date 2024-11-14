<script lang="ts" setup>
import c1 from '@/assets/image/coin-1.png';
import dbox from '@/assets/image/dp.png';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { paymentOptions } from '@/data/orderOptions';
import { topUp } from '@/services/frontend/paymentService';
import { getUserInfo } from '@/services/frontend/userService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const schema = yup.object({
  paymentMethod: yup.string().required('請選擇付款方式'),
  amount: yup.string().required('請選擇儲值金額'),
});

// 使用 useForm 进行表单验证
const { handleSubmit, errors, defineField, setFieldValue, values } = useForm({
  validationSchema: schema,
  initialValues: {
    paymentMethod: '',
    amount: '',
  },
});

const [paymentMethod] = defineField('paymentMethod');
const [amount] = defineField('amount');

const depositList = [
  { id: 'deposit1', value: '1000', num: '1000' },
  { id: 'deposit2', value: '3000', num: '3000' },
  { id: 'deposit3', value: '5000', num: '5000' },
  { id: 'deposit4', value: '8000', num: '8000' },
  { id: 'deposit5', value: '10000', num: '10000' },
  { id: 'deposit6', value: '20000', num: '20000' },
  { id: 'deposit7', value: '30000', num: '30000' },
  { id: 'deposit8', value: '50000', num: '50000' },
];

// 提交表單的處理邏輯
const onSubmit = handleSubmit(async (values) => {
  try {
    const isV = await validateForm();
    if (!isV) {
      return;
    }
    loadingStore.startLoading();
    const { success, data, code, message } = await topUp(values);
    loadingStore.stopLoading();

    if (success) {
      if (values.paymentMethod === 1) {
        const form = document.createElement('form');
        form.action = import.meta.env.VITE_PAYMENT_GATEWAY_URL;
        form.method = 'post';

        // Helper to create and append form fields
        const appendField = (name, value) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };

        // Set form fields
        appendField('Send_Type', '0');
        appendField('Pay_Mode_No', '2');
        appendField('CustomerId', import.meta.env.VITE_PAYMENT_CUSTOMER_ID);
        appendField('Order_No', data);
        appendField('TransMode', '1');
        appendField('Amount', values.amount);
        appendField('Installment', '0');
        appendField('TransCode', '00');
        appendField('Buyer_Memo', '儲值代幣');
        appendField('Return_url', `${window.location.origin}/paymentCB`);

        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
      } else if (values.paymentMethod === 2) {
        await dialogStore.openInfoDialog({
          title: '儲值成功',
          message: `轉帳帳號：${data.epayAccount}`,
        });
      }
    } else {
      await dialogStore.openInfoDialog({
        title: '儲值失敗',
        message: message,
      });
    }
  } catch (error) {
    loadingStore.stopLoading();
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '系統問題，請稍後再嘗試。',
    });
  }
});

const validateForm = async () => {
  const { paymentMethod } = values;
  if (~~paymentMethod === 2) {
    const { data: userInfo } = await getUserInfo();
    if (!userInfo.addressName) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '使用轉帳付款時，請先填寫收件人資訊。',
      });
      return false;
    }
  }

  return true;
};
</script>

<template>
  <div class="deposit p-24">
    <div class="deposit__title">
      <div class="deposit__text" data-text="儲值">儲值</div>
    </div>
    <div class="deposit__list">
      <div class="deposit__list-items">
        <div
          v-for="deposit in depositList"
          :key="deposit.id"
          class="deposit__list-item"
        >
          <label
            :for="deposit.id"
            class="deposit__item"
            :class="{ active: amount === deposit.value }"
          >
            <input
              class="deposit__item-radio"
              type="radio"
              :id="deposit.id"
              name="deposit"
              :value="deposit.value"
              v-model="amount"
            />
            <label :for="deposit.id"></label>
            <div class="deposit__item-img">
              <img :src="dbox" alt="" />
            </div>
            <div class="deposit__item-num">
              <div class="deposit__item-icon">
                <img :src="c1" alt="代幣" />
              </div>
              <NumberFormatter :number="deposit.num" />
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
      優惠及結帳
    </div>
    <div class="p-y-48 p-x-48">
      <div class="mallCheckout__payment">
        <div
          class="mallCheckout__payment-item mallCheckout__payment-item--title"
        >
          付款
        </div>
        <div
          class="mallCheckout__payment-item mallCheckout__payment-item--options"
        >
          <div
            v-for="option in paymentOptions"
            :key="option.name"
            class="mallCheckout__payment-option"
          >
            <input type="radio" :value="option.value" v-model="paymentMethod" />
            <label>{{ option.name }} </label>
          </div>
        </div>
      </div>
    </div>

    <div class="deposit__btns">
      <button class="deposit__btn" @click="onSubmit">確認</button>
    </div>
  </div>
</template>
