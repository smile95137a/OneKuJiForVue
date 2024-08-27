import { ref } from 'vue';

interface InfoDialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
}

export function useInfoDialog() {
  const isInfoDialogOpen = ref<boolean>(false);
  const infoDialogOptions = ref<InfoDialogOptions | null>(null);
  const customClass = ref<string | undefined>(undefined);
  let resolveInfoDialogPromise: (value: boolean) => void;

  const openInfoDialog = (
    options: InfoDialogOptions = {}
  ): Promise<boolean> => {
    isInfoDialogOpen.value = true;
    infoDialogOptions.value = options;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveInfoDialogPromise = resolve;
    });
  };

  const closeInfoDialog = () => {
    isInfoDialogOpen.value = false;
    if (resolveInfoDialogPromise) {
      resolveInfoDialogPromise(true);
    }
  };

  return {
    isInfoDialogOpen,
    infoDialogOptions,
    customClass,
    openInfoDialog,
    closeInfoDialog,
  };
}
