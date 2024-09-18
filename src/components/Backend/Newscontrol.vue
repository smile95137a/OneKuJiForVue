<template>
    <div class="news-control">
      <h1>新闻管理</h1>
      
      <!-- 新闻列表 -->
      <table>
        <thead>
          <tr>
            <th>标题</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="news in newsList" :key="news.newsUid">
            <td>{{ news.title }}</td>
            <td>{{ news.status }}</td>
            <td>
              <button @click="editNews(news)">编辑</button>
              <button @click="deleteNews(news.newsUid)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 新闻表单 -->
      <form @submit.prevent="submitNews">
        <input v-model="currentNews.title" placeholder="标题" required>
        <textarea v-model="currentNews.content" placeholder="内容" required></textarea>
        <select v-model="currentNews.status">
          <option value="AVAILABLE">上架</option>
          <option value="UNAVAILABLE">下架</option>
        </select>
        <input type="file" @change="handleFileUpload" multiple accept="image/*">
        <button type="submit">{{ isEditing ? '更新' : '创建' }}</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { NewsService } from '@/services/backend/newsservice';
  import { News, NewsStatus } from '@/interfaces/news';
  
  export default defineComponent({
    name: 'NewsControl',
    setup() {
      const newsList = ref<News[]>([]);
      const currentNews = ref<News>({
        newsUid: '',
        title: '',
        content: '',
        imageUrls: [],
        status: NewsStatus.AVAILABLE
      });
      const isEditing = ref(false);
      const selectedFiles = ref<File[]>([]);
  
      const loadNews = async () => {
        newsList.value = await NewsService.getAllNews();
      };
  
      const submitNews = async () => {
        if (isEditing.value) {
          await NewsService.updateNews(currentNews.value.newsUid, currentNews.value, selectedFiles.value);
        } else {
          await NewsService.createNews(currentNews.value, selectedFiles.value);
        }
        await loadNews();
        resetForm();
      };
  
      const editNews = (news: News) => {
        currentNews.value = { ...news };
        isEditing.value = true;
      };
  
      const deleteNews = async (newsUid: string) => {
        await NewsService.deleteNews(newsUid);
        await loadNews();
      };
  
      const resetForm = () => {
        currentNews.value = {
          newsUid: '',
          title: '',
          content: '',
          imageUrls: [],
          status: NewsStatus.AVAILABLE
        };
        isEditing.value = false;
        selectedFiles.value = [];
      };
  
      const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files) {
          selectedFiles.value = Array.from(target.files);
        }
      };
  
      onMounted(loadNews);
  
      return {
        newsList,
        currentNews,
        isEditing,
        submitNews,
        editNews,
        deleteNews,
        handleFileUpload
      };
    }
  });
  </script>
  
  <style scoped>
  .news-control {
    max-width: 800px;
    margin: 0 auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  input, textarea, select {
    padding: 5px;
  }
  
  button {
    cursor: pointer;
  }
  </style>