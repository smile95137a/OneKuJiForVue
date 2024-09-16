<template>
  <div class="product-control">
    <h1>抽獎系統管理</h1>
    <button @click="openAddProductModal">新增產品系列</button>

    <table>
      <thead>
        <tr>
          <th>圖片</th>
          <th>產品名稱</th>
          <th>類型</th>
          <th>一番賞類別</th>
          <th>金幣價格</th>
          <th>銀幣價格</th>
          <th>紅利價格</th>
          <th>庫存</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.productId">
          <td>
            <img v-if="product.imageUrls && product.imageUrls.length" :src="formatImageUrl(product.imageUrls[0])" alt="產品圖片" class="product-image">
            <span v-else>無圖片</span>
          </td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productType }}</td>
          <td>{{ getPrizeCategoryDescription(product.prizeCategory) }}</td>
          <td>{{ product.goldPrice }}</td>
          <td>{{ product.silverPrice }}</td>
          <td>{{ product.bonusPrice }}</td>
          <td>{{ product.stockQuantity }}</td>
          <td>{{ product.status }}</td>
          <td>
            <button @click="openEditProductModal(product)">編輯</button>
            <button @click="openProductDetailsModal(product)">詳情</button>
            <button @click="deleteProduct(product.productId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 產品系列模態窗 -->
    <div v-if="showProductModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingProduct ? '編輯產品系列' : '新增產品系列' }}</h3>
        <form @submit.prevent="handleProductSubmit">
          <div>
            <label for="productName">產品名稱</label>
            <input id="productName" v-model="productForm.productName" required>
          </div>
          <div>
            <label for="description">描述</label>
            <textarea id="description" v-model="productForm.description" required></textarea>
          </div>
          <div>
            <label for="productType">產品類型</label>
            <select id="productType" v-model="productForm.productType" required>
              <option v-for="type in Object.values(ProductType)" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div>
            <label for="prizeCategory">一番賞類別</label>
            <select id="prizeCategory" v-model="productForm.prizeCategory" required>
              <option v-for="category in Object.values(PrizeCategory)" :key="category" :value="category">
                {{ getPrizeCategoryDescription(category) }}
              </option>
            </select>
          </div>
          <div>
            <label for="goldPrice">金幣價格</label>
            <input id="goldPrice" type="number" v-model.number="productForm.goldPrice" required>
          </div>
          <div>
            <label for="silverPrice">銀幣價格</label>
            <input id="silverPrice" type="number" v-model.number="productForm.silverPrice" required>
          </div>
          <div>
            <label for="bonusPrice">紅利價格</label>
            <input id="bonusPrice" type="number" v-model.number="productForm.bonusPrice" required>
          </div>
          <div>
            <label for="stockQuantity">庫存數量</label>
            <input id="stockQuantity" type="number" v-model.number="productForm.stockQuantity" required>
          </div>
          <div>
            <label for="status">狀態</label>
            <select id="status" v-model="productForm.status" required>
              <option v-for="status in Object.values(ProductStatus)" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
          <div>
            <label for="startDate">開始日期</label>
            <input id="startDate" type="date" v-model="productForm.startDate">
          </div>
          <div>
            <label for="endDate">結束日期</label>
            <input id="endDate" type="date" v-model="productForm.endDate">
          </div>
          <div>
            <label for="productImage">產品圖片</label>
            <input id="productImage" type="file" @change="handleProductImageUpload" multiple accept="image/*">
          </div>
          <div v-if="productForm.imageUrls.length > 0" class="image-preview">
            <div v-for="(image, index) in productForm.imageUrls" :key="index">
              <img :src="formatImageUrl(image)" alt="產品圖片">
              <button type="button" @click="removeProductImage(index)" class="remove-image">移除</button>
            </div>
          </div>
          <button type="submit">{{ editingProduct ? '更新' : '新增' }}</button>
          <button type="button" @click="closeProductModal">取消</button>
        </form>
      </div>
    </div>

    <!-- 產品詳情模態窗 -->
    <div v-if="showProductDetailsModal" class="modal">
      <div class="modal-content">
        <h3>產品詳情: {{ currentProduct?.productName }}</h3>
        <button @click="openAddProductDetailModal">新增商品</button>
        <table v-if="currentProduct?.productDetails?.length">
          <thead>
            <tr>
              <th>商品名稱</th>
              <th>等級</th>
              <th>數量</th>
              <th>銀幣回收價格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in currentProduct.productDetails" :key="detail.productDetailId">
              <td>{{ detail.productName }}</td>
              <td>{{ detail.grade }}</td>
              <td>{{ detail.quantity }}</td>
              <td>{{ detail.silverRecyclePrice }}</td>
              <td>
                <button @click="openEditProductDetailModal(detail)">編輯</button>
                <button @click="deleteProductDetail(detail.productDetailId)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>暫無商品</p>
        <button @click="closeProductDetailsModal">關閉</button>
      </div>
    </div>

    <!-- 商品詳情模態窗 -->
    <div v-if="showProductDetailModal" class="modal">
      <div class="modal-content">
        <h3>{{ editingProductDetail ? '編輯商品' : '新增商品' }}</h3>
        <form @submit.prevent="handleProductDetailSubmit">
          <div>
            <label for="detailProductName">商品名稱</label>
            <input id="detailProductName" v-model="productDetailForm.productName" required>
          </div>
          <div>
            <label for="detailDescription">描述</label>
            <textarea id="detailDescription" v-model="productDetailForm.description" required></textarea>
          </div>
          <div>
            <label for="detailGrade">等級</label>
            <input id="detailGrade" v-model="productDetailForm.grade" required>
          </div>
          <div>
            <label for="detailQuantity">數量</label>
            <input id="detailQuantity" type="number" v-model.number="productDetailForm.quantity" required>
          </div>
          <div>
            <label for="detailSilverRecyclePrice">銀幣回收價格</label>
            <input id="detailSilverRecyclePrice" type="number" v-model.number="productDetailForm.silverRecyclePrice" required>
          </div>
          <div>
            <label for="detailImage">商品圖片</label>
            <input id="detailImage" type="file" @change="handleProductDetailImageUpload" multiple accept="image/*">
          </div>
          <div v-if="productDetailForm.imageUrls.length > 0" class="image-preview">
            <div v-for="(image, index) in productDetailForm.imageUrls" :key="index">
              <img :src="formatImageUrl(image)" alt="商品圖片">
              <button type="button" @click="removeProductDetailImage(index)" class="remove-image">移除</button>
            </div>
          </div>
          <button type="submit">{{ editingProductDetail ? '更新' : '新增' }}</button>
          <button type="button" @click="closeProductDetailModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { productService } from '@/services/backend/productservice';
