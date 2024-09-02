<template>
  <div class="memberCenter__coins">
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c1" /></div>
      <div class="memberCenter__coins-info">
        <div class="memberCenter__coins-title">
          <p class="memberCenter__text">代幣</p>
        </div>
        <div class="memberCenter__coins-num">
          <p class="memberCenter__text">
            <NumberFormatter :number="userBalance" />
          </p>
        </div>
      </div>
    </div>
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c2" /></div>
      <div class="memberCenter__coins-info">
        <div class="memberCenter__coins-title">
          <p class="memberCenter__text">紅利點數</p>
        </div>
        <div class="memberCenter__coins-num">
          <p class="memberCenter__text">
            <NumberFormatter :number="userBonus" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import c1 from '@/assets/image/coin-1.png';
import c2 from '@/assets/image/coin-2.png';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { getUserInfo } from '@/services/frontend/userService';

const userBalance = ref(0);
const userBonus = ref(0);

const fetchUserInfo = async () => {
  try {
    const { data: userInfo } = await getUserInfo();
    userBalance.value = userInfo.sliverCoin;
    userBonus.value = userInfo.bonus;
  } catch (error) {
    console.error('獲取用戶信息失敗:', error);
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style lang="scss" scoped></style>
