<template>
  <div class="store-management">
    <h2 class="title">商店管理</h2>

    <button @click="showAddForm = true" class="btn btn-primary">新增商品</button>

    <div v-if="showAddForm" class="modal">
      <div class="modal-content">
        <h3>{{ editingProduct ? '編輯商品' : '新增商品' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="productName">商品名稱</label>
            <input id="productName" v-model="productForm.productName" required>
          </div>
          <div class="form-group">
            <label for="description">商品描述</label>
            <textarea id="description" v-model="productForm.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">價格</label>
            <input id="price" type="number" v-model.number="productForm.price" min="0" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="stockQuantity">數量</label>
            <input id="stockQuantity" type="number" v-model.number="productForm.stockQuantity" min="0" step="1" required>
          </div>
          <div class="form-group">
            <label for="width">寬度</label>
            <input id="width" type="number" v-model.number="productForm.width" min="0" step="0.1">
          </div>
          <div class="form-group">
            <label for="height">高度</label>
            <input id="height" type="number" v-model.number="productForm.height" min="0" step="0.1">
          </div>
          <div class="form-group">
            <label for="length">深度</label>
            <input id="length" type="number" v-model.number="productForm.length" min="0" step="0.1">
          </div>
          <div class="form-group">
            <label for="specification">規格</label>
            <input id="specification" v-model="productForm.specification">
          </div>
          <div class="form-group">
            <label for="shippingMethod">配送方式</label>
            <input id="shippingMethod" v-model="productForm.shippingMethod">
          </div>
          <div class="form-group">
            <label for="specialPrice">特價</label>
            <input id="specialPrice" type="number" v-model.number="productForm.specialPrice" min="0" step="0.01">
          </div>
          
          <!-- 新的狀態切換 -->
          <div class="form-group">
            <label for="status">狀態</label>
            <div class="toggle-switch">
              <input type="checkbox" id="status" v-model="productForm.status">
              <label for="status">{{ productForm.status ? '上架' : '未上架' }}</label>
            </div>
          </div>

          <div class="form-group">
            <label for="shippingPrice">運費</label>
            <input id="shippingPrice" type="number" v-model.number="productForm.shippingPrice" min="0" step="0.01">
          </div>
          <div class="form-group">
            <label for="size">尺寸</label>
            <input id="size" type="number" v-model.number="productForm.size" min="0" step="0.1">
          </div>
          <div class="form-group">
            <label for="category">類別</label>
            <select id="category" v-model="productForm.categoryId" required>
              <option value="">請選擇類別</option>
              <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                {{ category.categoryName }}
              </option>
            </select>
            <button type="button" @click="showAddCategoryForm = true" class="btn btn-small">新增類別</button>
          </div>

          <!-- 新增類別的表單 -->
          <div v-if="showAddCategoryForm" class="add-category-form">
            <input v-model="newCategoryName" placeholder="輸入新類別名稱" />
            <button type="button" @click="addNewCategory" class="btn btn-small">確認新增</button>
            <button type="button" @click="showAddCategoryForm = false" class="btn btn-small">取消</button>
          </div>

          <div class="form-group">
            <label for="images">商品圖片</label>
            <input id="images" type="file" @change="handleFileUpload" multiple accept="image/*">
          </div>
          <div v-if="productForm.imageUrl.length > 0" class="image-preview">
            <div v-for="(image, index) in productForm.imageUrl" :key="index" class="image-item">
              <img v-if="typeof image === 'string'" :src="formatImageUrl(image)" alt="商品圖片" class="preview-image">
              <span v-else>{{ (image as File).name }}</span>
              <button type="button" @click="removeImage(index)" class="remove-image">移除</button>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelEdit" class="btn btn-secondary">取消</button>
            <button type="submit" class="btn btn-primary">{{ editingProduct ? '更新' : '新增' }}</button>
          </div>
        </form>
      </div>
    </div>

    <table v-if="paginatedProducts.length" class="product-table">
      <thead>
        <tr>
          <th>圖片</th>
          <th>名稱</th>
          <th>描述</th>
          <th>價格</th>
          <th>數量</th>
          <th>尺寸 (寬x高x深)</th>
          <th>類別</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.storeProductId">
          <td>
            <img v-if="product.imageUrl && product.imageUrl.length" :src="formatImage(product.imageUrl[0])" alt="商品圖片" class="product-image">
            <span v-else>無圖片</span>
          </td>
          <td>{{ product.productName }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stockQuantity }}</td>
          <td>{{ formatDimensions(product) }}</td>
          <td>{{ getCategoryName(product.categoryId) }}</td>
          <td>
            <button @click="editProduct(product)" class="btn btn-small btn-edit">編輯</button>
            <button @click="deleteProduct(product.storeProductId)" class="btn btn-small btn-danger">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="no-data">暫無商品</p>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-small">上一頁</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-small">下一頁</button>
    </div>
  </div>
</template>

<script lang="ts">
import { StoreCategory, StoreProductReq, StoreProductRes } from '@/interfaces/store';
import { storeServices } from '@/services/backend/storeservice';
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';

const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL3;

export default defineComponent({
  name: 'StoreManagement',
  setup() {
    const products = ref<StoreProductRes[]>([]);
    const categories = ref<StoreCategory[]>([]);
    const showAddForm = ref(false);
    const showAddCategoryForm = ref(false);
    const newCategoryName = ref('');
    const editingProduct = ref<StoreProductRes | null>(null);
      const cancelEdit = () => {resetForm();
  };

    const productForm = reactive<StoreProductReq>({
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: [],
      categoryId: 0,
      width: 0,
      height: 0,
      length: 0,
      specification: '',
      shippingMethod: '',
      specialPrice: 0,
      status: 'UNAVAILABLE',
      shippingPrice: 0,
      size: 0,
    });

    const currentPage = ref(1);
    const itemsPerPage = 15;

    const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return products.value.slice(start, end);
    });

    const fetchProducts = async () => {
      try {
        const response = await storeServices.getAllStoreProduct();
        if (response.success && Array.isArray(response.data)) {
          products.value = response.data;
        } else {
          products.value = [];
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        products.value = [];
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await storeServices.getAllCategories();
        if (response.success && Array.isArray(response.data)) {
          categories.value = response.data;
        } else {
          categories.value = [];
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        categories.value = [];
      }
    };

    const handleSubmit = async () => {
  try {
    const formData = new FormData();

    // 複製 productForm 並處理圖片 URL
    const productData = { ...productForm };
    productData.imageUrl = productForm.imageUrl.filter(item => typeof item === 'string');

    // 將 boolean 的 status 轉換為相應的字串
    if (typeof productForm.status === 'boolean') {
      productData.status = productForm.status ? 'AVAILABLE' : 'UNAVAILABLE';
    } else {
      productData.status = productForm.status;  // 確保 status 是字串
    }

    // 將 productData 轉換為 JSON 並加入 FormData
    formData.append('storeProductReq', JSON.stringify(productData));

    // 處理圖片文件並加入 FormData
    productForm.imageUrl.forEach((item) => {
      if (item instanceof File) {
        formData.append('images', item);
      }
    });

    // 根據是否是編輯模式選擇 API 方法
    let response;
    if (editingProduct.value) {
      response = await storeServices.updateStoreProduct(editingProduct.value.storeProductId, formData);
    } else {
      response = await storeServices.addStoreProduct(formData);
    }

    // 檢查 API 回應並作出相應提示
    if (response.success) {
      alert(editingProduct.value ? '商品更新成功' : '商品新增成功');
      await fetchProducts();
      resetForm();
    } else {
      throw new Error(response.message || '操作失敗');
    }
  } catch (error) {
    console.error('Error submitting product:', error);
    alert(`提交商品時發生錯誤: ${(error as Error).message}`);
  }
};

    const addNewCategory = async () => {
      if (newCategoryName.value.trim() === '') {
        alert('類別名稱不能為空');
        return;
      }

      try {
        const response = await storeServices.createCategory({ categoryName: newCategoryName.value });
        if (response.success) {
          alert('新類別添加成功');
          await fetchCategories();
          showAddCategoryForm.value = false;
          newCategoryName.value = '';
        } else {
          throw new Error(response.message || '添加類別失敗');
        }
      } catch (error) {
        console.error('Error adding new category:', error);
        alert(`添加新類別時發生錯誤: ${(error as Error).message}`);
      }
    };

    const resetForm = () => {
      Object.assign(productForm, {
        productName: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        imageUrl: [],
        categoryId: 0,
        width: 0,
        height: 0,
        length: 0,
        specification: '',
        shippingMethod: '',
        specialPrice: 0,
        status: false,
        shippingPrice: 0,
        size: 0,
      });
      editingProduct.value = null;
      showAddForm.value = false;
    };

    const editProduct = (product: StoreProductRes) => {
      editingProduct.value = product;
      Object.assign(productForm, {
        ...product,
        imageUrl: [...(product.imageUrl || [])],
      });
      showAddForm.value = true;
    };

    const deleteProduct = async (id: number) => {
      if (confirm('確定要刪除這個商品嗎？')) {
        try {
          const response = await storeServices.deleteStoreProduct(id);
          if (response.success) {
            alert('商品已成功刪除');
            await fetchProducts();
          } else {
            throw new Error(response.message || '刪除失敗');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          alert(`刪除商品時發生錯誤: ${(error as Error).message}`);
        }
      }
    };

    const handleFileUpload = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const newImages = Array.from(files);
        productForm.imageUrl = [
          ...productForm.imageUrl.filter(item => typeof item === 'string'),
          ...newImages
        ];
      }
    };

    const removeImage = (index: number) => {
      productForm.imageUrl.splice(index, 1);
    };

    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const getCategoryName = (categoryId: number) => {
      const numericCategoryId = Number(categoryId);
      const category = categories.value.find(c => Number(c.categoryId) === numericCategoryId);
      return category ? category.categoryName : `Category ${categoryId}`;
    };

    const formatImageUrl = (url: string) => {
      return `${API_IMAGE_URL}/img${url}`;
    };

    const formatImage = (url: string) => {
      return `${API_IMAGE_URL}/img${url}`;
    };

    const formatDimensions = (product: StoreProductRes) => {
      return `${product.width || 0} x ${product.height || 0} x ${product.length || 0}`;
    };

    onMounted(async () => {
      await fetchProducts();
      await fetchCategories();
    });

    return {
      products,
      categories,
      showAddForm,
      editingProduct,
      productForm,
      handleSubmit,
      editProduct,
      deleteProduct,
      resetForm,
      handleFileUpload,
      removeImage,
      paginatedProducts,
      currentPage,
      totalPages,
      changePage,
      getCategoryName,
      formatImageUrl,
      formatImage,
      formatDimensions,
      showAddCategoryForm,
      newCategoryName,
      addNewCategory,
      cancelEdit
    };
  },
});
</script>

<style scoped>
.store-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  color: #333;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-edit {
  background-color: #ffc107;
  color: #212529;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.product-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: #6c757d;
  margin-top: 20px;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}

.pagination span {
  margin: 0 10px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  position: relative;
  width: 100px;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 2px 5px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 0 4px 0 4px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #2196F3;
}

.toggle-switch input:checked + label:before {
  transform: translateX(26px);
}
</style>
