import { ref } from 'vue';
import { defineStore } from 'pinia';

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
