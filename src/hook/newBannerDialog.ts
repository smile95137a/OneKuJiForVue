import { ref } from 'vue';

interface NewBannerDialogOptions {
  newsList?: any;
}

export function useNewBannerDialog() {
  const isNewBannerDialogOpen = ref<boolean>(false);
  const newBannerDialogOptions = ref<NewBannerDialogOptions | null>(null);
  const customClass = ref<string | undefined>(undefined);
  let resolveNewBannerDialogPromise: (value: boolean) => void;

  const openNewBannerDialog = (
    options: NewBannerDialogOptions = {}
  ): Promise<boolean> => {
    isNewBannerDialogOpen.value = true;
    newBannerDialogOptions.value = options;
    return new Promise<boolean>((resolve) => {
      resolveNewBannerDialogPromise = resolve;
    });
  };

  const closeNewBannerDialog = () => {
    isNewBannerDialogOpen.value = false;
    if (resolveNewBannerDialogPromise) {
      resolveNewBannerDialogPromise(true);
    }
  };

  return {
    isNewBannerDialogOpen,
    newBannerDialogOptions,
    customClass,
    openNewBannerDialog,
    closeNewBannerDialog,
  };
}
