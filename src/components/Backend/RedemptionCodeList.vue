<template>
  <div>
    <h1>兌換碼列表</h1>

    <!-- 按鈕：打開彈窗 -->
    <button class="btn-primary" @click="openModal">生成新的兌換碼</button>

    <!-- 顯示新生成的兌換碼 -->
    <div v-if="newCode" class="alert alert-success">
      生成的兌換碼: <strong>{{ newCode }}</strong>
    </div>

    <!-- 篩選按鈕 -->
    <div class="filter-buttons">
      <button
        class="btn-filter"
        :class="{ active: filter === 'all' }"
        @click="filter = 'all'"
      >
        全部
      </button>
      <button
        class="btn-filter"
        :class="{ active: filter === 'redeemed' }"
        @click="filter = 'redeemed'"
      >
        已兌換
      </button>
      <button
        class="btn-filter"
        :class="{ active: filter === 'notRedeemed' }"
        @click="filter = 'notRedeemed'"
      >
        未兌換
      </button>
    </div>

    <!-- 篩選商品 -->
    <div class="filter-dropdown">
      <label for="productFilter">篩選產品：</label>
      <select
        v-model="selectedFilterProductId"
        id="productFilter"
        class="dropdown"
        @change="filterRedemptionCodes"
      >
        <option value="">全部</option>
        <option
          v-for="product in products"
          :key="product.productId"
          :value="product.productId"
        >
          {{ product.productName }}
        </option>
      </select>
    </div>

    <!-- 顯示兌換碼列表 -->
    <ul v-if="filteredRedemptionCodes.length > 0" class="code-list">
      <li
        v-for="code in pagination.currentPageItems.value"
        :key="code.id"
        class="code-item"
      >
        <span
          >兌換碼: <strong>{{ code.code }}</strong></span
        >
        <span>已兌換: {{ code.isRedeemed ? '是' : '否' }}</span>
        <span
          >兌換時間:
          <template v-if="code.redeemedAt">
            <DateFormatter
              :date="code.redeemedAt"
              format="YYYY/MM/DD HH:mm:ss"
            />
          </template>
          <template v-else> 尚未兌換 </template>
        </span>
        <span>用戶ID: {{ code.userId ? code.userId : '未指定' }}</span>
        <span
          >指定產品: {{ code.productName ? code.productName : '未指定' }}</span
        >
      </li>
    </ul>
    <div v-else>
      <p>目前沒有可顯示的兌換碼。</p>
    </div>
    <div class="pagination" v-if="pagination.totalPages.value > 1">
      <button
        @click="pagination.previousPage"
        :disabled="pagination.currentPage.value === 1"
      >
        上一頁
      </button>

      <button
        v-for="pageNum in pagination.renderPaginationNums.value"
        :key="pageNum"
        @click="pagination.goToPage(pageNum)"
        :class="{ active: pageNum === pagination.currentPage.value }"
      >
        {{ pageNum }}
      </button>

      <button
        @click="pagination.nextPage"
        :disabled="pagination.currentPage.value === pagination.totalPages.value"
      >
        下一頁
      </button>
    </div>
    <!-- 彈出式視窗 -->
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal">
        <h2>選擇產品生成兌換碼</h2>
        <select v-model="selectedProductId" class="dropdown">
          <option value="" disabled>請選擇產品</option>
          <option
            v-for="product in filteredProducts"
            :key="product.productId"
            :value="product.productId"
          >
            {{ product.productName }}
          </option>
        </select>
        <div class="code-generator-container">
          <div class="form-group">
            <label for="codeCount" class="form-label">生成數量：</label>
            <input
              type="number"
              v-model="codeCount"
              id="codeCount"
              min="1"
              class="form-input"
            />
          </div>
        </div>
        <br />
        <div class="modal-actions">
          <button class="btn-primary" @click="generateCode">確認生成</button>
          <button class="btn-secondary" @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DateFormatter from '@/components/common/DateFormatter.vue';
