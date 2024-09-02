<template>
  <form class="memberCenter__profileEditInvoiceForm" @submit.prevent="onSubmit">
    <div class="memberCenter__profileEditInvoiceForm-title">
      <p class="memberCenter__text">發票資料修改</p>
    </div>
    <div class="memberCenter__profileEditInvoiceForm-main">
      <div class="memberCenter__profileEditInvoiceForm-form">
        <div class="memberCenter__profileEditInvoiceForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">
            發票資訊
          </p>
          <MSelect
            :options="invoiceInfoOptions"
            v-model="invoiceInfo"
            v-bind="invoiceInfoProps"
            customClass="mselect--invoiceForm"
          />
          <span class="memberCenter__text memberCenter__text--error">{{
            errors.invoiceInfo
          }}</span>
        </div>
      </div>
      <div
        class="memberCenter__profileEditInvoiceForm-form memberCenter__profileEditInvoiceForm-form--other"
      >
        <div class="memberCenter__profileEditInvoiceForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">
            接收發票信箱
          </p>
          <input
            type="text"
            class="memberCenter__profileEditInvoiceForm-form-input"
            v-model="invoiceInfoEmail"
            v-bind="invoiceInfoEmailProps"
            :class="{
              'memberCenter__profileEditForm-form-input--error':
                errors.invoiceInfoEmail,
            }"
          />
          <span class="memberCenter__text memberCenter__text--error">{{
            errors.invoiceInfoEmail
          }}</span>
        </div>
      </div>
    </div>
    <div class="memberCenter__profileEditInvoiceForm-btns">
      <button type="submit" class="memberCenter__profileEditInvoiceForm-btn">
        <span class="memberCenter__text"> 確認修改 </span>
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import MSelect from '@/components/common/MSelect.vue';
import {
  getUserInfo,
  updateUserInvoice,
} from '@/services/frontend/userService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import * as yup from 'yup';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const invoiceInfoOptions = ref<{ value: string; label: string }[]>([
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'citizenDigitalCarrier', label: '自然人憑證載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
  { value: 'tripartiteEInvoice', label: '三聯式電子發跳' },
]);

const schema = yup.object({
  invoiceInfo: yup.string().required('發票資訊為必填項'),
  invoiceInfoEmail: yup
    .string()
    .required('接收發票信箱為必填項')
    .email('Email 格式不正確'),
});

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    invoiceInfo: '',
    invoiceInfoEmail: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { success } = await updateUserInvoice(values);
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

const [invoiceInfo, invoiceInfoProps] = defineField('invoiceInfo');
const [invoiceInfoEmail, invoiceInfoEmailProps] =
  defineField('invoiceInfoEmail');

const fetchUserInfo = async () => {
  try {
    const { data: userInfo } = await getUserInfo();

    setFieldValue('invoiceInfo', userInfo.invoiceInfo);
    setFieldValue('invoiceInfoEmail', userInfo.invoiceInfoEmail);
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style lang="scss" scoped></style>
