<template>
  <div class="noData">
    <div class="noData__img">
      <img :src="p1" alt="noData" />
    </div>
    <p class="noData__text">查無資料</p>
  </div>
</template>

<script setup>
import noDataImg from '@/assets/image/nodata.svg';
import p1 from '@/assets/image/login.png';
</script>
