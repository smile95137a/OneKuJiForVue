<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div className="layout">
    <Header />
    <main className="layout__main">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
