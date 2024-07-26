<template>
  <div class="product-data-management">
    <h2>商品資訊</h2>
    <!-- Add your product data management content here -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductDataManagement',
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

.product-data-management {
  padding: 20px;
}

.product-data-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
