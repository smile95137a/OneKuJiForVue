<template>
  <div class="permissions-management">
    <h2>權限管理</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>權限名稱</th>
            <th>職務</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>管理權限</td>
            <td>管理組-管理組長-值班管理員</td>
            <td>有效</td>
            <td><button>編輯</button></td>
          </tr>
          <!-- Add more rows as needed -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PermissionsManagement',
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

.permissions-management {
  padding: 20px;
}

.permissions-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #3f51b5;
  color: #fff;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #303f9f;
}
</style>
