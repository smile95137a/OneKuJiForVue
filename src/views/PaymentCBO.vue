<template></template>

<script lang="ts" setup>
import { creditMP } from '@/services/frontend/paymentService';
import { useDialogStore, useLoadingStore } from '@/stores';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
const router = useRouter();
const queryParams = ref<{ [key: string]: string }>({});

onMounted(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObj: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    paramsObj[key] = value;
  });

  queryParams.value = paramsObj;

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

  const isGoToOrderQuery = searchParams.get('isGoToOrderQuery') === '1';

  try {
    if (~~o.creditResult === 1) {
      loadingStore.startLoading();
      const { success, message, data } = await creditMP(o);
      loadingStore.stopLoading();
      if (success) {
        await dialogStore.openInfoDialog({
          title: '系統通知',
          message: '付款成功，正在跳轉...',
        });
        if (isGoToOrderQuery) {
          router.push('/member-center/order-history');
        }
      } else {
        await dialogStore.openInfoDialog({
          title: '系統通知',
          message: message,
        });
        if (isGoToOrderQuery) {
          router.push('/member-center/order-history');
        }
      }
    } else {
      const failReason = searchParams.get('ret_msg');

      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: failReason
          ? `付款未成功，原因：${failReason}`
          : '付款未成功，未收到詳細錯誤訊息，請稍後再試。',
      });
      if (isGoToOrderQuery) {
        router.push('/member-center/order-history');
      }
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.error('Error processing payment:', error);
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '系統問題',
    });
    if (isGoToOrderQuery) {
      router.push('/member-center/order-history');
    }
  }
});
</script>
