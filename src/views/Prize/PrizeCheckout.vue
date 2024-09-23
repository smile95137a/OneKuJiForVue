<template>
    <form @submit.prevent="onSubmit">
        <Breadcrumbs :items="breadcrumbItems" />
        <div class="mallCheckout">
            <div class="m-t-48 m-b-12 mallCheckout__text mallCheckout__text--title">
                商品資訊
            </div>
            <Card v-for="item in items" :key="item.prizeCartItemId" custom-class="m-b-24">
                <div class="mallCheckout__product">
                    <div v-if="items.length > 0"
                        class="mallCheckout__product-item mallCheckout__product-item--selected">
                        <input type="checkbox" v-model="item.isSelected" @change="onItemSelectionChange" />
                    </div>
                    <div class="mallCheckout__product-item mallCheckout__product-item--img">
                        <MImage :src="item.imageUrls[0]" />
                    </div>
                    <div class="mallCheckout__product-item mallCheckout__product-item--name">
                        <p class="mallCheckout__text">{{ item.productName }}</p>
                    </div>
                    <div class="mallCheckout__product-item mallCheckout__product-item--price">
                        <div v-if="item.sliverPrice !== 0">
                            <p class="mallCheckout__text">
                                ${{ formatPrice(item.sliverPrice) }}
                            </p>
                        </div>
                    </div>
                    <div class="mallCheckout__product-item">
                        <div v-if="item.sliverPrice !== 0"
                            class="mallCheckout__product-item mallCheckout__product-item--delete"
                            @click="deleteProduct(item)">
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
                        <div class="mallCheckout__shipping-item mallCheckout__shipping-item--title">
                            寄送
                        </div>
                        <div class="mallCheckout__shipping-item mallCheckout__shipping-item--options">
                            <div v-for="option in shippingMethods" :key="option.name"
                                class="mallCheckout__shipping-option">
                                <input type="radio" :value="option.name" v-model="selectedShippingMethod"
                                    :id="option.name" />
                                <label :for="option.name">{{ option.name }} (${{ option.shippingPrice }})</label>
                            </div>
                        </div>
                        <div class="mallCheckout__shipping-item mallCheckout__shipping-item--price">
                            <p class="mallCheckout__text">${{ selectedShippingPrice }}</p>
                        </div>
                    </div>
                    <div class="mallCheckout__divider"></div>
                    <div class="mallCheckout__billInfo">
                        <div class="mallCheckout__form">
                            <div class="mallCheckout__form-inputs gap-x-24 mallCheckout__form-inputs--names">
                                <div class="w-50 w-md-100">
                                    <p class="mallCheckout__text mallCheckout__text--required">
                                        購買人姓名
                                    </p>
                                    <input class="mallCheckout__form-input" v-model="billingName"
                                        v-bind="billingNameProps" :class="{
                                            'mallCheckout__form-input--error': errors.billingName,
                                        }" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.billingName }}
                                    </p>
                                </div>
                                <div class="w-50 w-md-100">
                                    <p class="mallCheckout__text mallCheckout__text--required">
                                        購買人Email
                                    </p>
                                    <input class="mallCheckout__form-input" v-model="billingEmail"
                                        v-bind="billingEmailProps" :class="{
                                            'mallCheckout__form-input--error': errors.billingEmail,
                                        }" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.billingEmail }}
                                    </p>
                                </div>
                            </div>
                            <div class="mallCheckout__form-inputs">
                                <p class="mallCheckout__text mallCheckout__text--required">
                                    購買人電話
                                </p>
                                <input class="mallCheckout__form-input" v-model="billingPhone"
                                    v-bind="billingPhoneProps" :class="{
                                        'mallCheckout__form-input--error': errors.billingPhone,
                                    }" />
                                <p class="mallCheckout__text mallCheckout__text--error">
                                    {{ errors.billingPhone }}
                                </p>
                            </div>
                            <div class="mallCheckout__form-inputs--addr">
                                <div class="mallCheckout__form-inputs w-25 w-md-100">
                                    <p class="mallCheckout__text" :class="{
                                        'mallCheckout__text--required':
                                            shippingMethod === 'homeDelivery',
                                    }">
                                        購買人地址
                                    </p>
                                    <MSelect :options="billCityOptions" v-model="billingCity" v-bind="billingCityProps"
                                        customClass="mselect--checkoutFormBill" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.billingCity }}
                                    </p>
                                </div>
                                <div class="mallCheckout__form-inputs w-25 w-md-100">
                                    <MSelect :options="billAreaOptions" v-model="billingArea" v-bind="billingAreaProps"
                                        customClass="mselect--checkoutFormBill" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.billingArea }}
                                    </p>
                                </div>
                                <div class="mallCheckout__form-inputs w-50 w-md-100">
                                    <input class="mallCheckout__form-input" v-model="billingAddress"
                                        v-bind="billingAddressProps" :class="{
                                            'mallCheckout__form-input--error': errors.billingAddress,
                                        }" />
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
                            <div class="mallCheckout__form-inputs gap-x-24 mallCheckout__form-inputs--names">
                                <div class="w-50 w-md-100">
                                    <p class="mallCheckout__text mallCheckout__text--required">
                                        收貨人姓名
                                    </p>
                                    <input class="mallCheckout__form-input" v-model="shippingName"
                                        v-bind="shippingNameProps" :class="{
                                            'mallCheckout__form-input--error': errors.shippingName,
                                        }" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.shippingName }}
                                    </p>
                                </div>
                                <div class="w-50 w-md-100">
                                    <p class="mallCheckout__text mallCheckout__text--required">
                                        收貨人Email
                                    </p>
                                    <input class="mallCheckout__form-input" v-model="shippingEmail"
                                        v-bind="shippingEmailProps" :class="{
                                            'mallCheckout__form-input--error': errors.shippingEmail,
                                        }" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.shippingEmail }}
                                    </p>
                                </div>
                            </div>
                            <div class="mallCheckout__form-inputs">
                                <p class="mallCheckout__text mallCheckout__text--required">
                                    收貨人電話
                                </p>
                                <input class="mallCheckout__form-input" v-model="shippingPhone"
                                    v-bind="shippingPhoneProps" :class="{
                                        'mallCheckout__form-input--error': errors.shippingPhone,
                                    }" />
                                <p class="mallCheckout__text mallCheckout__text--error">
                                    {{ errors.shippingPhone }}
                                </p>
                            </div>
                            <div class="mallCheckout__form-inputs--addr">
                                <div class="mallCheckout__form-inputs w-25 w-md-100">
                                    <p class="mallCheckout__text" :class="{
                                        'mallCheckout__text--required':
                                            shippingMethod === 'homeDelivery',
                                    }">
                                        收貨人城市
                                    </p>
                                    <MSelect :options="shippingCityOptions" v-model="shippingCity"
                                        v-bind="shippingCityProps" customClass="mselect--checkoutFormBill" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.shippingCity }}
                                    </p>
                                </div>
                                <div class="mallCheckout__form-inputs w-25 w-md-100">
                                    <p class="mallCheckout__text" :class="{
                                        'mallCheckout__text--required':
                                            shippingMethod === 'homeDelivery',
                                    }">
                                        收貨人區域
                                    </p>
                                    <MSelect :options="shippingAreaOptions" v-model="shippingArea"
                                        v-bind="shippingAreaProps" customClass="mselect--checkoutFormBill" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.shippingArea }}
                                    </p>
                                </div>
                                <div class="mallCheckout__form-inputs w-50 w-md-100">
                                    <p class="mallCheckout__text" :class="{
                                        'mallCheckout__text--required':
                                            shippingMethod === 'homeDelivery',
                                    }">
                                        收貨人地址
                                    </p>
                                    <input class="mallCheckout__form-input" v-model="shippingAddress"
                                        v-bind="shippingAddressProps" :class="{
                                            'mallCheckout__form-input--error': errors.shippingAddress,
                                        }" />
                                    <p class="mallCheckout__text mallCheckout__text--error">
                                        {{ errors.shippingAddress }}
                                    </p>
                                </div>
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
import { useDialogStore, useLoadingStore } from '@/stores';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
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
const invoiceOptions = [{ value: 'donation', label: '捐贈' }];
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
});

