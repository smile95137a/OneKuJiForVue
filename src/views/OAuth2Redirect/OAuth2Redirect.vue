<template>
  <div>
    <p>Hello World</p>
    <div v-if="redirectTo">
      <p>Redirecting to the specified route...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const redirectTo = ref<string | null>(null);

onMounted(() => {
  const accessToken = extractUrlParameter('token');
  if (accessToken) {
    authStore.setToken(accessToken);
    redirectTo.value = '/home';
    router.push(redirectTo.value);
  } else {
    redirectTo.value = '/login';
    router.push(redirectTo.value);
  }
});

const extractUrlParameter = (key: string): string | null => {
  return (route.query[key] as string) || null;
};
</script>
