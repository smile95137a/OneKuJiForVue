<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mallCheckout">
    <div class="mallCheckout__items">
      <!-- 商品資訊 -->
      <div class="mallCheckout__item">
        <div class="mallCheckout__item-title">商品資訊</div>
        <div class="mallCheckout__item-main">
          <Card v-for="item in cartStore.items" :key="item.id">
            <div class="cart-item">
              <input
                type="checkbox"
                v-model="item.isSelected"
                class="cart-item__checkbox"
              />
              <span
                >{{ item.name }} - {{ item.quantity }}件 - ${{
                  item.price
                }}</span
              >
              <div class="cart-item__quantity">
                <button @click="decreaseQuantity(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)">+</button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- 寄送資訊 -->
      <div class="mallCheckout__item">
        <div class="mallCheckout__item-title">寄送資訊</div>
        <div class="mallCheckout__item-main">
          <div class="mallCheckout__shipping">
            <label>
              <input
                type="radio"
                name="shipping"
                value="宅配"
                v-model="shippingMethod"
              />
              宅配 ({{ formatPrice(150) }})
              <div class="mallCheckout__address">
                收件地址：台北市中正區重慶南路一段1號1樓
              </div>
            </label>
            <div class="mallCheckout__shipping-options">
              <label v-for="method in shippingOptions" :key="method.name">
                <input
                  type="radio"
                  name="shipping"
                  :value="method.name"
                  v-model="shippingMethod"
                />
                {{ method.name }} ({{ formatPrice(method.price) }})
              </label>
            </div>
            <div class="mallCheckout__total-shipping">
              {{ formatPrice(selectedShippingPrice) }}
            </div>
          </div>
          <div class="mallCheckout__invoice">
            <label for="invoice">發票</label>
            <select id="invoice" v-model="invoiceOption">
              <option value="donation">發票捐贈</option>
              <option value="personal">個人發票</option>
              <option value="company">公司發票</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 優惠及結帳 -->
      <div class="mallCheckout__item">
        <div class="mallCheckout__item-title">優惠及結帳</div>
        <div class="mallCheckout__item-main">
          <div class="mallCheckout__discount">
            <label>
              <input
                type="radio"
                name="discount"
                value="coupon"
                v-model="discountMethod"
              />
              優惠券
              <select v-model="selectedCoupon">
                <option
                  v-for="coupon in coupons"
                  :key="coupon.id"
                  :value="coupon.id"
                >
                  {{ coupon.description }} (有效至{{ coupon.expiry }})
                </option>
              </select>
            </label>
            <label>
              <input
                type="radio"
                name="discount"
                value="code"
                v-model="discountMethod"
              />
              優惠碼
              <input
                type="text"
                v-model="discountCode"
                placeholder="請輸入優惠碼"
              />
            </label>
            <div class="mallCheckout__total-discount">
              - {{ formatPrice(discountAmount) }}
            </div>
          </div>
          <div class="mallCheckout__payment">
            <label>
              <input
                type="radio"
                name="payment"
                value="credit"
                v-model="paymentMethod"
              />
              信用卡一次付清
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="store"
                v-model="paymentMethod"
              />
              超商取貨付款
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 結算總額 -->
    <div class="mallCheckout__total">
      <div class="mallCheckout__total-item">
        <p class="mallCheckout__text mallCheckout__text--title">商品總額：</p>
        <p class="mallCheckout__text mallCheckout__text--money">
          ${{ cartStore.totalPrice }}
        </p>
      </div>
      <div class="mallCheckout__total-item">
        <p class="mallCheckout__text mallCheckout__text--title">運費：</p>
        <p class="mallCheckout__text mallCheckout__text--money">
          ${{ formatPrice(selectedShippingPrice) }}
        </p>
      </div>
      <div class="mallCheckout__total-item">
        <p class="mallCheckout__text mallCheckout__text--title">折扣：</p>
        <p class="mallCheckout__text mallCheckout__text--money">
          - ${{ formatPrice(discountAmount) }}
        </p>
      </div>
      <div class="mallCheckout__total-item m-t-36">
        <p class="mallCheckout__text mallCheckout__text--title">總金額：</p>
        <p class="mallCheckout__text mallCheckout__text--totalMoney">
          ${{ finalAmount }}
        </p>
      </div>
    </div>

    <!-- 結帳按鈕 -->
    <div class="mallCheckout__btns">
      <div class="mallCheckout__btn mallCheckout__btn--back" @click="goBack">
        回上頁
      </div>
      <div
        class="mallCheckout__btn mallCheckout__btn--checkout"
        @click="checkout"
      >
        結帳
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import { useCartStore } from '@/stores';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const breadcrumbItems = [{ name: '首頁' }, { name: '結帳' }];

const cartStore = useCartStore();

const shippingOptions = [
  { name: '7-11 超商取貨', price: 60 },
  { name: '全家超商取貨', price: 60 },
  { name: '萊爾富超商取貨', price: 60 },
  { name: '中華郵政郵寄', price: 100 },
];

const shippingMethod = ref('宅配');
const selectedShippingPrice = computed(() => {
  const selectedOption = shippingOptions.find(
    (option) => option.name === shippingMethod.value
  );
  return selectedOption ? selectedOption.price : 150;
});

const invoiceOption = ref('donation');

const coupons = [{ id: 1, description: '滿$499折$50', expiry: '2024/8/25' }];

const discountMethod = ref('coupon');
const selectedCoupon = ref(coupons[0].id);
const discountCode = ref('');
const discountAmount = computed(() => {
  if (discountMethod.value === 'coupon') {
    const selected = coupons.find(
      (coupon) => coupon.id === selectedCoupon.value
    );
    return selected ? 50 : 0;
  } else if (discountMethod.value === 'code' && discountCode.value) {
    return 50; // 假設優惠碼固定折抵 $50
  }
  return 0;
});

const paymentMethod = ref('credit');

const finalAmount = computed(() => {
  return (
    cartStore.totalPrice + selectedShippingPrice.value - discountAmount.value
  );
});

const goBack = () => {
  router.back();
};

const checkout = () => {
  console.log('Checkout:', {
    totalAmount: finalAmount.value,
    shippingMethod: shippingMethod.value,
    paymentMethod: paymentMethod.value,
    invoiceOption: invoiceOption.value,
  });
};

const formatPrice = (price: number) => `${price}`;

const increaseQuantity = (item: any) => {
  cartStore.addToCart(item);
};

const decreaseQuantity = (item: any) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cartStore.removeFromCart(item.id);
  }
};
</script>

<style scoped>
.mallCheckout__shipping {
  padding: 10px;
  background-color: #f8f0e5;
  border-radius: 10px;
  margin-bottom: 20px;
}
.mallCheckout__address {
  margin-top: 10px;
  font-size: 14px;
}
.mallCheckout__shipping-options {
  margin-top: 15px;
}
.mallCheckout__total-shipping {
  margin-top: 10px;
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}
.mallCheckout__invoice,
.mallCheckout__discount,
.mallCheckout__payment {
  margin-top: 20px;
}
.mallCheckout__total-discount {
  margin-top: 10px;
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}
.mallCheckout__totalMoney {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}
</style>
