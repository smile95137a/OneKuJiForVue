<template>
  <div :class="['ctable', props.customClass]">
    <div class="ctable__row ctable__header">
      <div
        v-for="(header, index) in props.headers"
        :key="index"
        :class="['ctable__cell', header.className || '']"
      >
        {{ header.text }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, PropType } from 'vue';

interface ICTableHeader {
  text: any;
  className?: string;
}

const props = withDefaults(
  defineProps<{
    headers: ICTableHeader[];
    customClass?: string;
  }>(),
  {
    customClass: '',
  }
);
</script>
