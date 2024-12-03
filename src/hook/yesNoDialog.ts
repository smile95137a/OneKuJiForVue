import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
}

export function useYesOrNoDialog() {
  const isYesNoDialogOpen = ref<boolean>(false);
  const yesNoDialogOptions = ref<DialogOptions | null>(null);
  const customClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: boolean) => void;

  const openYesNoDialog = (options: DialogOptions = {}): Promise<boolean> => {
    isYesNoDialogOpen.value = true;
    yesNoDialogOptions.value = options;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closeYesNoDialog = (result: boolean) => {
    isYesNoDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isYesNoDialogOpen,
    yesNoDialogOptions,
    customClass,
    openYesNoDialog,
    closeYesNoDialog,
  };
}
