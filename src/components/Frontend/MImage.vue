<template>
  <img
    v-show="!isLoading"
    :src="src"
    @error="handleImageError"
    @load="handleImageLoad"
    loading="lazy"
  />
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import img from '@/assets/image/login.png';

interface IImageLoaderProps {
  src: string;
}

const props = defineProps<IImageLoaderProps>();

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
  img.src = props.src;
  img.onload = handleImageLoad;
  img.onerror = handleImageError;
});
</script>
