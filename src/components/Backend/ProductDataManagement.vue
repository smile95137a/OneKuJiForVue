<template>
  <div class="product-data-management">
    <button class="add-member-button" @click="showAddMemberModal = true">新增商品</button>
    <h2>商品資訊</h2>
    <div class="selection-bar">
      <button @click="fetchData('PRIZE')">一番賞</button>
      <button @click="fetchData('GACHA')">扭蛋</button>
      <button @click="fetchData('BLIND_BOX')">盲盒</button>
    </div>
    <div class="selection-bar" v-if="showOneKuJi">
      <button @click="fetchOneKuJiData('FIGURE')">一番賞</button>
      <button @click="fetchOneKuJiData('C3')">3C家電賞</button>
      <button @click="fetchOneKuJiData('BONUS')">紅利賞</button>
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
          <label for="start-date">活動開始日期:</label>
          <input id="start-date" type="datetime-local" v-model="newgMember.startDate" required>
        </div>
        <div>
          <label for="end-date">活動結束日期:</label>
          <input id="end-date" type="datetime-local" v-model="newgMember.endDate" required>
        </div>

        <!-- 只有當產品類型為一番賞時才顯示此部分 -->
        <div v-if="newgMember.productType === 'PRIZE'">
          <label for="prizeCategory">一番賞類別:</label>
          <select id="prizeCategory" v-model="newgMember.prizeCategory">
            <option value="FIGURE">一番賞</option>
            <option value="C3">家電一番賞</option>
            <option value="BONUS">紅利一番賞</option>
          </select>
        </div>

        <div>
          <label for="grade">狀態:</label>
          <input id="grade" v-model="newgMember.status" required>
        </div>
        <div>
          <label for="image">圖片:</label>
          <div v-if="newgMember.imageUrl">
            <img :src="newgMember.imageUrl" alt="Current Image" style="max-width: 200px;" />
          </div>
          <input id="image" type="file" @change="handleFileUploadNew">
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
          <div v-if="editingMember.imageUrl">
            <img :src="editingMember.imageUrl" alt="Current Image" style="max-width: 200px;" />
          </div>
          <input id="image" type="file" @change="handleFileUpload">
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { deleteProduct, getProductByOneKuJiType, getProductByType } from '@/services/api';

//import { updateProductStatus } from '@/services/Front/Frontapi'
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';

const apiClient = axios.create({
  // baseURL: 'http://localhost:8080/api', // 根据实际情况修改
  baseURL: 'https://6ce2-2402-7500-4dc-948-7df7-96b-239b-ae80.ngrok-free.app/api', // 根据实际情况修改
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
const showOneKuJi = ref(false);

const showAddMemberModal = ref(false);
const currentPage = ref(1);
const products = ref<any[]>([]);
const detail = ref<any[]>([]);
const itemsPerPage = 10;
const showCreateDetail = ref(false);
const fetchData = async (productType: any) => {
  try {
    if (productType === 'PRIZE') {
      showOneKuJi.value = true;
      products.value = [];
    } else {
      showOneKuJi.value = false;
      const res = await getProductByType(productType);
      products.value = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    products.value = [];
  }
};

const fetchOneKuJiData = async (subType: any) => {
  try {
    const res = await getProductByOneKuJiType(subType);
    products.value = res.data;
  } catch (error) {
    console.error('Failed to fetch OneKuJi data:', error);
    products.value = [];
  }
};


// const updateStatus = async (productId: number, status: string) => {
//   try {
//     await updateProductStatus(productId, parseInt(status));
//     console.log('Product status updated successfully');
//   } catch (error) {
//     console.error('Failed to update product status:', error);
//   }
// };

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
  imageUrl: '', // 保存图片的 URL
  imageFile: null as File | null, // 用于保存用户上传的图片文件
  startDate: '',
  endDate: '',
  productType: '',
  prizeCategory: '',
  status: '',

});
const newgMember = ref({
  productName: '',
  description: '',
  price: 0, // 假设 price 应该是数字类型
  stockQuantity: 0, // 数量应该是整数
  soldQuantity: 0, // 数量应该是整数
  imageUrl: '', // 保存图片的 URL
  imageFile: null as File | null, // 用于保存用户上传的图片文件
  startDate: '',
  endDate: '',
  productType: '',
  prizeCategory: '',
  status: ''
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

  formData.append('productReq', JSON.stringify({
    productId: editingMember.productId,
    productDetailId: editingMember.productDetailId,
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
    imageUrl: editingMember.imageUrl, // 保留原始 imageUrl
  }));

  // 如果有新图片，添加到 formData 中
  if (editingMember.imageFile) {
    formData.append('image', editingMember.imageFile);
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

  // 添加产品详情信息
  const productDetailReq = {
    productId: newgMember.value.productId,
    productName: newgMember.value.productName,
    description: newgMember.value.description,
    price: newgMember.value.price,
    stockQuantity: newgMember.value.stockQuantity,
    soldQuantity: newgMember.value.soldQuantity,
    startDate: new Date(newgMember.value.startDate),
    endDate: new Date(newgMember.value.endDate),
    productType: newgMember.value.productType,
    prizeCategory: newgMember.value.prizeCategory,
    status: newgMember.value.status,
    imageUrl: newgMember.value.imageUrl, // 如果已存在 URL，保留
  };

  if (newgMember.value.productType === 'PRIZE') {
  productDetailReq.prizeCategory = newgMember.value.prizeCategory;
}

  formData.append('productReq', JSON.stringify(productDetailReq));

  // 确保文件被正确附加
  if (newgMember.value.imageFile) {
    formData.append('image', newgMember.value.imageFile);
  }

  try {
    await apiClient.post('/product/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 重置表单
    newgMember.value = {
      productName: '',
      description: '',
      price: '',
      stockQuantity: '',
      soldQuantity: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      productType: '',
      prizeCategory: '',
      status: '',
    };

    // 更新 UI 或获取新数据
    await fetchData(newgMember.value.productType);
    showCreateDetail.value = false;
  } catch (error) {
    console.error('新增進貨失敗:', error);
  }
};


const handleDetail = async (detail: any) => {
  if (confirm(`確定要刪除產品 ${detail.productName} 嗎？`)) {
    try {
      console.log(detail);

      await deleteProduct(detail.productId);
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
  fetchData('PRIZE').then(() => {
    fetchOneKuJiData('FIGURE');
  });
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    editingMember.imageFile = target.files[0]; // 更新 imageFile
  }
};

const handleFileUploadNew = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    newgMember.value.imageFile = file; // 保存文件对象
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