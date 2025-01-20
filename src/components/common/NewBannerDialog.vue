<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="`${customClass} dialog--newBanner`"
    @close="handleClose"
  >
    <div class="newBannerDialog">
      <div class="newBannerDialog__header">
        <div class="newBannerDialog__logo">
          <img :src="logoImg" alt="Logo" class="newBannerDialog__logo-img" />
        </div>
        <div class="newBannerDialog__close" @click="handleClose">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="newBannerDialog__main">
        <div class="news-slider">
          <Swiper
            :slidesPerView="1"
            :centeredSlides="true"
            :loop="true"
            navigation
            :modules="[Navigation]"
            class="mySwiper"
          >
            <SwiperSlide
              v-for="news in newsList"
              :key="news.bannerUid"
              @click="goToNews(news)"
            >
              <MImage
                :src="news.imageUrls[0]"
                custom-class="news-slider__item-img"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Dialog from './Dialog.vue';
import MImage from '@/components/frontend/MImage.vue';
import { useDialogStore } from '@/stores/dialogStore';
import logoImg from '@/assets/image/logo1.png';
import { Navigation } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useRouter } from 'vue-router';
import { genRandom } from '@/utils/RandomUtils';

const dialogStore = useDialogStore();
const router = useRouter();
const isOpen = computed(() => dialogStore.isNewBannerDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const newsList = computed(
  () => dialogStore.newBannerDialogOptions?.newsList || []
);

const handleClose = () => {
  dialogStore.closeNewBannerDialog();
};

const goToNews = (news: any) => {
  router.push(`/news/${news.newsUid}`);
  handleClose();
};
</script>

<style scoped></style>
