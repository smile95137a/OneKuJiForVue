import { defineStore } from 'pinia';
import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
}

export const useDialogStore = defineStore('dialog', () => {
  const isConfirmDialogOpen = ref(false);
  const customClass = ref<string | undefined>(undefined);
  let resolvePromise: (value: boolean) => void;

  const openConfirmDialog = (options: DialogOptions = {}): Promise<boolean> => {
    isConfirmDialogOpen.value = true;
    customClass.value = options.customClass;
    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  };

  const closeConfirmDialog = (result: boolean) => {
    isConfirmDialogOpen.value = false;
    if (resolvePromise) {
      resolvePromise(result);
    }
  };

  return {
    isConfirmDialogOpen,
    customClass,
    openConfirmDialog,
    closeConfirmDialog,
  };
});
