<template>
  <div class="memberCenter__profileEditInvoiceForm">
    <div class="memberCenter__profileEditInvoiceForm-title">
      <p class="memberCenter__text">發票資料修改</p>
    </div>
    <div class="memberCenter__profileEditInvoiceForm-main">
      <div class="memberCenter__profileEditInvoiceForm-form">
        <div class="memberCenter__profileEditInvoiceForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">
            發票資訊
          </p>
          <input
            type="text"
            class="memberCenter__profileEditInvoiceForm-form-input"
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
          />
        </div>
      </div>
    </div>
    <div class="memberCenter__profileEditInvoiceForm-btns">
      <div class="memberCenter__profileEditInvoiceForm-btn">
        <span class="memberCenter__text"> 確認修改 </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
