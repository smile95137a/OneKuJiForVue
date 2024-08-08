import { defineStore } from 'pinia';
import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
}

interface OneKujiDialogOptions {
  customClass?: string;
}

export const useDialogStore = defineStore('dialog', () => {
  const isConfirmDialogOpen = ref(false);
  const customClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: boolean) => void;

  const openConfirmDialog = (options: DialogOptions = {}): Promise<boolean> => {
    isConfirmDialogOpen.value = true;
    customClass.value = options.customClass;
    return new Promise((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closeConfirmDialog = (result: boolean) => {
    isConfirmDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  const isOneKujiDialogOpen = ref(false);
  const oneKujiDialogType = ref<string | null>(null);
  const oneKujiCustomClass = ref<string | undefined>(undefined);
  let resolveOneKujiPromise: (value: boolean) => void;

  const openOneKujiDialog = (
    options: OneKujiDialogOptions = {},
    type: string = ''
  ): Promise<boolean> => {
    isOneKujiDialogOpen.value = true;
    oneKujiCustomClass.value = options.customClass;
    oneKujiDialogType.value = type;
    return new Promise((resolve) => {
      resolveOneKujiPromise = resolve;
    });
  };

  const closeOneKujiDialog = (result: boolean) => {
    isOneKujiDialogOpen.value = false;
    if (resolveOneKujiPromise) {
      resolveOneKujiPromise(result);
    }
  };

  return {
    isConfirmDialogOpen,
    customClass,
    openConfirmDialog,
    closeConfirmDialog,
    isOneKujiDialogOpen,
    oneKujiCustomClass,
    oneKujiDialogType,
    openOneKujiDialog,
    closeOneKujiDialog,
  };
});
