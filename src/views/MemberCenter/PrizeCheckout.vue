<template>
  <form @submit.prevent="onSubmit">
    <div class="mallCheckout p-24">
      <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
        商品資訊
      </div>
      <div class="flex gap-x-24">
        <div class="mallCheckout__btn--selectAll" @click="selectAllItems">
          全選
        </div>
        <div class="mallCheckout__btn--selectAll" @click="recycleItems">
          回收
        </div>
      </div>

      <div class="flex p-x-24 gap-x-12">
        <div class="w-5"></div>
        <div class="w-10"></div>
        <div class="w-60"></div>
        <div class="w-20">
          <p class="mallCheckout__text mallCheckout__text--bold font-size-20">
            可回收銀幣
          </p>
        </div>
        <div class="w-15"></div>
      </div>
      <Card
        v-for="item in items"
        :key="item.prizeCartItemId"
        custom-class="m-b-24"
      >
        <div class="flex p-x-24 gap-x-12 items-center">
          <div class="w-5">
            <div
              v-if="items.length > 0"
              class="mallCheckout__product-item mallCheckout__product-item--selected"
            >
              <input
                type="checkbox"
                v-model="item.isSelected"
                @change="onItemSelectionChange"
              />
            </div>
          </div>
          <div class="w-10"><MImage :src="item.imageUrls[0]" /></div>
          <div class="w-60">
            <p class="mallCheckout__text">{{ item.productName }}</p>
          </div>
          <div class="w-20 mallCheckout__product-item--price text-center">
            <div v-if="item.sliverPrice !== 0">
              <p class="mallCheckout__text">
                $<NumberFormatter :number="item.sliverPrice ?? 0" />
              </p>
            </div>
          </div>
          <div class="w-15">
            <div
              v-if="item.sliverPrice !== 0"
              class="mallCheckout__product-item mallCheckout__product-item--delete"
              @click="deleteProduct(item)"
            >
              <i class="fa-solid fa-trash-can"></i>
              <p class="mallCheckout__text">回收賞品</p>
            </div>
          </div>
        </div>
      </Card>
      <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
        寄送資訊
      </div>
      <Card>
        <div class="mallCheckout__shippings">
          <div class="mallCheckout__shipping">
            <div
              class="mallCheckout__shipping-item mallCheckout__shipping-item--title"
            >
              寄送
            </div>
            <div
              class="mallCheckout__shipping-item mallCheckout__shipping-item--options"
            >
              <div
                v-for="option in shippingMethods"
                :key="option.name"
                class="mallCheckout__shipping-option"
              >
                <input
                  type="radio"
                  :value="option.code"
                  v-model="shippingMethod"
                  :id="option.name"
                />
                <label :for="option.name"
                  >{{ option.name }} (${{ option.shippingPrice }})</label
                >
              </div>
            </div>
            <div
              class="mallCheckout__shipping-item mallCheckout__shipping-item--price"
            >
              <p class="mallCheckout__text">${{ selectedShippingPrice }}</p>
            </div>
          </div>
          <div class="mallCheckout__divider"></div>
          <div class="mallCheckout__billInfo">
            <div class="mallCheckout__form">
              <div
                class="mallCheckout__form-inputs gap-x-24 mallCheckout__form-inputs--names"
              >
                <div class="w-50 w-md-100">
                  <p class="mallCheckout__text mallCheckout__text--required">
                    購買人姓名
                  </p>
                  <input
                    class="mallCheckout__form-input"
                    v-model="billingName"
                    v-bind="billingNameProps"
                    :class="{
                      'mallCheckout__form-input--error': errors.billingName,
                    }"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.billingName }}
                  </p>
                </div>
                <div class="w-50 w-md-100">
                  <p class="mallCheckout__text mallCheckout__text--required">
                    購買人Email
                  </p>
                  <input
                    class="mallCheckout__form-input"
                    v-model="billingEmail"
                    v-bind="billingEmailProps"
                    :class="{
                      'mallCheckout__form-input--error': errors.billingEmail,
                    }"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.billingEmail }}
                  </p>
                </div>
              </div>
              <div class="mallCheckout__form-inputs">
                <p class="mallCheckout__text mallCheckout__text--required">
                  購買人電話
                </p>
                <input
                  class="mallCheckout__form-input"
                  v-model="billingPhone"
                  v-bind="billingPhoneProps"
                  :class="{
                    'mallCheckout__form-input--error': errors.billingPhone,
                  }"
                />
                <p class="mallCheckout__text mallCheckout__text--error">
                  {{ errors.billingPhone }}
                </p>
              </div>
              <div
                class="mallCheckout__form-inputs--addr"
                v-if="!['sevenEleven', 'family'].includes(shippingMethod)"
              >
                <div class="mallCheckout__form-inputs w-25 w-md-100">
                  <p
                    class="mallCheckout__text"
                    :class="{
                      'mallCheckout__text--required': ![
                        'sevenEleven',
                        'family',
                      ].includes(shippingMethod),
                    }"
                  >
                    購買人地址
                  </p>
                  <MSelect
                    :options="billCityOptions"
                    v-model="billingCity"
                    v-bind="billingCityProps"
                    customClass="mselect--checkoutFormBill"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.billingCity }}
                  </p>
                </div>
                <div class="mallCheckout__form-inputs w-25 w-md-100">
                  <MSelect
                    :options="billAreaOptions"
                    v-model="billingArea"
                    v-bind="billingAreaProps"
                    customClass="mselect--checkoutFormBill"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.billingArea }}
                  </p>
                </div>
                <div class="mallCheckout__form-inputs w-50 w-md-100">
                  <input
                    class="mallCheckout__form-input"
                    v-model="billingAddress"
                    v-bind="billingAddressProps"
                    :class="{
                      'mallCheckout__form-input--error': errors.billingAddress,
                    }"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.billingAddress }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mallCheckout__divider"></div>
          <div class="mallCheckout__shippingInfo">
            <div class="mallCheckout__form">
              <div class="mallCheckout__form-inputs">
                <label class="mallCheckout__checkbox-label">
                  <input type="checkbox" v-model="sameAsBilling" />
                  同購買人資料
                </label>
              </div>
              <div
                class="mallCheckout__form-inputs gap-x-24 mallCheckout__form-inputs--names"
              >
                <div class="w-50 w-md-100">
                  <p class="mallCheckout__text mallCheckout__text--required">
                    收貨人姓名
                  </p>
                  <input
                    class="mallCheckout__form-input"
                    v-model="shippingName"
                    v-bind="shippingNameProps"
                    :class="{
                      'mallCheckout__form-input--error': errors.shippingName,
                    }"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.shippingName }}
                  </p>
                </div>
                <div class="w-50 w-md-100">
                  <p class="mallCheckout__text mallCheckout__text--required">
                    收貨人Email
                  </p>
                  <input
                    class="mallCheckout__form-input"
                    v-model="shippingEmail"
                    v-bind="shippingEmailProps"
                    :class="{
                      'mallCheckout__form-input--error': errors.shippingEmail,
                    }"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.shippingEmail }}
                  </p>
                </div>
              </div>
              <div class="mallCheckout__form-inputs">
                <p class="mallCheckout__text mallCheckout__text--required">
                  收貨人電話
                </p>
                <input
                  class="mallCheckout__form-input"
                  v-model="shippingPhone"
                  v-bind="shippingPhoneProps"
                  :class="{
                    'mallCheckout__form-input--error': errors.shippingPhone,
                  }"
                />
                <p class="mallCheckout__text mallCheckout__text--error">
                  {{ errors.shippingPhone }}
                </p>
              </div>
              <div
                class="mallCheckout__form-inputs--addr"
                v-if="!['sevenEleven', 'family'].includes(shippingMethod)"
              >
                <div class="mallCheckout__form-inputs w-25 w-md-100">
                  <p
                    class="mallCheckout__text"
                    :class="{
                      'mallCheckout__text--required': ![
                        'sevenEleven',
                        'family',
                      ].includes(shippingMethod),
                    }"
                  >
                    收貨人城市
                  </p>
                  <MSelect
                    :options="shippingCityOptions"
                    v-model="shippingCity"
                    v-bind="shippingCityProps"
                    customClass="mselect--checkoutFormBill"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.shippingCity }}
                  </p>
                </div>
                <div class="mallCheckout__form-inputs w-25 w-md-100">
                  <p
                    class="mallCheckout__text"
                    :class="{
                      'mallCheckout__text--required': ![
                        'sevenEleven',
                        'family',
                      ].includes(shippingMethod),
                    }"
                  >
                    收貨人區域
                  </p>
                  <MSelect
                    :options="shippingAreaOptions"
                    v-model="shippingArea"
                    v-bind="shippingAreaProps"
                    customClass="mselect--checkoutFormBill"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.shippingArea }}
                  </p>
                </div>
                <div class="mallCheckout__form-inputs w-50 w-md-100">
                  <p
                    class="mallCheckout__text"
                    :class="{
                      'mallCheckout__text--required': ![
                        'sevenEleven',
                        'family',
                      ].includes(shippingMethod),
                    }"
                  >
                    收貨人地址
                  </p>
                  <input
                    class="mallCheckout__form-input"
                    v-model="shippingAddress"
                    v-bind="shippingAddressProps"
                    :class="{
                      'mallCheckout__form-input--error': errors.shippingAddress,
                    }"
                  />
                  <p class="mallCheckout__text mallCheckout__text--error">
                    {{ errors.shippingAddress }}
                  </p>
                </div>
              </div>
              <div
                class="mallCheckout__form-inputs--addr"
                v-if="['sevenEleven', 'family'].includes(shippingMethod)"
              >
                <div v-if="storename && storeid && shopId">
                  <p class="mallCheckout__text">門市名稱: {{ storename }}</p>
                </div>
                <div v-else>
                  <button
                    type="button"
                    class="mallCheckout__button"
                    @click="selectStore"
                  >
                    請選擇門市
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
        優惠及結帳
      </div>
      <Card>
        <div class="p-y-48 p-x-48">
          <div class="grid">
            <div class="col-50 mallCheckout__form">
              <div
                class="mallCheckout__invoice-item mallCheckout__invoice-item--title mallCheckout__text"
              >
                發票
              </div>
              <div
                class="mallCheckout__invoice-item mallCheckout__invoice-item--select"
              >
                <MSelect
                  v-model="invoice"
                  :options="invoiceInfoOptions"
                  customClass="mallCheckout__invoice-select"
                />
              </div>
              <p class="mallCheckout__text mallCheckout__text--error">
                {{ errors.invoice }}
              </p>
            </div>
            <div class="col-100"></div>
            <div class="col-50 mallCheckout__form">
              <div v-if="invoice === 'donation'" class="">
                <p class="mallCheckout__text mallCheckout__text--required">
                  愛心碼
                </p>
                <input
                  class="mallCheckout__form-input"
                  v-model="donationCode"
                  :class="{
                    'mallCheckout__form-input--error': errors.donationCode,
                  }"
                  placeholder="輸入愛心碼"
                />
                <p class="mallCheckout__text mallCheckout__text--error">
                  {{ errors.donationCode }}
                </p>
              </div>
              <div v-if="invoice === 'mobileCarrier'" class="">
                <p class="mallCheckout__text mallCheckout__text--required">
                  手機載具號碼
                </p>
                <input
                  class="mallCheckout__form-input"
                  v-model="vehicle"
                  :class="{
                    'mallCheckout__form-input--error': errors.vehicle,
                  }"
                  placeholder="輸入手機載具號碼"
                />
                <p class="mallCheckout__text mallCheckout__text--error">
                  {{ errors.vehicle }}
                </p>
              </div>
            </div>
          </div>

          <div class="mallCheckout__divider"></div>

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
                <input
                  type="radio"
                  :value="option.value"
                  v-model="paymentMethod"
                />
                <label>{{ option.name }} </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div class="mallCheckout__total">
        <div class="mallCheckout__total-item">
          <p class="mallCheckout__text mallCheckout__text--title">運費：</p>
          <p class="mallCheckout__text mallCheckout__text--money">
            ${{ formatPrice(totalShippingAmount) }}
          </p>
        </div>
        <div class="mallCheckout__total-item">
          <p class="mallCheckout__text mallCheckout__text--title">折扣：</p>
          <p class="mallCheckout__text mallCheckout__text--money">
            -${{ formatPrice(totalDiscountAmount) }}
          </p>
        </div>
        <div class="mallCheckout__total-item m-t-36">
          <p class="mallCheckout__text mallCheckout__text--title">總金額：</p>
          <p class="mallCheckout__text mallCheckout__text--totalMoney">
            ${{ formatPrice(finalAmount) }}
          </p>
        </div>
      </div>
      <div class="mallCheckout__btns">
        <div class="mallCheckout__btn mallCheckout__btn--back" @click="goBack">
          回上頁
        </div>

        <button class="mallCheckout__btn mallCheckout__btn--checkout">
          結帳
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import MSelect from '@/components/common/MSelect.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import MImage from '@/components/frontend/MImage.vue';
import { AppEnv } from '@/config/appEnv';
import { paymentOptions } from '@/data/orderOptions';
import { expressQuery } from '@/services/frontend/expressService';
import { payPrizeCartItem } from '@/services/frontend/orderService';
import { removePrizeCartItem } from '@/services/frontend/prizeCartItemService';
import { getPrizeCart } from '@/services/frontend/prizeCartService';
import { getShippingMethod } from '@/services/frontend/shippingMethodService';
import {
  getAllCityNames,
  getAreaListByCityName,
  getZipCodeByCityAndAreaName,
} from '@/services/frontend/taiwanCitiesService';
import { getUserInfo } from '@/services/frontend/userService';
import { useDialogStore, useLoadingStore } from '@/stores';
import AFTEEUtils from '@/utils/AFTEEUtils';
import { loadState, removeState, saveState } from '@/utils/Localstorage';
import axios from 'axios';
import { useForm } from 'vee-validate';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const storename = route.query.storename || '';
const storeid = route.query.storeid || '';
const storeaddress = route.query.storeaddress || '';
let isInitialSetup = true;

