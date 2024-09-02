<template>
  <div class="memberCenter__orderHistory">
    <MemberCenterCoins />
    <div class="memberCenter__orderHistoryForm">
      <div class="memberCenter__orderHistoryForm-title">
        <p class="memberCenter__text">訂單紀錄</p>
      </div>
      <form
        class="memberCenter__orderHistoryForm-main"
        @submit.prevent="submitForm"
      >
        <div class="memberCenter__orderHistoryForm-box">
          <div class="memberCenter__orderHistoryForm-form-inputs m-t-20">
            <p class="memberCenter__text">起始時間</p>
            <input
              type="date"
              class="memberCenter__orderHistoryForm-form-input"
              v-model="startDate"
            />
          </div>
        </div>
        <div class="memberCenter__orderHistoryForm-box">
          <div class="memberCenter__orderHistoryForm-form-inputs m-t-20">
            <p class="memberCenter__text memberCenter__text--required">
              結束時間
            </p>
            <input
              type="date"
              class="memberCenter__orderHistoryForm-form-input"
              v-model="endDate"
            />
          </div>
        </div>
        <div
          class="memberCenter__orderHistoryForm-box memberCenter__orderHistoryForm-box--btns"
        >
          <div class="memberCenter__orderHistoryForm-btns">
            <button type="submit" class="memberCenter__orderHistoryForm-btn">
              <span class="memberCenter__text">查詢</span>
            </button>
          </div>
        </div>
      </form>
    </div>
    <NoData v-if="orders.length === 0" />

    <div v-else class="memberCenter__table">
      <CTable :headers="headers">
        <template v-for="(order, index) in orders" :key="index">
          <CTableRow :data="createRowData(order)" />
        </template>
      </CTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NoData from '@/components/common/NoData.vue';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import { queryOrder } from '@/services/frontend/orderService';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CTable from '@/components/common/CTable.vue';
import CTableRow from '@/components/common/CTableRow.vue';

const orders = ref([]);
const router = useRouter();

const { defineField, handleSubmit } = useForm({
  initialValues: {
    startDate: '',
    endDate: '',
  },
});

const [startDate] = defineField('startDate');
const [endDate] = defineField('endDate');

const headers = [
  { text: '日期', className: 'w-20' },
  { text: '訂單編號', className: 'w-20' },
  { text: '內容', className: 'w-20' },
  { text: '狀態', className: 'w-20' },
  { text: '明細', className: 'w-20' },
];

const submitForm = handleSubmit(async (values) => {
  try {
    const response = await queryOrder(values);
    orders.value = response.data || [];
  } catch (error) {
    console.error('Error fetching order data:', error);
  }
});

const createRowData = (order) => [
  {
    content: formatDate(order.createdAt),
    className: '',
    dataTitle: '日期',
  },
  {
    content: order.orderNumber,
    className: '',
    dataTitle: '訂單編號',
  },
  {
    content: order.content,
    className: '',
    dataTitle: '內容',
  },
  {
    content: order.resultStatus,
    className: '',
    dataTitle: '狀態',
  },
  {
    content: '明細',
    className: '',
    dataTitle: '明細',
  },
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const viewOrderDetail = (orderNumber: string) => {
  router.push({ name: 'OrderDetail', params: { orderNumber } });
};
</script>

<style lang="scss" scoped></style>
