<template>
  <div v-if="isRank" class="productCard__rank">{{ index + 1 }}</div>
  <div class="productCard__img-content productCard__img-content--mall">
    <div class="productCard__img-detail">
      <div v-if="!isRank" class="productCard__img-status">預購</div>
      <div class="productCard__img-price">
        <p class="productCard__img-money" v-if="product.isSpecialPrice">
          <del class="productCard__text">$ {{ product.price }}</del>
        </p>
        <p class="productCard__img-spMoney">
          <span class="productCard__text"
            >$
            {{
              product.isSpecialPrice ? product.specialPrice : product.price
            }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
interface IproductContentAProps {
  index?: number;
  product: any;
  isRank?: boolean;
}

defineProps<IproductContentAProps>();
</script>
