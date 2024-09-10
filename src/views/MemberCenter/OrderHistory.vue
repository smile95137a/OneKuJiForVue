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
      <CFlip
        v-for="(order, index) in orders"
        :key="index"
        :orderData="order"
        :index="index"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import NoData from '@/components/common/NoData.vue';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import CFlip from '@/components/common/CFlip.vue';
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

const submitForm = handleSubmit(async (values) => {
  try {
    const response = await queryOrder(values);
    orders.value = response.data || [];
  } catch (error) {
    console.error('Error fetching order data:', error);
  }
});
</script>

<style lang="scss" scoped></style>
