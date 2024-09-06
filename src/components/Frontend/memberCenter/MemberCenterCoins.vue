<template>
  <div class="memberCenter__coins">
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c1" alt="代幣" /></div>
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
      <div class="memberCenter__coins-icon"><img :src="c3" alt="銀幣" /></div>
      <div class="memberCenter__coins-info">
        <div class="memberCenter__coins-title">
          <p class="memberCenter__text">銀幣</p>
        </div>
        <div class="memberCenter__coins-num">
          <p class="memberCenter__text">
            <NumberFormatter :number="userSliver" />
          </p>
        </div>
      </div>
    </div>
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c2" alt="紅利點數" /></div>
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
import c3 from '@/assets/image/coin-3.png';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { getUserInfo } from '@/services/frontend/userService';

const userBalance = ref(0);
const userBonus = ref(0);
const userSliver = ref(0);

const fetchUserInfo = async () => {
  try {
    const { data: userInfo } = await getUserInfo();
    userBalance.value = userInfo.balance;
    userBonus.value = userInfo.bonus;
    userSliver.value = userInfo.sliverCoin;
  } catch (error) {
    console.error('獲取用戶信息失敗:', error);
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style lang="scss" scoped>
.memberCenter__coins {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.memberCenter__coins-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.memberCenter__coins-icon {
  margin-bottom: 10px;
}

.memberCenter__coins-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.memberCenter__coins-title {
  margin-bottom: 5px;
}

.memberCenter__text {
  margin: 0;
}
</style>