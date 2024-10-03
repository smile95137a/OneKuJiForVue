<template>
  <div class="news-control">
    <h1>最新消息管理</h1>

    <button @click="openAddNewsModal" class="btn btn-primary">新增消息</button>

    <!-- 新聞列表 -->
    <table v-if="newsList.length">
      <thead>
        <tr>
          <th>標題</th>
          <th>預覽</th>
          <th>發布日期</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="news in newsList" :key="news.newsUid">
          <td>{{ news.title }}</td>
          <td>{{ news.preview }}</td>
          <td>{{ formatDate(news.createdDate) }}</td>
          <td>
            <span :class="['status-badge', news.status.toLowerCase()]">
              {{ news.status === NewsStatus.AVAILABLE ? '已發布' : '未發布' }}
            </span>
          </td>
          <td>
            <button @click="openEditNewsModal(news)" class="btn btn-edit">編輯</button>
            <button @click="deleteNews(news.newsUid)" class="btn btn-delete">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>暫無最新消息</p>

    <!-- 新增/編輯新聞模態窗 -->
    <div v-if="showNewsModal" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? '編輯消息' : '新增消息' }}</h2>
        <form @submit.prevent="handleNewsSubmit">
          <div class="form-group">
            <label for="title">標題</label>
            <input id="title" v-model="currentNews.title" required />
          </div>
          <div class="form-group">
            <label for="preview">預覽</label>
            <input id="preview" v-model="currentNews.preview" required />
          </div>
          <div class="form-group">
            <label for="content">內容</label>
            <ckeditor :editor="editor" v-model="currentNews.content" :config="editorConfig"></ckeditor>
          </div>
          <div class="form-group">
            <label for="status">狀態</label>
            <select id="status" v-model="currentNews.status">
              <option :value="NewsStatus.AVAILABLE">發布</option>
              <option :value="NewsStatus.UNAVAILABLE">不發布</option>
            </select>
          </div>
          <div class="form-group">
            <label for="images">上傳圖片</label>
            <input type="file" id="images" @change="handleImageUpload" multiple accept="image/*" />
          </div>
          <div v-if="currentNews.imageUrls.length > 0" class="image-preview">
            <div v-for="(image, index) in currentNews.imageUrls" :key="index" class="image-item">
              <img :src="formatImageUrl(image)" alt="新聞圖片" />
              <button type="button" @click="removeImage(index)" class="remove-image">移除</button>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">{{ isEditing ? '更新' : '創建' }}</button>
            <button type="button" @click="closeNewsModal" class="btn btn-secondary">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { News, NewsStatus } from '@/interfaces/news';
import { NewsService } from '@/services/backend/newsservice';
import { onMounted, reactive, ref } from 'vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';

const newsList = ref<News[]>([]);
const showNewsModal = ref(false);
const isEditing = ref(false);
const editor = ClassicEditor;
const editorConfig = {
  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
  language: 'zh-tw'
};

const currentNews = reactive<Partial<News> & { imageUrls: (string | File)[] }>({
  title: '',
  preview: '',
  content: '',
  imageUrls: [],
  status: NewsStatus.UNAVAILABLE,
  author: '',
});

onMounted(async () => {
  await fetchNews();
});

const fetchNews = async () => {
  try {
    const news = await NewsService.getAllNews();
    newsList.value = news || [];
  } catch (error) {
    console.error('獲取新聞列表失敗:', error);
    alert('獲取新聞列表失敗，請稍後再試。');
  }
};

const openAddNewsModal = () => {
  isEditing.value = false;
  resetNewsForm();
  showNewsModal.value = true;
};

const openEditNewsModal = (news: News) => {
  isEditing.value = true;
  Object.assign(currentNews, news);
  showNewsModal.value = true;
};

const closeNewsModal = () => {
  showNewsModal.value = false;
  resetNewsForm();
};

const handleNewsSubmit = async () => {
  try {
    const formData = new FormData();

    const newsData = {
      title: currentNews.title,
      preview: currentNews.preview,
      content: currentNews.content,
      status: currentNews.status,
      author: currentNews.author,
      imageUrls: currentNews.imageUrls.filter(img => typeof img === 'string')
    };

    formData.append('newsReq', JSON.stringify(newsData));

    currentNews.imageUrls.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });

    if (isEditing.value && currentNews.newsUid) {
      await NewsService.updateNews(currentNews.newsUid, formData);
      alert('新聞更新成功');
    } else {
      await NewsService.createNews(formData);
      alert('新聞創建成功');
    }

    await fetchNews();
    closeNewsModal();
  } catch (error) {
    console.error('提交新聞失敗:', error);
    alert('提交新聞失敗，請稍後再試。');
  }
};

const deleteNews = async (newsUid: string) => {
  if (confirm('確定要刪除這則消息嗎？')) {
    try {
      await NewsService.deleteNews(newsUid);
      alert('新聞刪除成功');
      await fetchNews();
    } catch (error) {
      console.error('刪除新聞失敗:', error);
      alert('刪除新聞失敗，請稍後再試。');
    }
  }
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    currentNews.imageUrls = [...currentNews.imageUrls, ...files];
  }
};

const removeImage = (index: number) => {
  currentNews.imageUrls.splice(index, 1);
};

const resetNewsForm = () => {
  Object.assign(currentNews, {
    title: '',
    preview: '',
    content: '',
    imageUrls: [],
    status: NewsStatus.UNAVAILABLE,
    author: '',
  });
};

function formatDate(dateArray: [number, number, number, number, number, number]) {
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${year} 年 ${pad(month)} 月 ${pad(day)} 日 ${pad(hour)} 時 ${pad(minute)} 分 ${pad(second)} 秒`;
}

const formatImageUrl = (url: string | File): string => {
  if (typeof url === 'string') {
    return NewsService.getImageUrl(url);
  }
  return URL.createObjectURL(url);
};
</script>

<style scoped>
.news-control {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h2 {
  color: #333;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.available {
  background-color: #4caf50;
  color: white;
}

.status-badge.unavailable {
  background-color: #f44336;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}

:deep(.ck-editor__editable_inline) {
  min-height: 200px;
}
</style>