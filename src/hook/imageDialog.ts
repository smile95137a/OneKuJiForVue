import { ref } from 'vue';

interface ImageDialogOptions {
  news?: any;
}

export function useImageDialog() {
  const isImageDialogOpen = ref<boolean>(false);
  const imageDialogOptions = ref<ImageDialogOptions | null>(null);
  const customClass = ref<string | undefined>(undefined);
  let resolveImageDialogPromise: (value: boolean) => void;

  const openImageDialog = (
    options: ImageDialogOptions = {}
  ): Promise<boolean> => {
    isImageDialogOpen.value = true;
    imageDialogOptions.value = options;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveImageDialogPromise = resolve;
    });
  };

  const closeImageDialog = () => {
    isImageDialogOpen.value = false;
    if (resolveImageDialogPromise) {
      resolveImageDialogPromise(true);
    }
  };

  return {
    isImageDialogOpen,
    imageDialogOptions,
    customClass,
    openImageDialog,
    closeImageDialog,
  };
}
