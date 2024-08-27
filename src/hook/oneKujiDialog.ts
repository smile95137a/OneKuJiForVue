import { ref } from 'vue';

interface OneKujiDialogOptions {
  customClass?: string;
}

export function useOneKujiDialog() {
  const isOneKujiDialogOpen = ref<boolean>(false);
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
    return new Promise<boolean>((resolve) => {
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
    isOneKujiDialogOpen,
    oneKujiDialogType,
    oneKujiCustomClass,
    openOneKujiDialog,
    closeOneKujiDialog,
  };
}
