import { useConfirmDialog } from '@/hook/confirmDialog';
import { useDaliyDialog } from '@/hook/daliyDialog';
import { useImageDialog } from '@/hook/imageDialog';
import { useInfoDialog } from '@/hook/infoDialog';
import { useNewBannerDialog } from '@/hook/newBannerDialog';
import { useOneKujiDialog } from '@/hook/oneKujiDialog';
import { useRestPwdDialog } from '@/hook/restPwdDialog';
import { useYesOrNoDialog } from '@/hook/yesNoDialog';
import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', () => {
  const confirmDialog = useConfirmDialog();
  const oneKujiDialog = useOneKujiDialog();
  const infoDialog = useInfoDialog();
  const imageDialog = useImageDialog();
  const newBannerDialog = useNewBannerDialog();
  const restPwdDialog = useRestPwdDialog();
  const yseOrNoDialog = useYesOrNoDialog();
  return {
    ...confirmDialog,
    ...oneKujiDialog,
    ...infoDialog,
    ...imageDialog,
    ...newBannerDialog,
    ...useDaliyDialog(),
    ...restPwdDialog,
    ...yseOrNoDialog,
  };
});
