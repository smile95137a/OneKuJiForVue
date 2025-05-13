<script lang="ts" setup>
import c1 from '@/assets/image/coin-1.png';
import dbox from '@/assets/image/dp.png';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { AppEnv } from '@/config/appEnv';
import { paymentOptions } from '@/data/orderOptions';
import { generateAfteePreRegister } from '@/services/frontend/afteeService';
import { topUp } from '@/services/frontend/paymentService';
import { getUserInfo } from '@/services/frontend/userService';
import { useDialogStore, useLoadingStore } from '@/stores';
import AFTEEUtils from '@/utils/AFTEEUtils';
import axios from 'axios';
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
  { id: 'deposit1', value: '300', num: '300' },
  { id: 'deposit2', value: '500', num: '500' },
  { id: 'deposit3', value: '1000', num: '1000' },
  { id: 'deposit4', value: '3000', num: '3000' },
  { id: 'deposit5', value: '5000', num: '5000' },
  { id: 'deposit6', value: '8000', num: '8000' },
  { id: 'deposit7', value: '10000', num: '10000' },
  { id: 'deposit8', value: '20000', num: '20000' },
  { id: 'deposit9', value: '30000', num: '30000' },
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
    const { data: userInfo } = await getUserInfo();
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
        appendField('Send_Type', '4');
        appendField('Pay_Mode_No', '2');
        appendField('CustomerId', import.meta.env.VITE_PAYMENT_CUSTOMER_ID);
        appendField('Order_No', data.orderNo);
        appendField('Amount', values.amount);
        appendField('Buyer_Name', userInfo.nickname);
        appendField('Buyer_Telm', userInfo.phoneNumber);
        appendField('Buyer_Mail', userInfo.email);
        appendField('Buyer_Memo', '儲值代幣');
        appendField(
          'Callback_Url',
          'https://api.onemorelottery.tw:8081/payment/paymentCallback2'
        );
        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
      } else if (values.paymentMethod === 4) {
        try {
          const res = await generateAfteePreRegister({
            type: 'TOPUP',
            orderNo: data.orderNo,
            returnUrl: `${window.location.origin}/paymentCB`,
          });

          const { data: userInfo } = await getUserInfo();

          const preRegisterPayload = {
            pre_token: '',
            pub_key: AppEnv.AFTEE_PUB_KEY,
            payment: {
              amount: Number(values.amount),
              shop_transaction_no: data.orderNo,
              user_no: userInfo.userUid || '',
              sales_settled: true,
              transaction_options: [],
              description_trans: '',
              checksum: '', // 若後端提供可填入
              customer: {
                customer_name: userInfo.nickname,
                phone_number: userInfo.phoneNumber,
                address:
                  `${userInfo.city}${userInfo.area}${userInfo.addressName}` ||
                  '未填地址',
                email: userInfo.email,
                additional_info_code: 'FI',
              },
              dest_customers: [],
              items: [
                {
                  shop_item_id: 'TOPUP',
                  item_name: '儲值代幣',
                  item_category: '商品',
                  item_price: Number(values.amount),
                  item_count: 1,
                },
              ],
              validation_datetime: '',
              return_url: `${window.location.origin}/paymentCB`,
            },
          };

          console.log(preRegisterPayload);
          AFTEEUtils.generateAndAttachChecksum(
            preRegisterPayload.payment,
            AppEnv.AFTEE_SECRET_KEY
          );

          console.log(preRegisterPayload);
          return;

          if (res.success) {
            const result = res.data;

            if (
              result?.shop_transaction_no &&
              result?.pre_register_identifier
            ) {
              const redirectUrl = `${
                import.meta.env.VITE_AFTEE_API_URL
              }settlement/${result.shop_transaction_no}?identifier=${
                result.pre_register_identifier
              }`;
              window.location.href = redirectUrl;
            } else {
              await dialogStore.openInfoDialog({
                title: 'AFTEE 回應失敗',
                message: '無法產生交易識別碼，請稍後再試。',
              });
            }
          }
        } catch (error) {
          console.error(error);
          await dialogStore.openInfoDialog({
            title: '系統錯誤',
            message: '與 AFTEE 連線失敗，請稍後再試。',
          });
        }
      }
    } else {
      await dialogStore.openInfoDialog({
        title: '儲值失敗',
        message: message,
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
});

const validateForm = async () => {
  const { paymentMethod } = values;

  if (~~paymentMethod === 2) {
    const { data: userInfo } = await getUserInfo();

    if (!userInfo.addressName) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '您選擇使用轉帳付款。請先至個人資料中填寫完整的收件地址。',
      });
      return false;
    }

    if (!userInfo.nickname) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '您選擇使用轉帳付款。請先至個人資料中填寫收件人姓名。',
      });
      return false;
    }

    if (!userInfo.phoneNumber) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '您選擇使用轉帳付款。請先至個人資料中填寫聯絡電話。',
      });
      return false;
    }

    if (!userInfo.email) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '您選擇使用轉帳付款。請先至個人資料中填寫電子郵件地址。',
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
            v-for="option in paymentOptions.filter(
              (opt) => opt.priceType === 3
            )"
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
