<template>
  <div v-if="isOpen" :class="['dialog', customClass]">
    <div class="dialog__overlay" @click="handleClose(false)"></div>
    <div class="dialog__main">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: Boolean,
  customClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close']);

const handleClose = (result: boolean) => {
  emit('close', result);
};
</script>

<style scoped></style>
