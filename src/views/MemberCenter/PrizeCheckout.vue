<template>
  <form @submit.prevent="onSubmit">
    <div class="mallCheckout p-24">
      <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
        商品資訊
      </div>
      <Card
        v-for="item in items"
        :key="item.prizeCartItemId"
        custom-class="m-b-24"
      >
        <div class="mallCheckout__product">
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
          <div
            class="mallCheckout__product-item mallCheckout__product-item--img"
          >
            <MImage :src="item.imageUrls[0]" />
          </div>
          <div
            class="mallCheckout__product-item mallCheckout__product-item--name"
          >
            <p class="mallCheckout__text">{{ item.productName }}</p>
          </div>
          <div
            class="mallCheckout__product-item mallCheckout__product-item--price"
          >
            <div v-if="item.sliverPrice !== 0">
              <p class="mallCheckout__text">
                ${{ formatPrice(item.sliverPrice) }}
              </p>
            </div>
          </div>
          <div class="mallCheckout__product-item">
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
                  :value="option.name"
                  v-model="selectedShippingMethod"
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
              <div class="mallCheckout__form-inputs--addr">
                <div class="mallCheckout__form-inputs w-25 w-md-100">
                  <p
                    class="mallCheckout__text"
                    :class="{
                      'mallCheckout__text--required':
                        shippingMethod === 'homeDelivery',
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
              <div class="mallCheckout__form-inputs--addr">
                <div class="mallCheckout__form-inputs w-25 w-md-100">
                  <p
                    class="mallCheckout__text"
                    :class="{
                      'mallCheckout__text--required':
                        shippingMethod === 'homeDelivery',
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
                      'mallCheckout__text--required':
                        shippingMethod === 'homeDelivery',
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
                      'mallCheckout__text--required':
                        shippingMethod === 'homeDelivery',
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
                  v-model="expiryDate"
                  :class="{
                    'mallCheckout__form-input--error': errors.expiryDate,
                  }"
                  placeholder="MM/YY"
                />
                <p class="mallCheckout__text mallCheckout__text--error">
                  {{ errors.expiryDate }}
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
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import MImage from '@/components/frontend/MImage.vue';
import { paymentOptions, shippingOptions } from '@/data/orderOptions';
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
import { useForm } from 'vee-validate';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
const router = useRouter();
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const breadcrumbItems = [{ name: '首頁' }, { name: '賞品盒' }];
const items = ref<any[]>([]);
const billCityOptions = ref<{ value: string; label: string }[]>([]);
const billAreaOptions = ref<{ value: string; label: string }[]>([]);
const shippingCityOptions = ref<{ value: string; label: string }[]>([]);
const shippingAreaOptions = ref<{ value: string; label: string }[]>([]);
const shippingMethods = ref<any[]>([]);

const invoiceInfoOptions = ref<{ value: string; label: string }[]>([
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
]);
const selectedShippingMethod = ref('');
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
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('郵政編碼為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingCity: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('城市為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingArea: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('區域為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingAddress: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => val === 'homeDelivery',
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
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('購買人郵政編碼為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingCity: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('購買人縣市為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingArea: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('購買人區域為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  billingAddress: yup
    .string()
    .nullable()
    .when('shippingMethod', {
      is: (val: string) => val === 'homeDelivery',
      then: (schema) => schema.required('購買人地址為必填'),
      otherwise: (schema) => schema.nullable(),
    }),
  shippingMethod: yup.string().required('請選擇寄送方式'),
  paymentMethod: yup.string().required('請選擇付款方式'),
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
  expiryDate: yup
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
    shippingMethod: shippingOptions[0].value,
    paymentMethod: paymentOptions[0].value,
    invoice: invoiceInfoOptions.value[0].value,
    vehicle: '',
    donationCode: '',
    sameAsBilling: false,
    cardNo: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    buyerTelm: '',
    buyerMail: '',
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
const [cardNo, cardNoProps] = defineField('cardNo');
const [expiryDate, expiryDateProps] = defineField('expiryDate');
const [cvv, cvvProps] = defineField('cvv');

const [cardHolderName, cardHolderNameProps] = defineField('cardHolderName');
const [buyerTelm, buyerTelmProps] = defineField('buyerTelm');
const [buyerMail, buyerMailProps] = defineField('buyerMail');

const selectedShippingPrice = computed(() => {
  const selectedOption = shippingMethods.value.find(
    (option) => option.name === selectedShippingMethod.value
  );
  return selectedOption ? selectedOption.shippingPrice : 0;
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
  const selectedItems = items.value.filter((item) => item.isSelected);

  const payCart = {
    ...values,
    prizeCartItemIds: selectedItems.map((x) => x.prizeCartItemId),
  };

  try {
    loadingStore.startLoading();
    const { success, data } = await payPrizeCartItem(payCart);
    console.log(success);

    loadingStore.stopLoading();
    if (success) {
      router.push({
        name: 'PrizeOrderSuccess',
        params: { orderNumber: data.toString() },
      });
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

const formatPrice = (price: number) => `${price.toFixed(2)}`;

const loadCartItems = async () => {
  loadingStore.startLoading();
  try {
    const [userInfoResponse, cartResponse] = await Promise.all([
      getUserInfo(),
      getPrizeCart(),
    ]);

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
        router.push('/home');
      }
      items.value = data.map((item: { prizeCartItemId: any }) => {
        const existingItem = items.value.find(
          (i) => i.prizeCartItemId === item.prizeCartItemId
        );
        return {
          ...item,
          isSelected: existingItem ? existingItem.isSelected : true,
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
};

onMounted(() => {
  loadCartItems();
  const cityNames = getAllCityNames();
  billCityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  shippingCityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  billAreaOptions.value = [{ value: '', label: '行政區' }];
  shippingAreaOptions.value = [{ value: '', label: '行政區' }];
  fetchShippingMethod();
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
  if (totalProductSize.value === 0) {
    return;
  }

  try {
    // 通过总重量调用 API 获取店家和运费信息
    const size = totalProductSize.value;
    const response = await getShippingMethod(size);
    shippingMethods.value = response.data;
    if (shippingMethods.value.length > 0) {
      selectedShippingMethod.value = shippingMethods.value[0].name;
    }
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
</script>
