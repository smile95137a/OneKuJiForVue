import { useConfirmDialog } from '@/hook/confirmDialog';
import { useInfoDialog } from '@/hook/infoDialog';
import { useOneKujiDialog } from '@/hook/oneKujiDialog';
import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', () => {
  const confirmDialog = useConfirmDialog();
  const oneKujiDialog = useOneKujiDialog();
  const infoDialog = useInfoDialog();

  return {
    ...confirmDialog,
    ...oneKujiDialog,
    ...infoDialog,
  };
});
