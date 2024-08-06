<template>
  <div class="memberCenter__coins">
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c1" /></div>
      <div class="memberCenter__coins-info">
        <div class="memberCenter__coins-title">
          <p class="memberCenter__text">代幣</p>
        </div>
        <div class="memberCenter__coins-num">
          <p class="memberCenter__text">10000000</p>
        </div>
      </div>
    </div>
    <div class="memberCenter__coins-item">
      <div class="memberCenter__coins-icon"><img :src="c2" /></div>
      <div class="memberCenter__coins-info">
        <div class="memberCenter__coins-title">
          <p class="memberCenter__text">代幣</p>
        </div>
        <div class="memberCenter__coins-num">
          <p class="memberCenter__text">10000000</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import c1 from '@/assets/image/coin-1.png';
import c2 from '@/assets/image/coin-2.png';
</script>

<style lang="scss" scoped></style>
