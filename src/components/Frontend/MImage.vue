<template>
  <img
    v-show="!isLoading"
    :src="srcURL"
    @error="handleImageError"
    @load="handleImageLoad"
    loading="lazy"
  />
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import img from '@/assets/image/login.png';

interface IImageLoaderProps {
  src: any;
}
const props = defineProps<IImageLoaderProps>();
const apiURL = import.meta.env.VITE_BASE_API_URL as string;
const srcURL = `${apiURL}${props.src}`;

const isLoading = ref(true);

const handleImageLoad = () => {
  isLoading.value = false;
};

const handleImageError = (event: Event | string | number | object) => {
  if (event && event instanceof ErrorEvent && event.target) {
    (event.target as HTMLImageElement).src = img;
  } else if (typeof event === 'object' && 'target' in event) {
    (event.target as HTMLImageElement).src = img;
  }
  isLoading.value = false;
};

onMounted(() => {
  const img = new Image();
  img.src = srcURL;
  img.onload = handleImageLoad;
  img.onerror = handleImageError;
});
</script>
