<template>
  <div class="news">
    <div class="news__title">
      <div class="news__text" data-text="最新消息">最新消息</div>
    </div>
    <NoData v-if="newsList.length === 0" />
    <div class="news__list" v-else>
      <div
        class="news__list-item grid"
        v-for="item in newsList"
        :key="item.id"
        @click="goToDetail(item.id)"
      >
        <div class="col-33 col-md-100">
          <MImage :src="item.imageUrl" />
        </div>
        <div class="col-33 col-md-50">{{ item.title }}</div>
        <div class="col-33 col-md-50">{{ item.createdDate }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NoData from '@/components/common/NoData.vue';
import MImage from '@/components/frontend/MImage.vue';

const newsList = ref([
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
  {
    id: 114,
    title: '【賞翻天官方公告】新增功能🌟',
    preview: '寶箱新增一鍵開啟按鈕',
    createdDate: '2024-09-04 17:52:47',
    imageUrl: 'https://kujiflip.tw/uploads/1725443153088.jpg',
    status: 1,
  },
  {
    id: 112,
    title: '【賞翻天官方公告】9月活動開跑拉！！',
    preview: '🎁 儲值就有獎勵 寶箱雙倍送！🎁',
    createdDate: '2024-09-02 00:01:41',
    imageUrl: 'https://kujiflip.tw/uploads/1725329499867.jpg',
    status: 1,
  },
  {
    id: 113,
    title: '【賞翻天官方公告】寶箱機制異動通知',
    preview: '寶箱機制異動通知，麻煩詳閱~',
    createdDate: '2024-09-02 16:23:44',
    imageUrl: 'https://kujiflip.tw/uploads/1725262339791.jpg',
    status: 1,
  },
  {
    id: 110,
    title: '【賞翻天官方公告】9月開始！來開寶箱領回饋吧！',
    preview: '９月全新玩法上線，注意事項務必詳讀😁😁',
    createdDate: '2024-09-01 00:33:13',
    imageUrl: 'https://kujiflip.tw/uploads/1725121179265.jpg',
    status: 1,
  },
  {
    id: 111,
    title: '廠商【搗蛋玩具】公告：於９／１０結束營業',
    preview: '於９／１０結束營業，謝謝會員的支持',
    createdDate: '2024-09-01 00:32:39',
    imageUrl: 'https://kujiflip.tw/uploads/1725121879198.jpg',
    status: 1,
  },
]);

const router = useRouter();

const goToDetail = (id: number) => {
  router.push({ name: 'NewsDetail', params: { id } });
};
</script>

<style scoped></style>
