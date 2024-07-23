<template>
  <div :class="cardClass">
    <div v-if="title" class="mcard__header">
      <p class="mcard__text">{{ title }}</p>
    </div>
    <div class="mcard__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
});

const cardClass = computed(() => `mcard ${props.customClass}`.trim());
</script>

<style scoped></style>
