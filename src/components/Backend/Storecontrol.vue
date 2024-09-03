<template>
    <div class="store-management">
      <h1>商店管理</h1>
      
      <button @click="showAddProductModal = true">新增商品</button>
  
      <div v-if="loading">加載中...</div>
      <div v-else-if="error">{{ error }}</div>
      <table v-else>
        <thead>
          <tr>
            <th>商品圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th>庫存</th>
            <th>銷售量</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img 
                v-if="product.imageUrls && product.imageUrls.length > 0"
                :src="product.imageUrls[0]"
                :alt="product.productName"
                class="product-image"
              />
              <span v-else>無圖片</span>
            </td>
            <td>{{ product.productName }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ product.soldQuantity }}</td>
            <td>{{ product.status }}</td>
            <td>
              <button @click="editProduct(product)">編輯</button>
              <button @click="deleteProduct(product.id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 新增/編輯商品模態框 -->
      <modal v-if="showAddProductModal || showEditProductModal" @close="closeProductModal">
        <h3>{{ showAddProductModal ? '新增商品' : '編輯商品' }}</h3>
        <form @submit.prevent="submitProduct">
          <div>
            <label for="productName">商品名稱:</label>
            <input id="productName" v-model="currentProduct.productName" required>
          </div>
          <div>
            <label for="description">描述:</label>
            <textarea id="description" v-model="currentProduct.description"></textarea>
          </div>
          <div>
            <label for="price">價格:</label>
            <input id="price" type="number" v-model="currentProduct.price" required>
          </div>
          <div>
            <label for="stockQuantity">庫存:</label>
            <input id="stockQuantity" type="number" v-model="currentProduct.stockQuantity" required>
          </div>
          <div>
            <label for="soldQuantity">銷售量:</label>
            <input id="soldQuantity" type="number" v-model="currentProduct.soldQuantity" required>
          </div>
          <div>
            <label for="startDate">開始日期:</label>
            <input id="startDate" type="date" v-model="currentProduct.startDate" required>
          </div>
          <div>
            <label for="endDate">結束日期:</label>
            <input id="endDate" type="date" v-model="currentProduct.endDate" required>
          </div>
          <div>
            <label for="productType">商品類型:</label>
            <input id="productType" v-model="currentProduct.productType" required>
          </div>
          <div>
            <label for="status">狀態:</label>
            <select id="status" v-model="currentProduct.status" required>
              <option value="AVAILABLE">上架</option>
              <option value="UNAVAILABLE">下架</option>
              <option value="NOT_AVAILABLE_YET">尚未上架</option>
              <option value="SOLD_OUT">已售完</option>
            </select>
          </div>
          <div>
            <label>當前圖片:</label>
            <div v-if="currentProduct.imageUrls && currentProduct.imageUrls.length > 0">
              <img 
                v-for="(imageUrl, index) in currentProduct.imageUrls" 
                :key="index"
                :src="imageUrl"
                :alt="currentProduct.productName"
                class="current-product-image"
              />
            </div>
            <span v-else>無當前圖片</span>
          </div>
          <div>
            <label for="productImage">更新商品圖片:</label>
            <input id="productImage" type="file" @change="handleImageUpload" multiple>
          </div>
          <button type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : (showAddProductModal ? '新增' : '更新') }}
          </button>
        </form>
      </modal>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { storeService } from '@/services/backend/storeservice';
  import { StoreProductReq, StoreProductRes } from '@/interfaces/store.ts';
  import Modal from './Modal.vue';
  
  const products = ref<StoreProductRes[]>([]);
  const showAddProductModal = ref(false);
  const showEditProductModal = ref(false);
  const currentProduct = reactive<StoreProductReq>({
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    soldQuantity: 0,
    startDate: '',
    endDate: '',
    productType: '',
    status: '',
    imageUrls: []
  });
  const imageFiles = ref<File[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const submitting = ref(false);
  
  onMounted(async () => {
    await fetchProducts();
  });
  
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await storeService.getAllStoreProducts();
      products.value = response.data || [];
    } catch (err) {
      console.error('獲取商品列表失敗:', err);
      error.value = '獲取商品列表失敗，請稍後重試';
    } finally {
      loading.value = false;
    }
  };
  
  const editProduct = (product: StoreProductRes) => {
    Object.assign(currentProduct, product);
    showEditProductModal.value = true;
  };
  
  const deleteProduct = async (productId: number) => {
    if (confirm('確定要刪除這個商品嗎？')) {
      try {
        await storeService.deleteStoreProduct(productId);
        await fetchProducts();
      } catch (err) {
        console.error('刪除商品失敗:', err);
        alert('刪除商品失敗，請稍後重試');
      }
    }
  };
  
  const submitProduct = async () => {
    submitting.value = true;
    try {
      if (showAddProductModal.value) {
        await storeService.addStoreProduct(currentProduct, imageFiles.value);
      } else {
        const productId = (currentProduct as StoreProductRes).id;
        await storeService.updateStoreProduct(productId, currentProduct, imageFiles.value);
      }
      await fetchProducts();
      closeProductModal();
    } catch (err) {
      console.error('提交商品失敗:', err);
      alert('提交商品失敗，請稍後重試');
    } finally {
      submitting.value = false;
    }
  };
  
  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      imageFiles.value = Array.from(target.files);
    }
  };
  
  const closeProductModal = () => {
    showAddProductModal.value = false;
    showEditProductModal.value = false;
    Object.assign(currentProduct, {
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      soldQuantity: 0,
      startDate: '',
      endDate: '',
      productType: '',
      status: '',
      imageUrls: []
    });
    imageFiles.value = [];
  };
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
  </style>