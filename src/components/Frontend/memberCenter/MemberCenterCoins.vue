<template>
  <div class="memberCenter__coins">
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c1" /></div>
      <div class="memberCenter__coins-info">
        <div class="memberCenter__coins-title">
          <p class="memberCenter__text">代幣</p>
        </div>
        <div class="memberCenter__coins-num">
          <p class="memberCenter__text">{{ userBalance }}</p>
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
          <p class="memberCenter__text">{{ userBonus }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import c1 from '@/assets/image/coin-1.png';
import c2 from '@/assets/image/coin-2.png';
import { getUserInfo, getUserId } from '@/services/front/Frontapi'; // Adjust the import path as needed

const userBalance = ref(0);
const userBonus = ref(0);

const fetchUserData = async () => {
  try {
    const userId = getUserId();
    if (userId) {
      const userData = await getUserInfo(userId);
      userBalance.value = userData.balance;
      userBonus.value = userData.bonus;
    } else {
      console.error('User ID not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style lang="scss" scoped>
// Your existing styles here
</style>
