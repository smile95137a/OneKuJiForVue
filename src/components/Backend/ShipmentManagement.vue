<template>
  <div class="shipment-management">
    <h2>進出貨管理</h2>
    <!-- Add your shipment management content here -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShipmentManagement',
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

.shipment-management {
  padding: 20px;
}

.shipment-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
