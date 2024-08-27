<template>
  hello world
  <div v-if="redirectTo">
    <router-view v-if="false" />
    <router-link :to="redirectTo" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const redirectTo = ref('/login');

onMounted(() => {
  const accessToken = extractUrlParameter('token');
  if (accessToken) {
    console.log(accessToken);
  }
});

const extractUrlParameter = (key) => {
  return route.query[key] || null;
};
</script>
