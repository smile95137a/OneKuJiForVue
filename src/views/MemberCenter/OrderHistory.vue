<template>
  <div class="memberCenter__orderHistory">
    <MemberCenterCoins />
    <div class="memberCenter__orderHistoryForm">
      <div class="memberCenter__orderHistoryForm-title">
        <p class="memberCenter__text">訂單紀錄</p>
      </div>
      <div class="memberCenter__orderHistoryForm-main">
        <div class="memberCenter__orderHistoryForm-box">
          <div class="memberCenter__orderHistoryForm-form-inputs m-t-20">
            <p class="memberCenter__text">起始時間</p>
            <input
              type="date"
              v-model="startDate"
              class="memberCenter__orderHistoryForm-form-input"
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
              v-model="endDate"
              class="memberCenter__orderHistoryForm-form-input"
            />
          </div>
        </div>
        <div
          class="memberCenter__orderHistoryForm-box memberCenter__orderHistoryForm-box--btns"
        >
          <div class="memberCenter__orderHistoryForm-btns">
            <div
              class="memberCenter__orderHistoryForm-btn"
              @click="fetchOrders"
            >
              <span class="memberCenter__text">查詢</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="memberCenter__table">
      <table>
        <thead>
          <tr>
            <th class="w-30">日期</th>
            <th class="w-50">訂單號</th>
            <th class="w-20">總金額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.createdAt }}</td>
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.totalAmount }}</td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="3">沒有找到相關訂單</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import { getOrderById } from '@/services/frontend/orderService';
import { onMounted, ref } from 'vue';

const startDate = ref('');
const endDate = ref('');
const orders = ref([]);

const fetchOrders = async () => {
  let userId = localStorage.getItem('userId');
  try {
    orders.value = await getOrderById(userId);
  } catch (error) {
    console.error('获取订单失败:', error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style lang="scss" scoped>
/* 您可以在此添加样式 */
</style>
