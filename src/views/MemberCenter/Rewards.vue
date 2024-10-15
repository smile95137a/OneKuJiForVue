<template>
  <div class="memberCenter__rewards">
    <MemberCenterCoins />

    <div class="memberCenter__rewardsConsume">
      <div class="memberCenter__rewardsConsume-title">
        <p class="memberCenter__text">消費獎勵</p>
      </div>
      <div class="memberCenter__rewardsConsume-subTitle">儲值獎勵計算方式</div>
      <div class="memberCenter__rewardsConsume-info">
        消費獎勵計算方式
        每月1號~31號期間累計消費金額(金幣)達到累計的標準即可領取獎勵！
        每月1號將重新開始計算。
      </div>
    </div>
    <div class="memberCenter__rewardsAccount">
      <p class="memberCenter__text">
        本月累計金額：
        <span class="memberCenter__text memberCenter__text--red"
          >$ <NumberFormatter :number="cumulative"
        /></span>
      </p>
    </div>
    <div class="memberCenter__rewardsCoins">
      <div
        class="memberCenter__rewardsCoins-item"
        v-for="(reward, index) in rewards"
        :key="index"
      >
        <div class="memberCenter__rewardsCoins-icon">
          <img :src="c1" alt="" srcset="" />
        </div>

        <div class="memberCenter__rewardsCoins-title">
          <p class="memberCenter__text">
            累計滿
            <span class="memberCenter__text memberCenter__text--red">
              <NumberFormatter :number="reward?.threshold ?? 0" />
              元</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-subTitle">
          <p class="memberCenter__text">
            領取
            <span class="memberCenter__text memberCenter__text--red">
              <NumberFormatter :number="reward?.sliver ?? 0" />
              銀幣</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-btns">
          <div class="memberCenter__rewardsCoins-btn">
            {{ reward?.achieved ? '已達標' : '未達標' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
import c1 from '@/assets/image/coin-1.png';
import { onMounted, ref } from 'vue';
import { getTotalConsumeAmount } from '@/services/frontend/paymentService';
import { useLoadingStore } from '@/stores';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
const loadingStore = useLoadingStore();
const cumulative = ref(0);
const rewards = ref([]);

const fetchTotalAmount = async () => {
  try {
    const response = await getTotalConsumeAmount();

    try {
      loadingStore.startLoading();
      const { success, message, data } = await getTotalConsumeAmount();
      loadingStore.stopLoading();
      if (success) {
        cumulative.value = data.cumulative;
        rewards.value = data.rewardStatusList;
      } else {
        console.log(message);
      }
    } catch (error) {
      loadingStore.stopLoading();
      console.log(error);
    }

    console.log(response);
  } catch (error) {
    console.error('Error fetching total consume amount:', error);
  }
};

onMounted(() => {
  fetchTotalAmount();
});
</script>

<style lang="scss" scoped></style>
