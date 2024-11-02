<template></template>

<script lang="ts" setup>
import { creditTopOp } from '@/services/frontend/paymentService';
import { useDialogStore } from '@/stores';
import { ref, onMounted } from 'vue';
const dialogStore = useDialogStore();
const queryParams = ref<{ [key: string]: string }>({});

onMounted(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObj: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    paramsObj[key] = value;
  });

  queryParams.value = paramsObj;
  const o = {
    orderId: searchParams.get('OrderID') || '',
    creditResult: searchParams.get('result') || '',
    orderNumber: searchParams.get('e_orderno') || '',
  };
  try {
    if (~~paramsObj.result === 1) {
      const { success, message } = await creditTopOp(o);
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
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '付款失敗',
      });
    }
  } catch (error) {
    console.error('Error processing credit top-up:', error);
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '系統問題',
    });
  }
});
</script>
