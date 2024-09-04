<template>
  <div class="store-management">
    <h1>商店管理</h1>
    
    <button @click="showAddProductModal = true">新增商品</button>

    <div v-if="loading">加載中...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else>
      <!-- 表格內容保持不變 -->
    </table>

    <!-- 新增/編輯商品模態框 -->
    <div v-if="showAddProductModal || showEditProductModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ showAddProductModal ? '新增商品' : '編輯商品' }}</h3>
        <form @submit.prevent="submitProduct">
          <!-- 表單內容保持不變 -->
          <button type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : (showAddProductModal ? '新增' : '更新') }}
          </button>
          <button type="button" @click="closeProductModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { storeService } from '@/services/backend/storeservice';
import { StoreProductReq, StoreProductRes } from '@/interfaces/store';

// 腳本內容基本保持不變，移除 Modal 導入
// ...

// 其餘代碼保持不變
</script>

<style scoped>
.store-management {
  padding: 20px;
}
h1, h3 {
  margin-bottom: 20px;
}
button {
  margin-right: 10px;
  padding: 5px 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
form div {
  margin-bottom: 10px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, select, textarea {
  width: 100%;
  padding: 5px;
}
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.current-product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
  margin-bottom: 10px;
}

/* 新增的模態框樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}
</style>