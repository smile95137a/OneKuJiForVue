<template>
  <form
    ref="paymentForm"
    action="https://n.gomypay.asia/TestShuntClass.aspx"
    method="post"
  >
    <label>
      Send_Type:
      <input type="text" name="Send_Type" v-model="formData.Send_Type" />
    </label>
    <label>
      Pay_Mode_No:
      <input type="text" name="Pay_Mode_No" v-model="formData.Pay_Mode_No" />
    </label>
    <label>
      CustomerId:
      <input type="text" name="CustomerId" v-model="formData.CustomerId" />
    </label>
    <label>
      Order_No:
      <input type="text" name="Order_No" v-model="formData.Order_No" />
    </label>
    <label> CardNo: </label>
    <label> ExpireDate (YYMM): </label>
    <label> CVV: </label>
    <label>
      TransMode:
      <input type="text" name="TransMode" v-model="formData.TransMode" />
    </label>
    <label>
      Amount:
      <input type="number" name="Amount" v-model="formData.Amount" />
    </label>
    <label>
      Installment:
      <input type="number" name="Installment" v-model="formData.Installment" />
    </label>
    <label>
      TransCode:
      <input type="text" name="TransCode" v-model="formData.TransCode" />
    </label>
    <label> Buyer_Name: </label>
    <label> Buyer_Telm: </label>
    <label> Buyer_Mail: </label>
    <label> Buyer_Memo: </label>
    <label> e_return: </label>
    <label> Str_Check: </label>
    <label>
      Return_url:
      <input type="text" name="Return_url" v-model="formData.Return_url" />
    </label>

    <!-- 提交按鈕 -->
    <button type="button" @click="submitForm">提交表單</button>
  </form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// 使用 ref 來儲存表單 DOM 和數據
const paymentForm = ref<HTMLFormElement | null>(null);
const formData = ref({
  Send_Type: '0',
  Pay_Mode_No: '2',
  CustomerId: 'B82FD0DF7DE03FC702DEC35A2446E469',
  Order_No: '',
  TransMode: '1',
  Amount: '10000',
  Installment: '0',
  TransCode: '00',
  Return_url: '',
});

// 設置 Return_url 為當前網域的 /paymentCB
onMounted(() => {
  formData.value.Return_url = `${window.location.origin}/paymentCB`;
});

// 定義表單提交的函數
const submitForm = () => {
  if (paymentForm.value) {
    paymentForm.value.submit();
  }
};
</script>
