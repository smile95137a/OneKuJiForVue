<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="news">
    <div class="news__title">
      <div class="news__text" data-text="最新消息">最新消息</div>
    </div>
    <NoData v-if="newsList.length === 0" />
    <div class="news__list" v-else>
      <div
        class="news__list-item grid"
        v-for="item in newsList"
        :key="item.newsUid"
        @click="goToDetail(item.newsUid)"
      >
        <div class="col-25 col-md-100">
          <MImage :src="item.imageUrls[0]" />
        </div>
        <div class="col-75 col-md-100 grid p-l-24">
          <div class="col-75">
            <p class="news__text news__text--title">{{ item.title }}</p>
          </div>
          <div class="col-25">
            <p class="news__text">
              <DateFormatter
                :date="item.createdDate"
                format="YYYY/MM/DD HH:mm:ss"
              />
            </p>
          </div>
          <div class="col-100">
            <p class="news__text news__text--preview" v-html="item.preview"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NoData from '@/components/common/NoData.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';
import MImage from '@/components/frontend/MImage.vue';
import { getAllNews, News } from '@/services/frontend/newsService';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';

const breadcrumbItems = [{ name: '首頁' }, { name: '最新消息' }];
const newsList = ref<News[]>([]); // 定义为News类型数组
const router = useRouter();

const goToDetail = (newsUid: string) => {
  router.push({ name: 'NewsDetail', params: { newsUid } });
};

// 页面加载时获取新闻列表
const fetchNewsList = async () => {
  try {
    const response = await getAllNews();
    if (response.success) {
      newsList.value = response.data; // 从API获取数据并赋值
    } else {
      console.error('Failed to fetch news list:', response.message);
    }
  } catch (error) {
    console.error('Error fetching news list:', error);
  }
};

onMounted(() => {
  fetchNewsList(); // 页面加载时调用获取新闻列表
});
</script>
