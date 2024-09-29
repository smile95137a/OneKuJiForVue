<template>
  <div class="store-management">
    <h2 class="title">商店管理</h2>

    <button @click="showAddForm = true" class="btn btn-primary">新增商品</button>

    <div v-if="showAddForm" class="modal">
      <div class="modal-content">
        <h3>{{ editingProduct ? '編輯商品' : '新增商品' }}</h3>
        <form @submit.prevent="handleSubmit" class="product-form">
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
            <label for="specialPrice">特價</label>
            <input id="specialPrice" type="number" v-model.number="productForm.specialPrice" min="0" step="0.01">
          </div>
          <div class="form-group">
            <label for="details">商品詳情</label>
            <textarea id="details" v-model="productForm.details" required></textarea>
          </div>
          <div class="form-group">
            <label for="status">狀態</label>
            <select v-model="productForm.status">
              <option :value="StoreProductStatus.AVAILABLE">上架</option>
              <option :value="StoreProductStatus.UNAVAILABLE">未上架</option>
            </select>
          </div>
          <div class="form-group">
            <label for="category">類別</label>
            <select id="category" v-model="productForm.categoryId" required>
              <option value="">請選擇類別</option>
              <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId.toString()">
                {{ category.categoryName }}
              </option>
            </select>
            <button type="button" @click="showAddCategoryForm = true" class="btn btn-small">新增類別</button>
          </div>
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
import { StoreProductStatus } from '@/interfaces/store';
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
    const cancelEdit = () => { resetForm(); };

    const productForm = reactive<StoreProductReq & { newImages: File[], originalImages: string[] }>({
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: [],
      newImages: [],
      originalImages: [],
      categoryId: '',
      width: 0,
      height: 0,
      length: 0,
      specification: '',
      shippingMethod: 'Express',
      specialPrice: 0,
      status: StoreProductStatus.UNAVAILABLE,
      shippingPrice: 0,
      size: 0,
      details: '',
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

    const validateForm = (): boolean => {
      if (!productForm.productName || !productForm.description || !productForm.price || !productForm.stockQuantity || !productForm.categoryId || !productForm.details) {
        alert('請填寫所有必要的字段');
        return false;
      }
      return true;
    };

    const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const formData = new FormData();

    const productReq: StoreProductReq = {
      productName: productForm.productName,
      description: productForm.description,
      price: Number(productForm.price),
      stockQuantity: Number(productForm.stockQuantity),
      categoryId: productForm.categoryId,
      width: Number(productForm.width),
      height: Number(productForm.height),
      length: Number(productForm.length),
      specification: productForm.specification,
      shippingMethod: 'Express',
      specialPrice: Number(productForm.specialPrice),
      status: productForm.status,
      imageUrl: productForm.originalImages,
      details: productForm.details,
      shippingPrice: 0,
      size: 0,
    };

    // 直接使用 'productReq' 作為 key
    formData.append('productReq', JSON.stringify(productReq));

    // 處理圖片上傳
    if (productForm.newImages && productForm.newImages.length > 0) {
      const validFiles = productForm.newImages.filter(file => file && file.size > 0);
      validFiles.forEach((file, index) => {
        formData.append('images', file, file.name);
      });
    }

    let response;
    if (editingProduct.value) {
      response = await storeServices.updateStoreProduct(editingProduct.value.storeProductId, formData);
    } else {
      response = await storeServices.addStoreProduct(formData);
    }

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
        newImages: [],
        originalImages: [],
        categoryId: '',
        width: 0,
        height: 0,
        length: 0,
        specification: '',
        shippingMethod: 'Express',
        specialPrice: 0,
        status: StoreProductStatus.UNAVAILABLE,
        shippingPrice: 0,
        size: 0,
        details: '',
      });
      editingProduct.value = null;
      showAddForm.value = false;
    };

    const editProduct = (product: StoreProductRes) => {
      editingProduct.value = product;
      Object.assign(productForm, {
        ...product,
        imageUrl: [...(product.imageUrl || [])],
        newImages: [],
        originalImages: [...(product.imageUrl || [])],
        categoryId: product.categoryId.toString(),
        details: product.details,
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
        productForm.newImages = newImages;
        productForm.imageUrl = [
          ...productForm.originalImages,
          ...newImages
        ];
      }
    };

    const removeImage = (index: number) => {
      const removedItem = productForm.imageUrl[index];
      productForm.imageUrl.splice(index, 1);
      if (removedItem instanceof File) {
        productForm.newImages = productForm.newImages.filter(file => file !== removedItem);
      } else {
        productForm.originalImages = productForm.originalImages.filter(url => url !== removedItem);
      }
    };

    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const getCategoryName = (categoryId: string) => {
      const category = categories.value.find(c => c.categoryId.toString() === categoryId);
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
      cancelEdit,
      StoreProductStatus
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
  text-align: center;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.1s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
}

.btn-secondary:hover {
  background-color: #da190b;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #da190b;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-edit:hover {
  background-color: #0b7dda;
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
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4CAF50;
  outline: none;
}

.form-actions {
  grid-column: 1 / -1;
  text-align: right;
  margin-top: 20px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.product-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #f5f5f5;
}

.no-data {
  text-align: center;
  color: #666;
  margin-top: 20px;
  font-style: italic;
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
  font-weight: bold;
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
  background: rgba(244, 67, 54, 0.8);
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

.toggle-switch input:checked+label {
  background-color: #4CAF50;
}

.toggle-switch input:checked+label:before {
  transform: translateX(26px);
}

.add-category-form {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.add-category-form input {
  flex-grow: 1;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
