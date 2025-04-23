<template></template>

<script lang="ts" setup>
import { creditTopOp } from '@/services/frontend/paymentService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { ref, onMounted } from 'vue';
const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const queryParams = ref<{ [key: string]: string }>({});

onMounted(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObj: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    paramsObj[key] = value;
  });

  const orderId = searchParams.get('OrderID') || searchParams.get('id') || '';
  const creditResult =
    searchParams.get('result') ||
    searchParams.get('authorization_result') ||
    '';
  const orderNumber =
    searchParams.get('e_orderno') ||
    searchParams.get('shop_transaction_no') ||
    '';

  const o = {
    orderId,
    creditResult,
    orderNumber,
  };

  try {
    if (~~o.creditResult === 1) {
      loadingStore.startLoading();
      const { success, message } = await creditTopOp(o);
      loadingStore.stopLoading();
      if (success) {
        await dialogStore.openInfoDialog({
          title: '系統通知',
          message: '儲值成功',
        });
      } else {
        await dialogStore.openInfoDialog({
          title: '系統通知',
          message: message,
        });
      }
    } else {
      const failReason = searchParams.get('ret_msg');

      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: failReason
          ? `付款未成功，原因：${failReason}`
          : '付款未成功，請更換其他支付方式。',
      });
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.error('Error processing credit top-up:', error);
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '系統問題',
    });
  }
});
</script>
