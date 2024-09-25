<template>
  <span>{{ formattedDate }}</span>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { computed } from 'vue';

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
