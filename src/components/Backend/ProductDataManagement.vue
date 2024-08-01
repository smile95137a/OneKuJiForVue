<template>
  <div class="product-data-management">
    <button class="add-member-button" @click="showAddMemberModal = true">新增會員</button>
    <h2>商品資訊</h2>
    <div class="selection-bar">
      <button @click="fetchData('PRIZE')">一番賞</button>
      <button @click="fetchData('GACHA')">扭蛋</button>
      <button @click="fetchData('BLIND_BOX')">盲盒</button>
    </div>
    <div class="product-table">
      <table>
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>價格</th>
            <th>庫存</th>
            <th>上架日期</th>
            <th>狀態</th>
            <th>圖片</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.productId">
            <td>{{ product.productName }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ formatDate(product.startDate) }}</td>
            <td>
              <select v-model="product.status">
                <option value="AVAILABLE">上架</option>
                <option value="UNAVAILABLE">下架</option>
                <option value="NOT_AVAILABLE_YET">尚未上架</option>
                <option value="SOLD_OUT">上架已售完</option>
              </select>
            </td>
            <td><img :src="product.imageUrl" alt="Product Image" class="product-image" /></td>
            <td>
              <button @click="editMember(product)">編輯</button>
              <button class="delete-button" @click="handleDetail(product)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">上一頁</button>
      <span>第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
    </div>

  <div v-if="showAddMemberModal" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="showAddMemberModal = false">&times;</span>
      <h2>新增主題</h2>
      <form @submit.prevent="addDetail">
        <div>
          <label for="productId">選擇主產品類別:</label>
          <select id="productId" v-model="newgMember.productType" required>
            <option value="PRIZE">一番賞</option>
            <option value="BLIND_BOX">盲盒</option>
            <option value="GACHA">扭蛋</option>
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
          <label for="quantity">價格:</label>
          <input id="quantity" v-model="newgMember.price" required>
        </div>
        <div>
          <label for="grade">總數量:</label>
          <input id="grade" v-model="newgMember.stockQuantity" required>
        </div>
        <div>
          <label for="grade">銷售數量:</label>
          <input id="grade" v-model="newgMember.soldQuantity" required>
        </div>
        <div>
          <label for="grade">活動開始日期:</label>
          <input id="grade" v-model="newgMember.startDate" required>
        </div>
        <div>
          <label for="grade">活動結束日期:</label>
          <input id="grade" v-model="newgMember.endDate" required>
        </div>
        <div>
          <label for="grade">一番賞類別:</label>
          <input id="grade" v-model="newgMember.prizeCategory">
        </div>
        <div>
          <label for="grade">狀態:</label>
          <input id="grade" v-model="newgMember.status" required>
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
        <input type="hidden" v-model="editingMember.productId">
        <div>
          <label for="productId">選擇主產品類別:</label>
          <select id="productId" v-model="editingMember.productType" required>
            <option value="PRIZE">一番賞</option>
            <option value="BLIND_BOX">盲盒</option>
            <option value="GACHA">扭蛋</option>
          </select>
        </div>
        <div>
          <label for="productName">產品名稱:</label>
          <input id="productName" v-model="editingMember.productName" required>
        </div>
        <div>
          <label for="description">描述:</label>
          <input id="description" v-model="editingMember.description" required>
        </div>
        <div>
          <label for="quantity">價格:</label>
          <input id="quantity" v-model="editingMember.price" required>
        </div>
        <div>
          <label for="grade">總數量:</label>
          <input id="grade" v-model="editingMember.stockQuantity" required>
        </div>
        <div>
          <label for="grade">銷售數量:</label>
          <input id="grade" v-model="editingMember.soldQuantity" required>
        </div>
        <div>
          <label for="grade">活動開始日期:</label>
          <input id="grade" v-model="editingMember.startDate" required>
        </div>
        <div>
          <label for="grade">活動結束日期:</label>
          <input id="grade" v-model="editingMember.endDate" required>
        </div>
        <div>
          <label for="grade">一番賞類別:</label>
          <input id="grade" v-model="editingMember.prizeCategory">
        </div>
        <div>
          <label for="grade">狀態:</label>
          <input id="grade" v-model="editingMember.status" required>
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

import { deleteProduct, getProductByType } from '@/services/api';
import { updateProductStatus } from '@/services/Front/Frontapi';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';

