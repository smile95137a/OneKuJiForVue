import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
}

interface ConfirmDialogData {
  remainingQuantity: number;
  count: number;
  total: number;
  drawData: any;
}

export function useConfirmDialog() {
  const isConfirmDialogOpen = ref<boolean>(false);
  const confirmDialogData = ref<ConfirmDialogData | null>(null);
  const customClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: boolean) => void;

  const openConfirmDialog = (
    options: DialogOptions = {},
    data: ConfirmDialogData
  ): Promise<boolean> => {
    isConfirmDialogOpen.value = true;
    confirmDialogData.value = data;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closeConfirmDialog = (result: boolean) => {
    isConfirmDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isConfirmDialogOpen,
    confirmDialogData,
    customClass,
    openConfirmDialog,
    closeConfirmDialog,
  };
}
