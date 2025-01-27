<template>
  <NoData :message="'系統維護中，請稍後再試。感謝您的耐心等候！'" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import NoData from '@/components/common/NoData.vue';
import { useRouter } from 'vue-router';
import { getDisplayNews } from '@/services/frontend/newsService';

const router = useRouter();
let intervalId: ReturnType<typeof setInterval> | undefined = undefined;

const processMarqueeData = async () => {
  try {
    const { success, data, message } = await getDisplayNews();
    if (success) {
      router.push('/home');
    } else {
      console.error('連接失敗:', message);
    }
  } catch (error) {
    console.error('連接失敗:', error);
  }
};

onMounted(() => {
  processMarqueeData();
  intervalId = setInterval(processMarqueeData, 20000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
