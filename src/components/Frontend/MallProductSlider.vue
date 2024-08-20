<template>
  <div class="mall-product__slider" :class="sliderClass">
    <div class="mall-product__sliderTitle">
      <div class="mall-product__sliderTitle-icon" v-html="icon"></div>
      <div class="mall-product__sliderTitle-text">{{ title }}</div>
    </div>
    <div
      ref="prevBtn"
      class="mall-product__slider-btn mall-product__slider-btn--prev"
    >
      <i class="fa-solid fa-arrow-left"></i>
    </div>
    <div class="mall-product__slider-list">
      <div class="mall-product__slider-main">
        <Swiper
          :slidesPerView="slidesPerView"
          :spaceBetween="spaceBetween"
          :navigation="{
            nextEl: nextBtn,
            prevEl: prevBtn,
          }"
          :modules="[Navigation]"
          :loop="true"
        >
          <SwiperSlide
            v-for="(product, index) in products"
            :key="product.productId"
            :class="slideClass"
          >
            <ProductCard
              :index="index"
              :product="product"
              :card-type="'mall'"
              customClass="mall-product__slider-item"
              :isRank="isRank"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
    <div
      ref="nextBtn"
      class="mall-product__slider-btn mall-product__slider-btn--next"
    >
      <i class="fa-solid fa-arrow-right"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';

import ProductCard from '@/components/Frontend/ProductCard.vue';

const props = defineProps({
  sliderClass: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'X',
  },
  products: {
    type: Array,
    required: true,
  },
  slidesPerView: {
    type: Number,
    default: 3,
  },
  isRank: {
    type: Boolean,
    default: false,
  },
  slideClass: {
    type: String,
    default: '',
  },
  spaceBetween: {
    type: Number,
    default: 24,
  },
});

const prevBtn = ref(null);
const nextBtn = ref(null);
</script>

<style scoped></style>
