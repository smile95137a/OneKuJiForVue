<template>
  <div class="newsDetail" v-if="newsItem">
    <div class="newsDetail__title">
      <div class="newsDetail__title-title">
        <p class="newsDetail__text">{{ newsItem.title }}</p>
      </div>
      <div class="newsDetail__title-date">
        <p class="newsDetail__text">{{ newsItem.createdDate }}</p>
      </div>
    </div>
    <div class="newsDetail__content">
      <MImage
        v-if="newsItem.imageUrls && newsItem.imageUrls.length > 0"
        :src="newsItem.imageUrls[0]"
      />
      <div v-html="newsItem.preview"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MImage from '@/components/frontend/MImage.vue';
import { getNewsById, News } from '@/services/frontend/newsService';

// 获取当前路由
const route = useRoute();
// 定义新闻项
const newsItem = ref<News | null>(null);

// 获取新闻详情
const fetchNewsDetail = async (newsUid: string) => {
  try {
    const { success, data, message } = await getNewsById(newsUid);
    if (success) {
      newsItem.value = data;
    } else {
      console.error('Error fetching news:', message);
    }
  } catch (error) {
    console.error('Error fetching news detail:', error);
  }
};

onMounted(() => {
  const newsUid = String(route.params.newsUid);
  fetchNewsDetail(newsUid); // 调用 API 获取新闻详情
});
</script>

<style scoped></style>
