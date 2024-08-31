<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mallCheckout">
    <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
      商品資訊
    </div>
    <Card v-for="item in items" :key="item.cartItemId" custom-class="m-b-24">
      <div class="mallCheckout__product">
        <div
          class="mallCheckout__product-item mallCheckout__product-item--selected"
        >
          <input type="checkbox" v-model="item.isSelected" />
        </div>
        <div class="mallCheckout__product-item mallCheckout__product-item--img">
          <MImage src="" />
        </div>
        <div
          class="mallCheckout__product-item mallCheckout__product-item--name"
        >
          <p class="mallCheckout__text">{{ item.productName }}</p>
        </div>
        <div
          class="mallCheckout__product-item mallCheckout__product-item--quantity"
        >
          <button
            class="mallCheckout__product-quantityBtn mallCheckout__product-quantityBtn--decrease"
            @click="decreaseQuantity(item)"
          >
            -
          </button>
          <span>{{ item.quantity }}</span>
          <button
            class="mallCheckout__product-quantityBtn mallCheckout__product-quantityBtn--increase"
            @click="increaseQuantity(item)"
          >
            +
          </button>
        </div>
        <div
          class="mallCheckout__product-item mallCheckout__product-item--price"
        >
          <p class="mallCheckout__text">${{ formatPrice(item.totalPrice) }}</p>
        </div>
        <div
          class="mallCheckout__product-item mallCheckout__product-item--delete"
        >
          <i class="fa-solid fa-trash-can"></i>
        </div>
      </div>
    </Card>
    <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
      寄送資訊
    </div>
    <Card>
      <div class="p-t-48 p-b-100 p-x-48">
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
              v-for="option in shippingOptions"
              :key="option.name"
              class="mallCheckout__shipping-option"
            >
              <input
                type="radio"
                :value="option.name"
                v-model="shippingMethod"
              />
              <label>{{ option.name }} (${{ option.price }})</label>
            </div>
          </div>
          <div
            class="mallCheckout__shipping-item mallCheckout__shipping-item--price"
          >
            <p class="mallCheckout__text">${{ selectedShippingPrice }}</p>
          </div>
        </div>
        <div class="mallCheckout__divider"></div>
        <div class="mallCheckout__invoice">
          <div
            class="mallCheckout__invoice-item mallCheckout__invoice-item--title"
          >
            發票
          </div>
          <div
            class="mallCheckout__invoice-item mallCheckout__invoice-item--select"
          >
            <MSelect
              v-model="invoiceOption"
              :options="[{ value: 'donation', label: '捐赠' }]"
              customClass="mallCheckout__invoice-select"
            />
          </div>
        </div>
      </div>
    </Card>

    <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
      優惠及結帳
    </div>
    <Card>
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
        <p class="mallCheckout__text mallCheckout__text--title">商品：</p>
        <p class="mallCheckout__text mallCheckout__text--money">
          ${{ formatPrice(totalProductAmount) }}
        </p>
      </div>
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
import MImage from '@/components/frontend/MImage.vue';
import {
  addCartItem,
  removeCartItem,
} from '@/services/frontend/cartItemService';
import { getCart, ICartItem } from '@/services/frontend/cartService';
import { payCartItem } from '@/services/frontend/orderService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MSelect from '@/components/common/MSelect.vue';
const router = useRouter();
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const breadcrumbItems = [{ name: '首頁' }, { name: '結帳' }];
const items = ref<ICartItem[]>([]);

const shippingOptions = [
  { name: '7-11 超商取貨', price: 60 },
  { name: '全家超商取貨', price: 60 },
  { name: '萊爾富超商取貨', price: 60 },
  { name: '中華郵政郵寄', price: 100 },
];

const paymentOptions = [
  { name: '信用卡一次付清', value: 'creditCard' },
  { name: '超商取貨付款', value: 'store' },
];

const shippingMethod = ref(shippingOptions[0].name);
const paymentMethod = ref(paymentOptions[0].value);

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
  // if (discountMethod.value === 'coupon') {
  //   const selected = coupons.find(
  //     (coupon) => coupon.id === selectedCoupon.value
  //   );
  //   return selected ? 50 : 0;
  // } else if (discountMethod.value === 'code' && discountCode.value) {
  //   return 50; // 假設優惠碼固定折抵 $50
  // }
  return 0;
});

const totalProductAmount = computed(() => {
  return items.value
    .filter((item) => item.isSelected) // 仅计算选中的商品
    .reduce((sum, item) => sum + item.totalPrice, 0);
});

const totalShippingAmount = computed(() => {
  return selectedShippingPrice.value;
});

const totalDiscountAmount = computed(() => {
  return discountAmount.value;
});

const finalAmount = computed(() => {
  return (
    totalProductAmount.value +
    totalShippingAmount.value -
    totalDiscountAmount.value
  );
});

const goBack = () => {
  router.back();
};

const checkout = async () => {
  const selectedItems = items.value.filter((item) => item.isSelected);

  const payCart = {
    cartItemIds: selectedItems.map((x) => x.cartItemId),
  };

  try {
    loadingStore.startLoading();
    const { success, data } = await payCartItem(payCart);
    loadingStore.stopLoading();
    if (success) {
      router.push({
        name: 'MallOrderSuccess',
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
};

const formatPrice = (price: number) => `${price.toFixed(2)}`;

const increaseQuantity = async (item: ICartItem) => {
  loadingStore.startLoading();
  const cartItem = {
    storeProductId: item.storeProductId,
    quantity: 1,
  };
  try {
    const response = await addCartItem(cartItem);
    if (response.success) {
      await loadCartItems();
    } else {
      console.error('添加購物車失敗:', response.message);
    }
  } catch (error) {
    console.error('添加購物車時發生錯誤:', error);
  }
  loadingStore.stopLoading();
};

const loadCartItems = async () => {
  loadingStore.startLoading();
  try {
    const { success, data } = await getCart();
    if (success) {
      if (!data || data.length === 0) {
        router.push('/home');
      }
      items.value = data.map((item) => {
        const existingItem = items.value.find(
          (i) => i.cartItemId === item.cartItemId
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

const decreaseQuantity = async (item: ICartItem) => {
  const loadingStore = useLoadingStore();
  loadingStore.startLoading();

  try {
    const response =
      item.quantity - 1 === 0
        ? await removeCartItem(item.cartItemId)
        : await addCartItem({
            storeProductId: item.storeProductId,
            quantity: -1,
          });

    if (response.success) {
      await loadCartItems();
    } else {
      console.error(response.message);
    }
  } catch (error) {
    console.error('操作購物車時發生錯誤:', error);
  } finally {
    loadingStore.stopLoading();
  }
};

onMounted(async () => {
  loadCartItems();
});
</script>