const apiClient = axios.create({
  baseURL: 'https://a153-2402-7500-4ce-3589-a97b-f3fb-d6ec-8d49.ngrok-free.app/api', // 根据实际情况修改
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


const showAddMemberModal = ref(false);
const currentPage = ref(1);
const products = ref<any[]>([]);
const detail = ref<any[]>([]);
const itemsPerPage = 10;
const showCreateDetail = ref(false);
const fetchData = async (productType: any) => {
  try {
    const res = await getProductByType(productType);
    products.value = res.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    products.value = []; // 清空數據，顯示"查無資料"
  }
};

const updateStatus = async (productId: number, status: string) => {
  try {
    await updateProductStatus(productId, parseInt(status));
    console.log('Product status updated successfully');
  } catch (error) {
    console.error('Failed to update product status:', error);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
const showUpdateDetailModal = ref(false);
const editingMember = reactive<any>({
  productId: '',
  productName: '',
  description: '',
  price: '',
  stockQuantity: '',
  soldQuantity: '',
  imageUrl: null as File | null,
  startDate: '',
  endDate: '',
  productType: '',
  prizeCategory: '',
  status: '',

});
const newgMember = ref({
  productName: '',
  description: '',
  price: '',
  stockQuantity: '',
  soldQuantity: '',
  imageUrl: null as File | null,
  startDate: '',
  endDate: '',
  productType: '',
  prizeCategory: '',
  status: '',
});

const totalPages = computed(() => Math.ceil(detail.value.length / itemsPerPage));

const paginatedproductDetail = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return detail.value.slice(start, end);
});

const editMember = (member: any) => {
  Object.assign(editingMember, member);
  showUpdateDetailModal.value = true;
};


const updateMember = async () => {
  const formData = new FormData();
  console.log('123123', editingMember);

  // 将 productReq 作为 JSON 字符串添加到 formData 中
  formData.append('productReq', JSON.stringify({
    productId: editingMember.productId, // 确保这里包含了 productId
    productDetailId: editingMember.productDetailId, // 如果需要的话
    productName: editingMember.productName,
    description: editingMember.description,
    price: editingMember.price,
    stockQuantity: editingMember.stockQuantity,
    soldQuantity: editingMember.soldQuantity,
    startDate: editingMember.startDate,
    endDate: editingMember.endDate,
    productType: editingMember.productType,
    prizeCategory: editingMember.prizeCategory,
    status: editingMember.status,
  }));

  // 如果有图片，添加到 formData 中
  if (editingMember.imageUrl instanceof File) {
    formData.append('image', editingMember.imageUrl);
  }

  try {
    // 更新数据
    await apiClient.put(`/product/${editingMember.productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // 重新获取数据
    await fetchData(editingMember.productType);
    // 关闭模态框
    showUpdateDetailModal.value = false;
  } catch (error) {
    console.error('更新进货失败:', error);
  }
};
const addDetail = async () => {
  const formData = new FormData();
  formData.append('productReq', JSON.stringify({
    productName: newgMember.value.productName,
    description: newgMember.value.description,
    price: newgMember.value.price,
    stockQuantity: newgMember.value.stockQuantity,
    soldQuantity: newgMember.value.soldQuantity,
    startDate: newgMember.value.startDate,
    endDate: newgMember.value.endDate,
    productType: newgMember.value.productType,
    prizeCategory: newgMember.value.prizeCategory,
    status: newgMember.value.status,
  }));
  
  if (newgMember.value.imageUrl) {
    formData.append('image', newgMember.value.imageUrl);
  }
  
  try {
    await apiClient.post('/productDetail/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Reset form
    newgMember.value = {
      productName: '',
      description: '',
      price: '',
      stockQuantity: '',
      soldQuantity: '',
      imageUrl: null,
      startDate: '',
      endDate: '',
      productType: '',
      prizeCategory: '',
      status: '',
    };

    // Fetch data or update UI as needed
    await fetchData(newgMember.value.productType);
    showCreateDetail.value = false;
  } catch (error) {
    console.error('新增進貨失敗:', error);
  }
};

const handleDetail = async (detail: any) => {
  if (confirm(`確定要刪除產品 ${detail.productName} 嗎？`)) {
    try {
      await deleteProduct(detail.productDetailId);
      await fetchData(detail.productType);
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
  fetchData('PRIZE'); // 默認加載一番賞商品
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    editingMember.value.image = target.files[0];
  }
};
</script>

<style scoped>
.product-data-management {
  padding: 20px;
}

.product-data-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.selection-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.selection-bar button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.selection-bar button:hover {
  background-color: #45a049;
}

.product-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.product-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

.no-data {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
}

.add-member-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
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