import { ref, computed, onMounted } from 'vue';
import {
  fetchProducts,
  generateRedemptionCode,
  getAllRedemptionCodes,
} from '@/services/backend/redemptionCodeList';
import { usePagination } from '@/hook/usePagination';
import { useRoleGuard } from '@/hook/useRoleGuard';
useRoleGuard(['1']);

const redemptionCodes = ref([]); // 全部兌換碼列表
const products = ref([]); // 商品列表
const selectedFilterProductId = ref(''); // 選中的商品ID
const filter = ref('all'); // 篩選條件
const newCode = ref(''); // 新生成的兌換碼
const isModalOpen = ref(false); // 控制彈窗
const selectedProductId = ref(''); // 彈窗中選中的商品ID
const codeCount = ref(1); // 生成數量
const filteredProducts = ref([]);

const filteredRedemptionCodes = computed(() => {
  let codes = [...redemptionCodes.value];
  if (selectedFilterProductId.value) {
    codes = codes.filter(
      (code) => code.productId === Number(selectedFilterProductId.value)
    );
  }
  if (filter.value === 'redeemed') {
    codes = codes.filter((code) => code.isRedeemed);
  } else if (filter.value === 'notRedeemed') {
    codes = codes.filter((code) => !code.isRedeemed);
  }
  return codes;
});

// 分頁邏輯
const itemsPerPage = 10;
const pagination = usePagination(filteredRedemptionCodes, itemsPerPage);

onMounted(() => {
  fetchProductList();
  fetchRedemptionCodes();
});

// 獲取商品列表
const fetchProductList = async () => {
  try {
    const response = await fetchProducts();
    products.value = response.data.filter(
      (product) =>
        product.status === 'AVAILABLE' || product.status === 'NOT_AVAILABLE_YET'
    );
    filteredProducts.value = [...products.value];
  } catch (error) {
    console.error('獲取商品列表失敗：', error);
  }
};

// 獲取兌換碼列表
const fetchRedemptionCodes = async () => {
  try {
    const response = await getAllRedemptionCodes();
    redemptionCodes.value = response.data;
    pagination.updateItems(filteredRedemptionCodes.value); // 初始化分頁
  } catch (error) {
    console.error('獲取兌換碼失敗：', error);
  }
};

// 生成兌換碼
const generateCode = async () => {
  if (!selectedProductId.value) {
    alert('請選擇一個產品！');
    return;
  }
  if (codeCount.value < 1) {
    alert('生成數量無效！');
    return;
  }
  try {
    const response = await generateRedemptionCode(
      selectedProductId.value,
      codeCount.value
    );
    newCode.value = response.data; // 假設API返回生成的代碼
    fetchRedemptionCodes();
    closeModal();
  } catch (error) {
    console.error('生成失敗：', error);
    alert('生成失敗！');
  }
};

// 打開彈窗
const openModal = () => {
  isModalOpen.value = true;
};

// 關閉彈窗
const closeModal = () => {
  isModalOpen.value = false;
  selectedProductId.value = '';
};
</script>

<style scoped>
/* 基本页面样式 */
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  margin: 0;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
}

/* 按钮样式 */
button {
  cursor: pointer;
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* 列表样式 */
.code-list {
  list-style-type: none;
  padding: 0;
}

.code-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.code-item span {
  flex: 1;
  font-size: 14px;
}

/* 弹窗背景 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹窗样式 */
.modal {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.modal .dropdown {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* 整體容器樣式 */
.code-generator-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  background-color: #f9f9f9;
  /* 背景色 */
  border: 1px solid #ddd;
  /* 邊框 */
  border-radius: 8px;
  /* 圓角 */
  max-width: 400px;
  /* 最大寬度 */
  margin: 0 auto;
  /* 居中 */
}

/* 表單組樣式 */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

/* 標籤樣式 */
.form-label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

/* 輸入框樣式 */
.form-input {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #007bff;
  /* 聚焦時的邊框顏色 */
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.4);
}

.filter-buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.btn-filter {
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}

.btn-filter.active {
  background-color: #007bff;
  color: white;
}

.filter-dropdown {
  margin-bottom: 20px;
}
.dropdown {
  padding: 8px;
  font-size: 14px;
}
</style>
