<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import dbox from '@/assets/image/dbox.png';
import { paymentOptions } from '@/data/orderOptions';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useAuthStore, useDialogStore, useLoadingStore } from '@/stores';
import { useRouter } from 'vue-router';
import { topUp } from '@/services/frontend/paymentService';

const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const dialogStore = useDialogStore();

// 定义表单验证规则
const schema = yup.object({
  cardHolderName: yup
    .string()
    .required('請輸入持卡人姓名')
    .matches(/^[A-Za-z\s]+$/, '持卡人姓名只能包含字母和空格')
    .min(3, '持卡人姓名必須至少包含 3 個字符')
    .max(50, '持卡人姓名不能超過 50 個字符'),
  cardNo: yup
    .string()
    .required('請輸入卡號')
    .matches(/^[0-9]+$/, '卡號只能包含數字')
    .min(16, '卡號必須為 16 位數')
    .max(16, '卡號必須為 16 位數'),
  expireDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, '無效的過期日期 (MM/YY)')
    .required('過期日期為必填'),
  cvv: yup.string().length(3, 'CVV 必須為 3 位數').required('CVV 為必填'),
  amount: yup.string().required('請選擇儲值金額'),
  buyerTelm: yup.string().required('請輸入聯絡電話'),
  buyerMail: yup.string().email('無效的電子郵件').required('請輸入電子郵件'),
});

// 使用 useForm 进行表单验证
const { handleSubmit, errors, defineField, setFieldValue, values } = useForm({
  initialValues: {
    paymentMethod: '',
    cardHolderName: '',
    cardNo: '',
    expireDate: '',
    cvv: '',
    amount: '',
    buyerTelm: '',
    buyerMail: '',
  },
});

const [cardHolderName, cardHolderNameProps] = defineField('cardHolderName');
const [paymentMethod, paymentMethodProps] = defineField('paymentMethod');
const [cardNo, cardNoProps] = defineField('cardNo');
const [expireDate, expireDateProps] = defineField('expireDate');
const [cvv, cvvProps] = defineField('cvv');
const [amount, amountProps] = defineField('amount');
const [buyerTelm, buyerTelmProps] = defineField('buyerTelm');
const [buyerMail, buyerMailProps] = defineField('buyerMail');

const depositList = [
  { id: 'deposit2', value: '150', num: '150' },
  { id: 'deposit3', value: '300', num: '300' },
  { id: 'deposit4', value: '500', num: '500' },
  { id: 'deposit5', value: '1000', num: '1000' },
  { id: 'deposit6', value: '1500', num: '1500' },
  { id: 'deposit7', value: '3000', num: '3000' },
  { id: 'deposit8', value: '5000', num: '5000' },
  { id: 'deposit9', value: '8000', num: '8000' },
  { id: 'deposit10', value: '10000', num: '10000' },
  { id: 'deposit11', value: '15000', num: '15000' },
  { id: 'deposit12', value: '20000', num: '20000' },
  { id: 'deposit13', value: '50000', num: '50000' },
  { id: 'deposit14', value: '80000', num: '80000' },
  { id: 'deposit15', value: '100000', num: '100000' },
];

// 提交表單的處理邏輯
const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { success, data, code } = await topUp(values);
    loadingStore.stopLoading();
    if (success) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '儲值成功',
      });
    } else {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '儲值失敗',
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
            <i class="fas fa-check-circle deposit__item-icon"></i>
            <div class="deposit__item-img">
              <img :src="dbox" alt="" />
            </div>
            <div class="deposit__item-num">{{ deposit.num }}</div>
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

    <div v-if="paymentMethod === 1" class="p-y-48 p-x-48">
      <div class="mallCheckout__form">
        <div
          class="mallCheckout__form-inputs gap-x-24 mallCheckout__form-inputs--credit"
        >
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">
              聯絡電話
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="buyerTelm"
              :class="{
                'mallCheckout__form-input--error': errors.buyerTelm,
              }"
              placeholder="輸入聯絡電話"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.buyerTelm }}
            </p>
          </div>
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">
              電子郵件
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="buyerMail"
              :class="{
                'mallCheckout__form-input--error': errors.buyerMail,
              }"
              placeholder="輸入電子郵件"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.buyerMail }}
            </p>
          </div>
        </div>
        <div
          class="mallCheckout__form-inputs gap-x-24 mallCheckout__form-inputs--credit"
        >
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">
              持卡人姓名
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="cardHolderName"
              :class="{
                'mallCheckout__form-input--error': errors.cardHolderName,
              }"
              placeholder="輸入持卡人姓名"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.cardHolderName }}
            </p>
          </div>
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">卡號</p>
            <input
              class="mallCheckout__form-input"
              v-model="cardNo"
              :class="{
                'mallCheckout__form-input--error': errors.cardNo,
              }"
              placeholder="輸入信用卡卡號"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.cardNo }}
            </p>
          </div>
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">
              有效日期
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="expireDate"
              :class="{
                'mallCheckout__form-input--error': errors.expireDate,
              }"
              placeholder="MM/YY"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.expireDate }}
            </p>
          </div>
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">CVV</p>
            <input
              class="mallCheckout__form-input"
              v-model="cvv"
              :class="{
                'mallCheckout__form-input--error': errors.cvv,
              }"
              placeholder="三位數的CVV"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.cvv }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="deposit__btns">
      <button class="deposit__btn" @click="onSubmit">確認</button>
    </div>
  </div>
</template>
