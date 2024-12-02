<template>
  <div>
    <RestPwdForm />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RestPwdForm from '@/components/frontend/rest-pwd/RestPwdForm.vue';
import RestPwdUnauth from '@/components/frontend/rest-pwd/RestPwdUnauth.vue';
import { verifyPasswordToken } from '@/services/frontend/passwordResetService';
import { useDialogStore } from '@/stores';

interface ErrMsg {
  title: string;
  message: string;
}

const errCodeMap: Record<string, ErrMsg> = {
  9001: {
    title: '失效的連結',
    message: '連結已被使用，請您再確認。',
  },
  9002: {
    title: '失效的連結',
    message: '連結已過期，請您再確認。',
  },
  9003: {
    title: '無效的連結',
    message: '無效的連結，請您再確認。',
  },
  9004: {
    title: '無效的連結',
    message: '不存在此連結，請您再確認。',
  },
};

const route = useRoute();
const token = route.params.token as string;

const dialogStore = useDialogStore();

const isActiveUrl = ref(false);
const errMsgObj = ref<ErrMsg>({ title: '', message: '' });

const verifyToken = async () => {
  console.log('Verifying token:', token);
  try {
    const { success, message } = await verifyPasswordToken(token);
    console.log('Verification result:', success, 'Message:', message);
    if (success) {
      isActiveUrl.value = true;
    } else {
      isActiveUrl.value = false;
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: message || '未知的錯誤，請稍後再試。',
      });
    }
  } catch (error: any) {
    console.error('Error during token verification:', error);
    const code = (error.data?.code as keyof typeof errCodeMap) || '9004';
    isActiveUrl.value = false;
    errMsgObj.value = errCodeMap[code];
    console.log('Error message set to:', errMsgObj.value);
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: errMsgObj.value.message,
    });
  }
};

onMounted(() => {
  console.log('Component mounted, starting token verification...');
  verifyToken();
});
</script>
