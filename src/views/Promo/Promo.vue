<template>
  <SectionHeader title="優惠說明" />
  <Card custom-class="m-t-24">
    <div class="promo">
      <div class="promo__img">
        <img :src="p1" />
      </div>
      <div class="promo__img">
        <img :src="p2" />
      </div>
      <div class="promo__img">
        <img :src="p3" />
      </div>
      <div class="promo__img">
        <img :src="p4" />
      </div>
      <div class="promo__img">
        <img :src="p5" />
      </div>
      <div class="promo__img">
        <img :src="p6" />
      </div>
      <div class="promo__img">
        <img :src="p7" />
      </div>
      <div class="promo__img">
        <img :src="p8" />
      </div>
      <div class="promo__img">
        <img :src="p9" />
      </div>
      <div class="promo__img">
        <img :src="p10" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import p1 from '@/assets/image/promo/1.jpg';
import p2 from '@/assets/image/promo/2.jpg';
import p3 from '@/assets/image/promo/3.jpg';
import p4 from '@/assets/image/promo/4.jpg';
import p5 from '@/assets/image/promo/5.jpg';
</script>
