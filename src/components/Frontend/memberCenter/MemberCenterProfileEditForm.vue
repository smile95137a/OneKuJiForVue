<template>
  <div class="memberCenter__profileEditForm">
    <div class="memberCenter__profileEditForm-title">
      <p class="memberCenter__text">會員資料修改</p>
    </div>
    <form @submit.prevent="onSubmit">
      <div class="memberCenter__profileEditForm-main">
        <div class="memberCenter__profileEditForm-form">
          <div class="memberCenter__profileEditForm-form-inputs m-t-20">
            <p class="memberCenter__text memberCenter__text--required">暱稱</p>
            <input
              v-model="nickname"
              class="memberCenter__profileEditForm-form-input"
              :class="{
                'memberCenter__profileEditForm-form-input--error':
                  errors.nickname,
              }"
              v-bind="nicknameProps"
            />
            <span class="memberCenter__text memberCenter__text--error">{{
              errors.nickname
            }}</span>
          </div>
          <div class="memberCenter__profileEditForm-form-inputs m-t-20">
            <p class="memberCenter__text memberCenter__text--required">
              收貨姓名
            </p>
            <input
              v-model="addressName"
              class="memberCenter__profileEditForm-form-input"
              :class="{
                'memberCenter__profileEditForm-form-input--error':
                  errors.addressName,
              }"
              v-bind="addressNameProps"
            />
            <span class="memberCenter__text memberCenter__text--error">{{
              errors.addressName
            }}</span>
          </div>
          <div class="flex flex-column">
            <p class="register__text">收貨地址</p>
            <div class="flex gap-x-12">
              <div
                class="memberCenter__profileEditForm-form-inputs w-50 m-t-20"
              >
                <MSelect
                  :options="cityOptions"
                  v-model="city"
                  v-bind="cityProps"
                  customClass="mselect--registerForm"
                />
                <p class="register__text register__text--error">
                  {{ errors.city }}
                </p>
              </div>
              <div
                class="rmemberCenter__profileEditForm-form-inputs w-50 m-t-20"
              >
                <MSelect
                  :options="areaOptions"
                  v-model="area"
                  v-bind="areaProps"
                  customClass="mselect--registerForm"
                />
                <p class="register__text register__text--error">
                  {{ errors.area }}
                </p>
              </div>
            </div>
          </div>

          <div class="memberCenter__profileEditForm-form-inputs m-t-20">
            <p class="memberCenter__text">詳細地址</p>
            <input
              v-model="address"
              type="text"
              class="memberCenter__profileEditForm-form-input"
              :class="{
                'memberCenter__profileEditForm-form-input--error':
                  errors.address,
              }"
              v-bind="addressProps"
            />
            <span class="memberCenter__text memberCenter__text--error">{{
              errors.address
            }}</span>
          </div>
        </div>
        <div
          class="memberCenter__profileEditForm-form memberCenter__profileEditForm-form--other"
        >
          <div class="memberCenter__profileEditForm-form-inputs m-t-20">
            <p class="memberCenter__text">LINE ID</p>
            <input
              v-model="lineId"
              type="text"
              class="memberCenter__profileEditForm-form-input"
              :class="{
                'memberCenter__profileEditForm-form-input--error':
                  errors.lineId,
              }"
              v-bind="lineIdProps"
            />
            <span class="memberCenter__text memberCenter__text--error">{{
              errors.lineId
            }}</span>
          </div>
          <div class="memberCenter__profileEditForm-form-inputs m-t-20">
            <p class="memberCenter__text memberCenter__text--required">
              收貨手機
            </p>
            <input
              v-model="phoneNumber"
              type="text"
              class="memberCenter__profileEditForm-form-input"
              :class="{
                'memberCenter__profileEditForm-form-input--error':
                  errors.phoneNumber,
              }"
              v-bind="phoneNumberProps"
            />
            <span class="memberCenter__text memberCenter__text--error">{{
              errors.phoneNumber
            }}</span>
          </div>
        </div>
      </div>
      <div class="memberCenter__profileEditForm-btns">
        <button type="submit" class="memberCenter__profileEditForm-btn">
          <span class="memberCenter__text">確認修改</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { nextTick, onMounted, ref, watch } from 'vue';
import {
  getAllCityNames,
  getAreaListByCityName,
} from '@/services/frontend/taiwanCitiesService';
import MSelect from '@/components/common/MSelect.vue';
import { getUserInfo, updateUser } from '@/services/frontend/userService';
import { useDialogStore, useLoadingStore } from '@/stores';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const schema = yup.object({
  nickname: yup.string().required('暱稱為必填項'),
  addressName: yup.string().required('收貨姓名為必填項'),
  city: yup.string(),
  area: yup.string(),
  address: yup.string(),
  lineId: yup.string().nullable(),
  phoneNumber: yup.string().required('收貨手機為必填項'),
});

const { handleSubmit, errors, defineField, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    nickname: '',
    addressName: '',
    city: '',
    area: '',
    address: '',
    lineId: '',
    phoneNumber: '',
  },
});

const [nickname, nicknameProps] = defineField('nickname');
const [addressName, addressNameProps] = defineField('addressName');
const [city, cityProps] = defineField('city');
const [area, areaProps] = defineField('area');
const [address, addressProps] = defineField('address');
const [lineId, lineIdProps] = defineField('lineId');
const [phoneNumber, phoneNumberProps] = defineField('phoneNumber');

const cityOptions = ref<{ value: string; label: string }[]>([]);
const areaOptions = ref<{ value: string; label: string }[]>([]);

const fetchUserInfo = async () => {
  try {
    const { data: userInfo } = await getUserInfo();

    setFieldValue('nickname', userInfo.nickname);
    setFieldValue('addressName', userInfo.addressName);
    setFieldValue('city', userInfo.city);
    await nextTick();
    setFieldValue('area', userInfo.area);
    setFieldValue('address', userInfo.address);
    setFieldValue('lineId', userInfo.lineId);
    setFieldValue('phoneNumber', userInfo.phoneNumber);
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { success } = await updateUser(values);
    loadingStore.stopLoading();

    if (success) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '更新成功',
      });
    } else {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '更新失敗',
      });
    }
  } catch (error) {
    loadingStore.stopLoading();
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '更新失敗，系統出錯',
    });
  }
});

onMounted(() => {
  const cityNames = getAllCityNames();
  cityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  areaOptions.value = [{ value: '', label: '行政區' }];
  fetchUserInfo();
});

watch(city, (newCity) => {
  if (newCity) {
    setFieldValue('area', '');
    const areas = getAreaListByCityName(newCity);
    areaOptions.value = [
      { value: '', label: '行政區' },
      ...areas.map((area) => ({
        value: area.areaName,
        label: area.areaName,
      })),
    ];
  } else {
    areaOptions.value = [{ value: '', label: '行政區' }];
  }
});
</script>
