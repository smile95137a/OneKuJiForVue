<template>
  <div class="inventory-management">
    <button class="add-member-button" @click="showCreateDetail = true">新增進貨</button>
    <h2>進銷存管理</h2>
    <table border="1">
      <thead>
        <tr>
          <th>產品名稱</th>
          <th>數量</th>
          <th>等級</th>
          <th>創建時間</th>
          <th>圖片</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(productDetail, index) in paginatedproductDetail" :key="index">
          <td>{{ productDetail.productName }}</td>
          <td>{{ productDetail.quantity }}</td>
          <td>{{ productDetail.grade }}</td>
          <td>{{ formatDate(productDetail.createDate) }}</td>
          <td>
            <img :src="productDetail.image" alt="Product Image" v-if="productDetail.image" width="100" />
          </td>
          <td>
            <button @click="editMember(productDetail)">編輯</button>
            <button class="delete-button" @click="handleDetail(productDetail)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 新增進貨 -->
  <div v-if="showCreateDetail" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="showCreateDetail = false">&times;</span>
      <h2>新增會員</h2>
      <form @submit.prevent="addDetail">
        <div>
          <label for="productId">選擇主產品名稱:</label>
          <select id="productId" v-model="newgMember.productId" required>
            <option v-for="product in products" :key="product.productId" :value="product.productId">
              {{ product.productName }}
            </option>
          </select>
        </div>
        <div>
          <label for="productName">產品名稱:</label>
          <input id="productName" v-model="newgMember.productName" required>
        </div>
        <div>
          <label for="description">描述:</label>
          <input id="description" v-model="newgMember.description" required>
        </div>
        <div>
          <label for="quantity">總數量:</label>
          <input id="quantity" v-model="newgMember.quantity" required>
        </div>
        <div>
          <label for="grade">等級:</label>
          <input id="grade" v-model="newgMember.grade" required>
        </div>
        <div>
          <label for="image">圖片:</label>
          <input id="image" type="file" @change="handleFileUpload">
        </div>
        <button type="submit">提交</button>
      </form>
    </div>
  </div>

  <div v-if="showUpdateDetailModal" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="showUpdateDetailModal = false">&times;</span>
      <h2>編輯會員</h2>
      <form @submit.prevent="updateMember">
        <div>
          <label for="edit-username">產品名稱:</label>
          <input id="edit-username" v-model="editingMember.productName" required>
        </div>
        <div>
          <label for="edit-nickname">描述:</label>
          <input id="edit-nickname" v-model="editingMember.description" required>
        </div>
        <div>
          <label for="edit-email">總數量:</label>
          <input id="edit-email" v-model="editingMember.quantity" required>
        </div>
        <div>
          <label for="edit-phoneNumber">等級:</label>
          <input id="edit-phoneNumber" v-model="editingMember.grade" required>
        </div>
        <div>
          <label for="image">圖片:</label>
          <input id="image" type="file" @change="handleFileUpload">
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { addDetail as addDetailApi, deleteDetail, getDetail, getProducts, updateDtail } from '@/services/api';
import { computed, onMounted, reactive, ref } from 'vue';

const currentPage = ref(1);
const products = ref<any[]>([]);
const detail = ref<any[]>([]);
const itemsPerPage = 10;
const showCreateDetail = ref(false);
const newgMember = reactive<any>({
  productId: '',
  productName: '',
  description: '',
  quantity: '',
  grade: '',
});

const fetchDetailData = async () => {
  try {
    const x = await getDetail();
    detail.value = x.data;
  } catch (error) {
    console.error('獲取數據失敗:', error);
  }
};

const fetchProducts = async () => {
  try {
    const x = await getProducts();
    products.value = x.data;
  } catch (error) {
    console.error('獲取產品失败:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showUpdateDetailModal = ref(false);
const editingMember = reactive<any>({
  productId: '',
  productName: '',
  description: '',
  quantity: '',
  grade: '',
});

const totalPages = computed(() => Math.ceil(detail.value.length / itemsPerPage));

const paginatedproductDetail = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return detail.value.slice(start, end);
});



const editMember = (detail: any) => {
  Object.assign(editingMember, detail);
  showUpdateDetailModal.value = true;
};

const updateMember = async () => {
  const formData = new FormData();
  formData.append('productDetailReq', JSON.stringify(editingMember));
  if (editingMember.image) {
    formData.append('image', editingMember.image);
  }
  try {
    await updateDtail(editingMember);
    await fetchDetailData();
    showUpdateDetailModal.value = false;
  } catch (error) {
    console.error('更新進貨失敗:', error);
  }
};

const handleDetail = async (detail: any) => {
  if (confirm(`確定要刪除產品 ${detail.productName} 嗎？`)) {
    try {
      await deleteDetail(detail.productDetailId);
      await fetchDetailData();
    } catch (error) {
      console.error('刪除會員失敗:', error);
    }
  }
};

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

onMounted(() => {
  fetchDetailData();
  fetchProducts();
});

const addDetail = async () => {
  const formData = new FormData();
  formData.append('productDetailReq', JSON.stringify(newgMember));
  if (newgMember.image) {
    formData.append('image', newgMember.image);
  }
  try {
    await addDetailApi(newgMember);
    await fetchDetailData();
    showCreateDetail.value = false;
    // 重置新進貨表單
    newgMember.productId = '';
    newgMember.productName = '';
    newgMember.description = '';
    newgMember.quantity = '';
    newgMember.grade = '';
  } catch (error) {
    console.error('新增進貨失敗:', error);
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    newgMember.image = target.files[0];
  }
};


</script>


<style scoped>
.member-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  margin: 0;
}

.add-member-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}

.stat-item {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-content h3 {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 0;
  color: #4CAF50;
}

.search-section {
  margin-bottom: 20px;
}

.search-section input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

form button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
