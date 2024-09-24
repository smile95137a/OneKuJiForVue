<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="newsDetail" v-if="newsItem">
    <div class="newsDetail__title">
      <div class="newsDetail__title-title">
        <p class="newsDetail__text">{{ newsItem.title }}</p>
      </div>
    </div>
    <p class="newsDetail__text">
      <DateFormatter
        :date="newsItem.createdDate"
        format="YYYY/MM/DD HH:mm:ss"
      />
    </p>
    <hr class="m-t-24" />
    <div class="newsDetail__content">
      <MImage
        v-if="newsItem.imageUrls && newsItem.imageUrls.length > 0"
        :src="newsItem.imageUrls[0]"
      />
    </div>
    <div v-html="newsItem.preview"></div>
    <!-- 新增：顯示新聞詳細內容 -->
    <div class="newsDetail__fullContent" v-html="newsItem.content"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MImage from '@/components/frontend/MImage.vue';
import { getNewsById, News } from '@/services/frontend/newsService';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';

const breadcrumbItems = ref([{ name: '首頁' }, { name: '最新消息' }]);
// 獲取當前路由
const route = useRoute();
// 定義新聞項
const newsItem = ref<News | null>(null);

// 獲取新聞詳情
const fetchNewsDetail = async (newsUid: string) => {
  try {
    const { success, data, message } = await getNewsById(newsUid);
    if (success) {
      newsItem.value = data;
      breadcrumbItems.value.push({ name: data.title });
    } else {
      console.error('Error fetching news:', message);
    }
  } catch (error) {
    console.error('Error fetching news detail:', error);
  }
};

onMounted(() => {
  const newsUid = String(route.params.newsUid);
  fetchNewsDetail(newsUid); // 調用 API 獲取新聞詳情
});
</script>

<style scoped></style>
