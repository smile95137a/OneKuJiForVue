<template>
  <div class="noData">
    <div class="noData__img">
      <img :src="noDataImg" alt="noData" />
    </div>
    <p class="noData__text">查無資料</p>
  </div>
</template>

<script setup>
import noDataImg from '@/assets/image/nodata.svg';
</script>
