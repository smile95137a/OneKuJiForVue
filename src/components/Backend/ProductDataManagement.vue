<template>
  <div class="product-data-management">
    <h2>商品資訊</h2>
    <div class="selection-bar">
      <button @click="fetchData(2)">扭蛋</button>
      <button @click="fetchData(1)">一番賞</button>
      <button @click="fetchData(3)">盲盒</button>
      <button @click="showAddProductModal" class="add-product-btn">新增商品</button>
    </div>
    <div v-if="products.length > 0" class="product-table">
      <table>
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>價格</th>
            <th>庫存</th>
            <th>上架日期</th>
            <th>狀態</th>
            <th>圖片</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.productId">
            <td>{{ product.productName }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ formatDate(product.startDate) }}</td>
            <td>
              <select v-model="product.status" @change="updateStatus(product.productId, product.status)">
                <option value="AVAILABLE">可以購買</option>
                <option value="UNAVAILABLE">不可購買</option>
                <option value="UNRELEASED">尚未上架</option>
                <option value="SOLD_OUT">售罄</option>
              </select>
            </td>
            <td><img :src="product.imageUrl" alt="Product Image" class="product-image" /></td>
            <td>
              <button @click="editProduct(product)">編輯</button>
              <button @click="deleteProduct(product.productId)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-data">
      <p>查無資料</p>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="isProductModalVisible" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? '編輯商品' : '新增商品' }}</h3>
        <form @submit.prevent="submitProduct">
          <input v-model="currentProduct.productName" placeholder="商品名稱" required>
          <input v-model="currentProduct.description" placeholder="描述" required>
          <input v-model.number="currentProduct.price" type="number" placeholder="價格" required>
          <input v-model.number="currentProduct.stockQuantity" type="number" placeholder="庫存數量" required>
          <input v-model="currentProduct.imageUrl" placeholder="圖片URL" required>
          <input v-model="currentProduct.startDate" type="date" placeholder="開始日期" required>
          <input v-model="currentProduct.endDate" type="date" placeholder="結束日期" required>
          <input v-model="currentProduct.rarity" placeholder="稀有度" required>
          <select v-model="currentProduct.prizeCategory" required>
            <option value="FIGURE">FIGURE</option>
            <option value="AVAILABLE">AVAILABLE</option>
          </select>
          <select v-model="currentProduct.status" required>
            <option value="AVAILABLE">可以購買</option>
            <option value="UNAVAILABLE">不可購買</option>
            <option value="UNRELEASED">尚未上架</option>
            <option value="SOLD_OUT">售罄</option>
          </select>
          <button type="submit">{{ isEditing ? '更新' : '提交' }}</button>
          <button type="button" @click="hideProductModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { addProduct, deleteProduct, getProducts, Product, updateProduct, updateProductStatus } from '@/services/api';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ProductDataManagement',
  setup() {
    const products = ref<Product[]>([]);
    const isProductModalVisible = ref(false);
    const isEditing = ref(false);
    const currentProduct = ref<Product>({
      productId: 0,
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      soldQuantity: 0,
      imageUrl: '',
      rarity: '',
      createDate: '',
      startDate: '',
      endDate: '',
      createdUser: '',
      updatedUser: '',
      updatedAt: '',
      productType: '',
      prizeCategory: '',
      status: 'AVAILABLE'
    });
    const currentProductType = ref(1);

    const fetchData = async (productType: number) => {
      try {
        currentProductType.value = productType;
        products.value = await getProducts(productType);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        products.value = [];
      }
    };

    const updateStatus = async (productId: number, status: string) => {
      try {
        await updateProductStatus(productId, status);
        console.log('Product status updated successfully');
      } catch (error) {
        console.error('Failed to update product status:', error);
      }
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    const showAddProductModal = () => {
      isEditing.value = false;
      currentProduct.value = {
        productId: 0,
        productName: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        soldQuantity: 0,
        imageUrl: '',
        rarity: '',
        createDate: new Date().toISOString(),
        startDate: '',
        endDate: '',
        createdUser: '',
        updatedUser: '',
        updatedAt: new Date().toISOString(),
        productType: currentProductType.value.toString(),
        prizeCategory: '',
        status: 'AVAILABLE'
      };
      isProductModalVisible.value = true;
    };

    const editProduct = (product: Product) => {
      isEditing.value = true;
      currentProduct.value = { ...product };
      isProductModalVisible.value = true;
    };

    const hideProductModal = () => {
      isProductModalVisible.value = false;
    };

    const submitProduct = async () => {
      try {
        if (isEditing.value) {
          await updateProduct(currentProduct.value);
        } else {
          await addProduct(currentProduct.value);
        }
        hideProductModal();
        await fetchData(currentProductType.value);
      } catch (error) {
        console.error('Failed to submit product:', error);
      }
    };

    const deleteProduct = async (productId: number) => {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await deleteProduct(productId);
          await fetchData(currentProductType.value);
        } catch (error) {
          console.error('Failed to delete product:', error);
        }
      }
    };

    onMounted(() => {
      fetchData(1);
    });

    return {
      products,
      isProductModalVisible,
      isEditing,
      currentProduct,
      fetchData,
      updateStatus,
      formatDate,
      showAddProductModal,
      editProduct,
      hideProductModal,
      submitProduct,
      deleteProduct
    };
  },
});
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
.add-product-btn {
  background-color: #007bff;
}
.add-product-btn:hover {
  background-color: #0056b3;
}
.product-table {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
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
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}
.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-content input, .modal-content select {
  padding: 5px;
}
.modal-content button {
  padding: 10px;
  cursor: pointer;
}
</style>