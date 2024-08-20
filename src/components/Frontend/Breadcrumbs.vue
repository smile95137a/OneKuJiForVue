<template>
  <div class="breadcrumbs">
    <div class="breadcrumbs__items">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'breadcrumbs__item',
          { 'breadcrumbs__item--active': item.isActive },
        ]"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

interface BreadcrumbItem {
  name: string;
  isActive?: boolean;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<style scoped>
/* 可根據需要自定義樣式 */
</style>
