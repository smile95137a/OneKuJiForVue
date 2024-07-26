<template>
  <div class="inventory-management">
    <h2>進銷存管理</h2>
    <table border="1">
      <thead>
        <tr>
          <th>日期</th>
          <th>商品名稱</th>
          <th>進貨數量</th>
          <th>出貨數量</th>
          <th>庫存數量</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2024-05-02</td>
          <td>一番賞鬼滅之刃A賞</td>
          <td>30</td>
          <td>10</td>
          <td>20</td>
        </tr>
        <!-- Add more rows as needed -->
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InventoryManagement',
});
</script>

<style scoped>
.inventory-management {
  padding: 20px;
}

.inventory-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.inventory-management table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-management table, 
.inventory-management th, 
.inventory-management td {
  border: 1px solid #ddd;
}

.inventory-management th, 
.inventory-management td {
  padding: 8px;
  text-align: left;
}

.inventory-management th {
  background-color: #f2f2f2;
}
</style>
