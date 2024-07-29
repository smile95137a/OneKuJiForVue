<template>
  <div class="permissions-management">
    <h2>權限管理</h2>
    <button class="add-user-button">新增使用者</button>
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
          <tr v-for="(permission, index) in paginatedData" :key="index">
            <td>{{ permission.name }}</td>
            <td>{{ permission.role }}</td>
            <td>{{ permission.status }}</td>
            <td>
              <button>編輯</button>
              <button class="delete-button">刪除使用者</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">上一頁</button>
      <span>第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface Permission {
  name: string;
  role: string;
  status: string;
}

export default defineComponent({
  name: 'PermissionsManagement',
  setup() {
    const permissions = ref<Permission[]>([
      { name: '管理權限', role: '管理組-管理組長-值班管理員', status: '有效' },
      // 加入更多資料
    ]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const totalPages = computed(() => Math.ceil(permissions.value.length / itemsPerPage));

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return permissions.value.slice(start, end);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
      }
    };

    return {
      currentPage,
      totalPages,
      paginatedData,
      nextPage,
      previousPage,
    };
  },
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

.add-user-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.add-user-button:hover {
  background-color: #45a049;
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

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #3f51b5;
  color: #fff;
  margin: 0 10px;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
}
</style>
