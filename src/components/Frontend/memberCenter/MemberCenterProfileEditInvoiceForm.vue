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
          />
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
import { useLoadingStore } from '@/stores';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
const loadingStore = useLoadingStore();
const invoiceInfoOptions = ref<{ value: string; label: string }[]>([
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'citizenDigitalCarrier', label: '自然人憑證載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
  { value: 'tripartiteEInvoice', label: '三聯式電子發跳' },
]);
const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  initialValues: {
    invoiceInfo: '',
    invoiceInfoEmail: '',
  },
});
const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    console.log(values);

    loadingStore.stopLoading();
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
});

const [invoiceInfo, invoiceInfoProps] = defineField('invoiceInfo');
const [invoiceInfoEmail, invoiceInfoEmailProps] =
  defineField('invoiceInfoEmail');
</script>

<style lang="scss" scoped></style>
