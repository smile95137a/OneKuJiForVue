<template>
  <div class="memberCenter__orderHistory">
    <MemberCenterCoins />
    <div class="memberCenter__orderHistoryForm">
      <div class="memberCenter__orderHistoryForm-title">
        <p class="memberCenter__text">消費紀錄</p>
      </div>
      <form class="memberCenter__orderHistoryForm-main" @submit="submitForm">
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

    <NoData v-if="records.length === 0" />

    <div v-else class="memberCenter__table">
      <table>
        <thead>
          <tr>
            <th class="w-30">交易時間</th>
            <th class="w-40">項目</th>
            <th class="w-30">交易金額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in records" :key="order.id">
            <td>
              <DateFormatter
                :date="order.transactionDate"
                format="YYYY/MM/DD"
              />
            </td>
            <td>{{ order.transactionType }}</td>
            <td>{{ order.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NoData from '@/components/common/NoData.vue';
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';
import { getTransactions } from '@/services/frontend/transactionService';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useDialogStore, useLoadingStore } from '@/stores';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();

const records = ref<any[]>([]);
const { defineField, handleSubmit, errors, values } = useForm({
  initialValues: {
    startDate: '',
    endDate: '',
  },
});

const submitForm = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { success, data } = await getTransactions(values);
    loadingStore.stopLoading();

    if (success) {
      records.value = data;
    } else {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '查詢失敗',
      });
    }
  } catch (error) {
    loadingStore.stopLoading();
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: '查詢失敗，系統出錯',
    });
  }
});

const [startDate] = defineField('startDate');
const [endDate] = defineField('endDate');
</script>

<style lang="scss" scoped></style>