const { handleSubmit, errors, defineField, setFieldValue } = useForm({
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
        invoice: invoiceOptions[0].value,
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

const selectedShippingPrice = computed(() => {
    const selectedOption = shippingMethods.value.find(
        (option) => option.name === selectedShippingMethod.value
    );
    return selectedOption ? selectedOption.shippingPrice : 0;
});
const totalProductSize = computed(() => {
    return items.value
        .filter((item) => item.isSelected)
        .reduce((sum: any, item: { size: any; }) => sum + item.size, 0);
});

const totalShippingAmount = computed(() => {
    return selectedShippingPrice.value;
});

const totalDiscountAmount = computed(() => {
    return 0; // 可根據優惠券或折扣碼計算折扣金額
});

const finalAmount = computed(() => {
    return (
        totalShippingAmount.value -
        totalDiscountAmount.value
    );
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
        const { success, data } = await getPrizeCart();
        if (success) {
            if (!data || data.length === 0) {
                router.push('/home');
            }
            items.value = data.map((item: { prizeCartItemId: any; }) => {
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
watch(items, () => {
  if (items.value.length > 0) {
    fetchShippingMethod();
  }
}, { deep: true, immediate: true });
const onItemSelectionChange = (item: { isSelected: boolean; }) => {
  item.isSelected = !item.isSelected;
  fetchShippingMethod();
};
</script>