const items = ref<any[]>([]);
const billCityOptions = ref<{ value: string; label: string }[]>([]);
const billAreaOptions = ref<{ value: string; label: string }[]>([
  { value: '', label: '行政區' },
]);
const shippingCityOptions = ref<{ value: string; label: string }[]>([]);
const shippingAreaOptions = ref<{ value: string; label: string }[]>([
  { value: '', label: '行政區' },
]);

const shippingMethods = ref<any[]>([]);

const invoiceInfoOptions = ref<{ value: string; label: string }[]>([
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
]);
const schema = yup.object({
  shippingName: yup.string().required('收貨人姓名為必填'),
  shippingEmail: yup
    .string()
    .email('郵箱格式不正確')
    .required('收貨人郵箱為必填'),
  shippingPhone: yup.string().required('收貨人電話為必填'),
  shippingZipCode: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('郵政編碼為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingCity: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('城市為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingArea: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('區域為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingAddress: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('詳細地址為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingName: yup.string().required('購買人姓名為必填'),
  billingEmail: yup
    .string()
    .email('郵箱格式不正確')
    .required('購買人Email為必填'),
  billingPhone: yup.string().required('購買人電話為必填'),
  billingZipCode: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('購買人郵政編碼為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingCity: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('購買人縣市為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingArea: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('購買人區域為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingAddress: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => !['sevenEleven', 'family'].includes(val),
      then: (schema) => schema.required('購買人地址為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  invoice: yup.lazy((_, { parent }) => {
    const matchedOption = paymentOptions.find(
      (opt) => opt.value === parent.paymentMethod
    );
    const priceType = matchedOption?.priceType;

    if (priceType === 1 || priceType === 2) {
      return yup.string().nullable();
    }
    return yup.string().required('發票資訊為必填');
  }),
});
const { handleSubmit, errors, defineField, setFieldValue, values } = useForm({
  validationSchema: schema,
  initialValues: {
    shippingName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingZipCode: '',
    shippingCity: '',
    shippingArea: '',
    shippingAddress: '',
    billingName: '',
    billingEmail: '',
    billingPhone: '',
    billingZipCode: '',
    billingCity: '',
    billingArea: '',
    billingAddress: '',
    shippingMethod: '',
    paymentMethod: paymentOptions[0].value,
    invoice: invoiceInfoOptions.value[0].value,
    vehicle: '',
    donationCode: '',
    sameAsBilling: false,
    shopId: storeid,
    shopName: storename,
    shopAddress: storeaddress,
  },
});

const [shippingName, shippingNameProps] = defineField('shippingName');
const [shippingEmail, shippingEmailProps] = defineField('shippingEmail');
const [shippingPhone, shippingPhoneProps] = defineField('shippingPhone');
const [shippingZipCode, shippingZipCodeProps] = defineField('shippingZipCode');
const [shippingCity, shippingCityProps] = defineField('shippingCity');
const [shippingArea, shippingAreaProps] = defineField('shippingArea');
const [shippingAddress, shippingAddressProps] = defineField('shippingAddress');
const [billingName, billingNameProps] = defineField('billingName');
const [billingEmail, billingEmailProps] = defineField('billingEmail');
const [billingPhone, billingPhoneProps] = defineField('billingPhone');
const [billingZipCode, billingZipCodeProps] = defineField('billingZipCode');
const [billingCity, billingCityProps] = defineField('billingCity');
const [billingArea, billingAreaProps] = defineField('billingArea');
const [billingAddress, billingAddressProps] = defineField('billingAddress');
const [shippingMethod, shippingMethodProps] = defineField('shippingMethod');
const [paymentMethod, paymentMethodProps] = defineField('paymentMethod');
const [invoice, invoiceProps] = defineField('invoice');
const [vehicle, vehicleProps] = defineField('vehicle');
const [donationCode, donationCodeProps] = defineField('donationCode');
const [sameAsBilling, sameAsBillingProps] = defineField('sameAsBilling');
const [shopId] = defineField('shopId');
const selectedShippingPrice = ref(0);
watch(shippingMethod, (newMethod) => {
  const selectedOption = shippingMethods.value.find(
    (option) => option.code === newMethod
  );

  selectedShippingPrice.value = selectedOption
    ? selectedOption.shippingPrice
    : 0;
  if (!isInitialSetup) {
    setFieldValue('shopId', '');
  }
});
const totalProductSize = computed(() => {
  return items.value
    .filter((item) => item.isSelected)
    .reduce((sum: any, item: { size: any }) => sum + item.size, 0);
});

const totalShippingAmount = computed(() => {
  return selectedShippingPrice.value;
});

const totalDiscountAmount = computed(() => {
  return 0; // 可根據優惠券或折扣碼計算折扣金額
});

const finalAmount = computed(() => {
  return totalShippingAmount.value - totalDiscountAmount.value;
});

const goBack = () => {
  router.back();
};

const onSubmit = handleSubmit(async (values: any) => {
  if (
    ['sevenEleven', 'family'].includes(values.shippingMethod) &&
    !values.shopId
  ) {
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '請選擇門市！',
    });
    return;
  }
  const selectedItems = items.value.filter((item) => item.isSelected);

  const paymentMethod =
    values.shippingMethod === 'pickUp' ? '3' : values.paymentMethod;
  const matchedOption = paymentOptions.find(
    (opt) => opt.value === paymentMethod
  );

  const priceType = matchedOption?.priceType ?? null;

  const payCart = {
    ...values,
    prizeCartItemIds: selectedItems.map((x) => x.prizeCartItemId),
    paymentMethod,
    priceType,
  };

  const isV = await validateForm();
  if (!isV) {
    return;
  }

  try {
    loadingStore.startLoading();
    const { success, data } = await payPrizeCartItem(payCart);
    const { data: userInfo } = await getUserInfo();
    loadingStore.stopLoading();
    if (success) {
      if (values.shippingMethod === 'pickUp') {
        router.push({
          name: 'PrizeOrderSuccess',
          params: { orderNumber: data.orderNumber },
        });
      } else {
        if (values.paymentMethod === 1) {
          const form = document.createElement('form');
          form.action = AppEnv.PAYMENT_GATEWAY_URL;
          form.method = 'post';

          const appendField = (name, value) => {
            const input = document.createElement('input');
            input.type = 'input';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          };

          appendField('Send_Type', '0');
          appendField('Pay_Mode_No', '2');
          appendField('CustomerId', AppEnv.PAYMENT_CUSTOMER_ID);
          appendField('Order_No', data.orderNumber);
          appendField('TransMode', '1');
          appendField('Amount', finalAmount.value);
          appendField('Installment', '0');
          appendField('TransCode', '00');
          appendField('Buyer_Memo', '賞品運費');
          appendField('Return_url', `${window.location.origin}/paymentCBO`);

          document.body.appendChild(form);

          dialogStore
            .openInfoDialog({
              title: '系統通知',
              message: `我們即將為您跳轉至付款頁面，請耐心等待。在完成所有流程之前，為確保交易順利進行，請勿關閉或刷新此畫面。感謝您的配合！`,
            })
            .then(() => {
              form.submit();
            });

          setTimeout(() => {
            if (dialogStore.isInfoDialogOpen.value) {
              dialogStore.closeInfoDialog();
            }
          }, 3000);
        } else if (values.paymentMethod === 2) {
          const form = document.createElement('form');
          form.action = AppEnv.PAYMENT_GATEWAY_URL;
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
          appendField('CustomerId', AppEnv.PAYMENT_CUSTOMER_ID);
          appendField('Order_No', data.orderNumber);
          appendField('Amount', finalAmount.value);
          appendField('Buyer_Name', userInfo.nickname);
          appendField('Buyer_Telm', userInfo.phoneNumber);
          appendField('Buyer_Mail', userInfo.email);
          appendField('Buyer_Memo', '儲值代幣');
          appendField(
            'Callback_Url',
            'https://api.onemorelottery.tw:8081/payment/paymentCallback'
          );

          // Append the form to the body and submit it
          document.body.appendChild(form);
          form.submit();
        } else if (values.paymentMethod === 4) {
          const preRegisterPayload = {
            pre_token: '',
            pub_key: AppEnv.AFTEE_PUB_KEY,
            payment: {
              amount: Number(finalAmount.value),
              shop_transaction_no: data.orderNumber,
              user_no: userInfo.userUid || '',
              sales_settled: true,
              transaction_options: [],
              description_trans: '',
              checksum: '', // 若後端提供可填入
              customer: {
                customer_name: values.shippingName,
                phone_number: values.shippingPhone,
                address:
                  `${values.shippingCity}${values.shippingArea}${values.shippingAddress}` ||
                  '未填地址',
                email: values.shippingEmail,
                additional_info_code: 'FI',
              },
              dest_customers: [],
              items: [
                ...items.value
                  .filter((item) => item.isSelected)
                  .map((item) => ({
                    shop_item_id:
                      item.productCode || item.productId || 'UNKNOWN_ID',
                    item_name: item.productName || '未命名商品',
                    item_category: item.categoryName || '商品盒',
                    item_price: 0,
                    item_count: item.quantity || 1,
                  })),
                {
                  shop_item_id: 'SHIPPING_FEE',
                  item_name: '運費',
                  item_category: '物流費用',
                  item_price: selectedShippingPrice.value || 0,
                  item_count: 1,
                },
              ],

              validation_datetime: '',
              return_url: `${window.location.origin}/paymentCBO`,
            },
          };

          AFTEEUtils.generateAndAttachChecksum(
            preRegisterPayload.payment,
            AppEnv.AFTEE_SECRET_KEY
          );
          try {
            const res = await axios.post(
              AppEnv.AFTEE_API_URL + 'v1/transactions/pre_register',
              preRegisterPayload
            );

            const result = res.data;

            if (result.pre_register && result.pre_register_identifier) {
              const redirectUrl = `${AppEnv.AFTEE_API_URL}settlement/${result.shop_transaction_no}?identifier=${result.pre_register_identifier}`;
              window.location.href = redirectUrl;
            } else {
              await dialogStore.openInfoDialog({
                title: 'AFTEE 回應失敗',
                message: '無法產生交易識別碼，請稍後再試。',
              });
            }
          } catch (error) {
            console.error(error);
            await dialogStore.openInfoDialog({
              title: '系統錯誤',
              message: '與 AFTEE 連線失敗，請稍後再試。',
            });
          }
        } else {
          router.push({
            name: 'PrizeOrderSuccess',
            params: { orderNumber: data.orderNumber },
          });
        }
      }
    } else {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: `支付失敗`,
      });
    }
  } catch (error) {
    loadingStore.stopLoading();
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: `支付失敗`,
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

const formatPrice = (price: number) => `${price.toFixed(2)}`;

const loadCartItems = async () => {
  loadingStore.startLoading();
  try {
    const [userInfoResponse, cartResponse] = await Promise.all([
      getUserInfo(),
      getPrizeCart(),
    ]);
    loadingStore.stopLoading();
    const { data: userInfo } = userInfoResponse;
    const {
      phoneNumber,
      city,
      area,
      address,
      addressName,
      zipCode,
      username,
      vehicle,
    } = userInfo;

    const { success, data } = cartResponse;
    setFieldValue('vehicle', vehicle || '');
    setFieldValue('billingEmail', username || '');
    setFieldValue('billingName', addressName || '');
    setFieldValue('billingPhone', phoneNumber || '');
    setFieldValue('billingAddress', address || '');
    setFieldValue('billingZipCode', zipCode || '');
    setFieldValue('billingCity', city || '');
    await nextTick();
    setFieldValue('billingArea', area || '');
    if (success) {
      if (!data || data.length === 0) {
        await dialogStore.openInfoDialog({
          title: '系統通知',
          message: '賞品盒無賞品，跳轉至首頁',
        });
        router.push('/home');
      }

      const selectedItems: any = loadState('selectedItems');

      items.value = data.map((x) => {
        return {
          ...x,
          isSelected: selectedItems ? selectedItems[x.prizeCartItemId] : false,
        };
      });
    } else {
      console.error('Failed to load cart items:', data.message);
    }
  } catch (error) {
    console.error('Failed to load cart items:', error);
  }
  loadingStore.stopLoading();
};

const deleteProduct = async (item: any) => {
  const result = await dialogStore.openYesNoDialog({
    title: '系統通知',
    message: `
    <span style="color: red; font-weight: bold;">
      *注意：
    </span> 
    <span>
      兌換視同「放棄出貨商品」之權利。請確認是否確定要兌換？
    </span>`,
  });

  if (result) {
    try {
      loadingStore.startLoading();

      const response = await removePrizeCartItem(item.prizeCartItemId);
      loadingStore.stopLoading();
      if (response.success) {
        // 重新加載購物車項以更新UI
        await loadCartItems();
      } else {
        console.error('刪除購物車項失敗:', response.message);
      }
    } catch (error) {
      loadingStore.stopLoading();
      console.error('刪除購物車項時發生錯誤:', error);
    }
    loadingStore.stopLoading();
  }
};

onMounted(async () => {
  await fetchShippingMethod();
  await loadCartItems();
  const cityNames = getAllCityNames();
  billCityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  shippingCityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  const shippingData: any = loadState('shippingData');

  if (shippingData) {
    setFieldValue('shippingName', shippingData.shippingName || '');
    setFieldValue('shippingEmail', shippingData.shippingEmail || '');
    setFieldValue('shippingPhone', shippingData.shippingPhone || '');
    setFieldValue('shippingZipCode', shippingData.shippingZipCode || '');
    setFieldValue('shippingCity', shippingData.shippingCity || '');
    await nextTick();
    setFieldValue('shippingArea', shippingData.shippingArea || '');
    setFieldValue('shippingAddress', shippingData.shippingAddress || '');
    setFieldValue('billingName', shippingData.billingName || '');
    setFieldValue('billingEmail', shippingData.billingEmail || '');
    setFieldValue('billingPhone', shippingData.billingPhone || '');
    setFieldValue('billingZipCode', shippingData.billingZipCode || '');
    setFieldValue('billingCity', shippingData.billingCity || '');
    await nextTick();
    setFieldValue('billingArea', shippingData.billingArea || '');
    setFieldValue('billingAddress', shippingData.billingAddress || '');
    setFieldValue('shippingMethod', shippingData.shippingMethod || '');
    setFieldValue(
      'paymentMethod',
      shippingData.paymentMethod || paymentOptions[0].value
    );
    setFieldValue('shopId', storeid);
    removeState('shippingData');
    removeState('selectedItems');
  }
  setTimeout(() => {
    isInitialSetup = false;
  }, 100);
});

watch(billingCity, (newCity) => {
  if (newCity) {
    setFieldValue('billingArea', '');
    const areas = getAreaListByCityName(newCity);
    billAreaOptions.value = [
      { value: '', label: '行政區' },
      ...areas.map((area) => ({
        value: area.areaName,
        label: area.areaName,
      })),
    ];
  } else {
    billAreaOptions.value = [{ value: '', label: '行政區' }];
  }
});

watch(shippingCity, (newCity) => {
  if (newCity) {
    setFieldValue('shippingArea', '');
    const areas = getAreaListByCityName(newCity);
    shippingAreaOptions.value = [
      { value: '', label: '行政區' },
      ...areas.map((area) => ({
        value: area.areaName,
        label: area.areaName,
      })),
    ];
  } else {
    shippingAreaOptions.value = [{ value: '', label: '行政區' }];
  }
});

watch(shippingArea, (newArea) => {
  if (newArea) {
    setFieldValue('shippingZipCode', '');
    const zipCode = getZipCodeByCityAndAreaName(shippingCity.value, newArea);
    if (zipCode) {
      setFieldValue('shippingZipCode', zipCode);
    }
  } else {
    setFieldValue('shippingZipCode', '');
  }
});

watch(billingArea, (newArea) => {
  if (newArea) {
    setFieldValue('billingZipCode', '');
    const zipCode = getZipCodeByCityAndAreaName(billingCity.value, newArea);

    if (zipCode) {
      setFieldValue('billingZipCode', zipCode);
    }
  } else {
    setFieldValue('billingZipCode', '');
  }
});

const fetchShippingMethod = async () => {
  try {
    // 通过总重量调用 API 获取店家和运费信息
    const size = totalProductSize.value;
    const response = await getShippingMethod(size);
    shippingMethods.value = response.data;
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
  }
};
watch(
  items,
  () => {
    if (items.value.length > 0) {
      fetchShippingMethod();
    }
  },
  { deep: true, immediate: true }
);

watch(sameAsBilling, async (newValue) => {
  if (newValue) {
    const billingValues = values;
    setFieldValue('shippingName', billingValues.billingName);
    setFieldValue('shippingEmail', billingValues.billingEmail);
    setFieldValue('shippingPhone', billingValues.billingPhone);
    setFieldValue('shippingZipCode', billingValues.billingZipCode);
    setFieldValue('shippingCity', billingValues.billingCity);
    setFieldValue('shippingAddress', billingValues.billingAddress);
    await nextTick();
    setFieldValue('shippingArea', billingValues.billingArea);
  } else {
    setFieldValue('shippingName', '');
    setFieldValue('shippingEmail', '');
    setFieldValue('shippingPhone', '');
    setFieldValue('shippingZipCode', '');
    setFieldValue('shippingCity', '');
    setFieldValue('shippingArea', '');
    setFieldValue('shippingAddress', '');
  }
});

const onItemSelectionChange = (item: { isSelected: boolean }) => {
  item.isSelected = !item.isSelected;
  fetchShippingMethod();
};

const selectStore = async () => {
  const { success, data } = await expressQuery(shippingMethod.value, 2);
  if (success) {
    const selectedItems = items.value.reduce(
      (acc: Record<string, boolean>, item) => {
        acc[item.prizeCartItemId] = item.isSelected;
        return acc;
      },
      {}
    );
    saveState('shippingData', values);
    saveState('selectedItems', selectedItems);
    location.href = data;
  } else {
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: '系統錯誤。',
    });
  }
};

const selectAllItems = () => {
  items.value.forEach((item) => {
    item.isSelected = true;
  });
};

const recycleItems = async () => {
  const result = await dialogStore.openYesNoDialog({
    title: '系統通知',
    message: '是否確認進行賞品回收？',
  });
  if (result) {
    const selectedItems = items.value.filter((item) => item.isSelected);
    for (const item of selectedItems) {
      try {
        loadingStore.startLoading();

        const response = await removePrizeCartItem(item.prizeCartItemId);
        loadingStore.stopLoading();
        if (response.success) {
          await loadCartItems();
        } else {
          console.error('刪除購物車項失敗:', response.message);
        }
      } catch (error) {
        loadingStore.stopLoading();
        console.error('刪除購物車項時發生錯誤:', error);
      }
      loadingStore.stopLoading();
    }
  }
};
</script>
