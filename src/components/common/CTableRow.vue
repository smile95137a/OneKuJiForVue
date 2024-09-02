<template>
  <div class="ctable__row">
    <div
      v-for="(cell, index) in props.data"
      :key="index"
      :class="['ctable__cell', cell.className || '']"
      :data-title="cell.dataTitle || ''"
    >
      {{ cell.content }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

interface ICTableCell {
  content: any;
  className?: string;
  dataTitle?: string;
}

const props = defineProps<{
  data: ICTableCell[];
}>();
</script>
