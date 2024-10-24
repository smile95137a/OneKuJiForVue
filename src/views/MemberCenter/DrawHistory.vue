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

    <div v-else class="flex flex-column gap-y-8">
      <div class="flex gap-x-12" style="border-bottom: 1px solid #000">
        <div class="w-25">圖片</div>
        <div class="w-25">名稱</div>
        <div class="w-25">數量</div>
        <div class="w-25">日期</div>
        <div class="w-25">金額</div>
      </div>
      <div class="flex gap-x-12" v-for="order in orders" :key="order.id">
        <div class="w-25"><MImage :src="order.imageUrls[0]" /></div>
        <div class="w-25">{{ order.productName }}</div>
        <div class="w-25">{{ order.drawCount }}</div>
        <div class="w-25">
          <DateFormatter :date="order.createDate" format="YYYY/MM/DD" />
        </div>
        <div class="w-25">
          <NumberFormatter :number="order.amount ?? 0" />
          <span v-if="order.payType"> ({{ mapPayType(order.payType) }}) </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NoData from '@/components/common/NoData.vue';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import MImage from '@/components/frontend/MImage.vue';
import { queryDrawOrder } from '@/services/frontend/orderService';
import { useForm } from 'vee-validate';
import { ref } from 'vue';

const orders = ref([]);

const { defineField, handleSubmit } = useForm({
  initialValues: {
    startDate: '',
    endDate: '',
  },
});

const [startDate] = defineField('startDate');
const [endDate] = defineField('endDate');

const submitForm = handleSubmit(async (values) => {
  try {
    const response = await queryDrawOrder(values);
    orders.value = response.data || [];
  } catch (error) {
    console.error('Error fetching order data:', error);
  }
});

const mapPayType = (payType: number | null | undefined) => {
  if (payType === null || payType === undefined) {
    return '未知';
  }

  switch (~~payType) {
    case 1:
      return '金幣';
    case 2:
      return '銀幣';
    case 3:
      return '紅利';
    case 4:
      return '兌換卷';
    default:
      return '未知';
  }
};
</script>

<style lang="scss" scoped></style>
