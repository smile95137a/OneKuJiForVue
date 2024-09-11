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
      <MImage :src="newsItem.imageUrl" />
      <div v-html="newsItem.preview"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MImage from '@/components/frontend/MImage.vue';

const route = useRoute();
const newsItem = ref<null | {
  id: number;
  title: string;
  preview: string;
  createdDate: string;
  imageUrl: string;
}>(null);

const newsList = [
  {
    id: 117,
    title: '廠商【玩具果實】公告:於9/30結束營業',
    preview: '',
    createdDate: '2024-09-10 17:11:08',
    imageUrl: 'https://kujiflip.tw/uploads/1725959462644.jpg',
    status: 1,
  },
  {
    id: 116,
    title: '【賞翻天官方公告】關於VIP介紹',
    preview: '以下是詳細內容，歡迎詳閱😊',
    createdDate: '2024-09-07 16:33:30',
    imageUrl: 'https://kujiflip.tw/uploads/1725698222105.jpg',
    status: 1,
  },
];

const fetchNewsDetail = (id: number) => {
  return newsList.find((news) => news.id === id) || null;
};

onMounted(() => {
  const newsId = Number(route.params.id);
  newsItem.value = fetchNewsDetail(newsId);
});
</script>

<style scoped></style>
