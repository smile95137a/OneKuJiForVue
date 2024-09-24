<template>
  <span>{{ formattedDate }}</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import moment from 'moment';

interface DateFormatterProps {
  date: string;
  format?: string;
}

const props = defineProps<DateFormatterProps>();

const formattedDate = computed(() => {
  const { date, format = 'YYYY-MM-DD' } = props;
  const parsedDate = moment(date);
  return parsedDate.format(format);
});
</script>
