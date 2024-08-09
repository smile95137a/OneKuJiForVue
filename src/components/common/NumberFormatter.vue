<template>
  <span>{{ formattedNumber }}</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface NumberFormatterProps {
  number: number;
  locale?: string;
  options?: Intl.NumberFormatOptions;
}

const props = defineProps<NumberFormatterProps>();

const formattedNumber = computed(() => {
  const { number, locale = 'en-US', options = {} } = props;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    ...options,
  });
  return formatter.format(number);
});
</script>
