<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import dbox from '@/assets/image/dp.png';
import { paymentOptions } from '@/data/orderOptions';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useAuthStore, useDialogStore, useLoadingStore } from '@/stores';
import { useRouter } from 'vue-router';
import { topUp } from '@/services/frontend/paymentService';
import c1 from '@/assets/image/coin-1.png';
import NumberFormatter from '@/components/common/NumberFormatter.vue';

const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const dialogStore = useDialogStore();

// 定义表单验证规则
const schema = yup.object({
  cardHolderName: yup
    .string()
    .required('請輸入信用卡面相同英文姓名,例如王大明(DAMINGWANG)')
    .matches(/^[A-Za-z\s]+$/, '持卡人姓名只能包含字母和空格')
    .min(3, '持卡人姓名必須至少包含 3 個字符')
    .max(50, '持卡人姓名不能超過 50 個字符'),
  cardNo: yup
    .string()
    .required('請輸入您的信用卡號碼')
    .matches(/^[0-9]+$/, '卡號只能包含數字')
    .min(16, '卡號必須為 16 位數')
    .max(16, '卡號必須為 16 位數'),
  expireDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, '無效的過期日期 (MM/YY)')
    .required('請輸入有效到期日'),
  cvv: yup
    .string()
    .length(3, '安全驗證碼必須為 3 位數')
    .required('請輸入安全驗證碼'),
  amount: yup.string().required('請選擇儲值金額'),
  buyerTelm: yup.string().required('請輸入聯絡電話'),
  buyerMail: yup.string().email('無效的電子郵件').required('請輸入電子郵件'),
});

// 使用 useForm 进行表单验证
const { handleSubmit, errors, defineField, setFieldValue, values } = useForm({
  validationSchema: schema,
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

const [cardHolderName] = defineField('cardHolderName');
const [paymentMethod] = defineField('paymentMethod');
const [cardNo] = defineField('cardNo');
const [expireDate] = defineField('expireDate');
const [cvv] = defineField('cvv');
const [amount] = defineField('amount');
const [buyerTelm] = defineField('buyerTelm');
const [buyerMail] = defineField('buyerMail');

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

    <div v-if="paymentMethod === 1" class="p-y-48 p-x-48">
      <div class="mallCheckout__form">
        <div class="flex">
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">
              信用卡號碼
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="cardNo"
              :class="{
                'mallCheckout__form-input--error': errors.cardNo,
              }"
              placeholder="輸入信用卡號碼"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.cardNo }}
            </p>
          </div>
        </div>
        <div class="flex gap-x-24">
          <div class="w-75">
            <p class="mallCheckout__text mallCheckout__text--required">
              到期日(MM/YY)
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
          <div class="w-25">
            <p class="mallCheckout__text mallCheckout__text--required">
              安全驗證碼
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="cvv"
              :class="{
                'mallCheckout__form-input--error': errors.cvv,
              }"
              placeholder="安全驗證碼"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.cvv }}
            </p>
          </div>
        </div>
        <div class="flex">
          <div class="w-100">
            <p class="mallCheckout__text mallCheckout__text--required">
              持卡者名字
            </p>
            <input
              class="mallCheckout__form-input"
              v-model="cardHolderName"
              :class="{
                'mallCheckout__form-input--error': errors.cardHolderName,
              }"
              placeholder="輸入持卡者名字"
            />
            <p class="mallCheckout__text mallCheckout__text--error">
              {{ errors.cardHolderName }}
            </p>
          </div>
        </div>
        <div class="flex gap-x-24">
          <div class="w-50">
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
          <div class="w-50">
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
      </div>
    </div>

    <div class="deposit__btns">
      <button class="deposit__btn" @click="onSubmit">確認</button>
    </div>
  </div>
</template>