import { ProductReq, ProductRes, ProductDetailReq, ProductDetailRes, ProductStatus, ProductType, PrizeCategory } from '@/interfaces/product';

// 數據
const products = ref<ProductRes[]>([]);
const currentProduct = ref<ProductRes | null>(null);
const editingProduct = ref<ProductRes | null>(null);
const editingProductDetail = ref<ProductDetailRes | null>(null);

// 模態窗控制
const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const showProductDetailModal = ref(false);

// 表單數據
const productForm = reactive<ProductReq>({
  productName: '',
  description: '',
  goldPrice: 0,
  silverPrice: 0,
  bonusPrice: 0,
  stockQuantity: 0,
  imageUrls: [],
  productType: ProductType.PRIZE,
  prizeCategory: PrizeCategory.NONE,
  status: ProductStatus.AVAILABLE,
  specification: '',
  startDate: '',
  endDate: '',
});

const productDetailForm = reactive<ProductDetailReq>({
  productId: 0,
  productName: '',
  description: '',
  grade: '',
  quantity: 0,
  silverRecyclePrice: 0,
  imageUrls: [],
  specification: '',
});

// 生命週期鉤子
onMounted(async () => {
  await fetchProducts();
});

// 方法
const fetchProducts = async () => {
  try {
    const response = await productService.getAllProducts();
    if (response.success) {
      products.value = response.data;
    } else {
      console.error('Failed to fetch products:', response.message);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const openAddProductModal = () => {
  editingProduct.value = null;
  resetProductForm();
  showProductModal.value = true;
};

const openEditProductModal = (product: ProductRes) => {
  editingProduct.value = product;
  Object.assign(productForm, product);
  showProductModal.value = true;
};

const closeProductModal = () => {
  showProductModal.value = false;
  resetProductForm();
};

const openProductDetailsModal = async (product: ProductRes) => {
  try {
    const response = await productService.getProductById(product.productId);
    if (response.success) {
      currentProduct.value = response.data;
      showProductDetailsModal.value = true;
    } else {
      console.error('Failed to fetch product details:', response.message);
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

const closeProductDetailsModal = () => {
  showProductDetailsModal.value = false;
  currentProduct.value = null;
};

const openAddProductDetailModal = () => {
  editingProductDetail.value = null;
  resetProductDetailForm();
  showProductDetailModal.value = true;
};

const openEditProductDetailModal = (detail: ProductDetailRes) => {
  editingProductDetail.value = detail;
  Object.assign(productDetailForm, detail);
  showProductDetailModal.value = true;
};

const closeProductDetailModal = () => {
  showProductDetailModal.value = false;
  resetProductDetailForm();
};

const handleProductSubmit = async () => {
  const formData = new FormData();
  formData.append('productReq', JSON.stringify(productForm));
  productForm.imageUrls.forEach((url, index) => {
    formData.append(`images[${index}]`, url);
  });

  try {
    let response;
    if (editingProduct.value) {
      response = await productService.updateProduct(editingProduct.value.productId, formData);
    } else {
      response = await productService.createProduct(formData);
    }
    if (response.success) {
      await fetchProducts();
      closeProductModal();
    } else {
      console.error('Failed to submit product:', response.message);
    }
  } catch (error) {
    console.error('Error submitting product:', error);
  }
};

const handleProductDetailSubmit = async () => {
  const formData = new FormData();
  formData.append('productDetailReq', JSON.stringify(productDetailForm));
  productDetailForm.imageUrls.forEach((url, index) => {
    formData.append(`images[${index}]`, url);
  });

  try {
    let response;
    if (editingProductDetail.value) {
      response = await productService.updateProductDetail(editingProductDetail.value.productDetailId, formData);
    } else {
      response = await productService.createProductDetail(formData);
    }
    if (response.success) {
      if (currentProduct.value) {
        await openProductDetailsModal(currentProduct.value);
      }
      closeProductDetailModal();
    } else {
      console.error('Failed to submit product detail:', response.message);
    }
  } catch (error) {
    console.error('Error submitting product detail:', error);
  }
};

const deleteProduct = async (productId: number) => {
  if (confirm('確定要刪除這個產品系列嗎？')) {
    try {
      const response = await productService.deleteProduct(productId);
      if (response.success) {
        await fetchProducts();
      } else {
        console.error('Failed to delete product:', response.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

const deleteProductDetail = async (productDetailId: number) => {
  if (confirm('確定要刪除這個商品嗎？')) {
    try {
      const response = await productService.deleteProductDetail(productDetailId);
      if (response.success) {
        if (currentProduct.value) {
          await openProductDetailsModal(currentProduct.value);
        }
      } else {
        console.error('Failed to delete product detail:', response.message);
      }
    } catch (error) {
      console.error('Error deleting product detail:', error);
    }
  }
};

const handleProductImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    productForm.imageUrls = files.map(file => URL.createObjectURL(file));
  }
};

const handleProductDetailImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    productDetailForm.imageUrls = files.map(file => URL.createObjectURL(file));
  }
};

const removeProductImage = (index: number) => {
  productForm.imageUrls.splice(index, 1);
};

const removeProductDetailImage = (index: number) => {
  productDetailForm.imageUrls.splice(index, 1);
};

const resetProductForm = () => {
  Object.assign(productForm, {
    productName: '',
    description: '',
    goldPrice: 0,
    silverPrice: 0,
    bonusPrice: 0,
    stockQuantity: 0,
    imageUrls: [],
    productType: ProductType.PRIZE,
    prizeCategory: PrizeCategory.NONE,
    status: ProductStatus.AVAILABLE,
    specification: '',
    startDate: '',
    endDate: '',
  });
};

const resetProductDetailForm = () => {
  Object.assign(productDetailForm, {
    productId: currentProduct.value?.productId || 0,
    productName: '',
    description: '',
    grade: '',
    quantity: 0,
    silverRecyclePrice: 0,
    imageUrls: [],
    specification: '',
  });
};

const formatImageUrl = (url: string) => {
  return productService.getImageUrl(url);
};

const getPrizeCategoryDescription = (category: PrizeCategory | undefined) => {
  switch (category) {
    case PrizeCategory.FIGURE:
      return '一番賞';
    case PrizeCategory.C3:
      return '家電一番賞';
    case PrizeCategory.BONUS:
      return '紅利一番賞';
    case PrizeCategory.NONE:
    default:
      return '無';
  }
};
</script>

<style scoped>
.product-control {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1, h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 30px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

input[type="file"] {
  border: none;
  padding: 10px 0;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.remove-image {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 20px;
  }

  table, th, td {
    font-size: 14px;
  }

  button {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>