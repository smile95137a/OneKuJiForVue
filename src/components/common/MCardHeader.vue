<template>
  <div class="w-100 flex items-center justify-center">
    <p class="mcard__text">{{ title }}</p>
  </div>
</template>

<script lang="ts" setup>
interface MCardHeaderProps {
  title: string;
}

withDefaults(defineProps<MCardHeaderProps>(), {
  title: '',
});
</script>
