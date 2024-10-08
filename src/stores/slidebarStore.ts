import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSlidebarStore = defineStore('slidebar', () => {
  const isOpen = ref<boolean>(false);

  const toggleSlidebar = () => {
    isOpen.value = !isOpen.value;
  };

  const closeSlidebar = () => {
    isOpen.value = false;
  };

  return { isOpen, toggleSlidebar, closeSlidebar };
});
