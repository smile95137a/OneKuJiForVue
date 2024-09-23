<template>
  <div class="product-management">
    <h1>產品系列管理</h1>
    <button @click="openAddProductModal">新增產品系列</button>

    <table v-if="products.length">
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
            <img v-if="product.imageUrls && product.imageUrls.length" :src="formatImageUrl(product.imageUrls[0])"
              alt="產品圖片" class="product-image">
            <span v-else>無圖片</span>
          </td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productType }}</td>
          <td>{{ getPrizeCategoryDescription(product.prizeCategory) }}</td>
          <td>{{ product.prizeCategory !== PrizeCategory.BONUS ? product.price : '-' }}</td>
          <td>{{ product.prizeCategory !== PrizeCategory.BONUS ? product.sliverPrice : '-' }}</td>
          <td>{{ product.prizeCategory === PrizeCategory.BONUS ? product.bonusPrice : '-' }}</td>
          <td>{{ product.stockQuantity }}</td>
          <td>{{ product.status }}</td>
          <td>
            <button @click="openEditProductModal(product)">編輯</button>
            <button @click="deleteProduct(product.productId)">刪除</button>
            <button @click="openProductDetailsModal(product.productId)">查看商品</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>暫無產品系列</p>

    <!-- 新增/編輯產品系列模態窗 -->
    <div v-if="showProductModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingProduct ? '編輯產品系列' : '新增產品系列' }}</h2>
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
              <option v-for="(label, value) in productTypeOptions" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div v-if="productForm.productType === ProductType.PRIZE">
            <label for="prizeCategory">一番賞類別</label>
            <select id="prizeCategory" v-model="productForm.prizeCategory" required>
              <option v-for="category in PrizeCategory" :key="category" :value="category">
                {{ getPrizeCategoryDescription(category) }}
              </option>
            </select>
          </div>
          <div v-if="productForm.prizeCategory !== PrizeCategory.BONUS">
            <label for="price">金幣價格</label>
            <input id="price" type="number" v-model.number="productForm.price" required>
          </div>
          <div v-if="productForm.prizeCategory !== PrizeCategory.BONUS">
            <label for="sliverPrice">銀幣價格</label>
            <input id="sliverPrice" type="number" v-model.number="productForm.sliverPrice" step="0.01" required>
          </div>
          <div v-if="productForm.prizeCategory === PrizeCategory.BONUS">
            <label for="bonusPrice">紅利價格</label>
            <input id="bonusPrice" type="number" v-model.number="productForm.bonusPrice" step="0.01" required>
          </div>
          <div>
            <label for="status">狀態</label>
            <select id="status" v-model="productForm.status" required>
              <option v-for="(label, value) in productStatusOptions" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div>
            <label for="specification">規格</label>
            <input id="specification" v-model="productForm.specification">
          </div>
          <div>
            <label for="productImage">產品圖片</label>
            <input id="productImage" type="file" @change="handleImageUpload" multiple accept="image/*">
          </div>
          <div v-if="productForm.imageUrls.length > 0">
            <div v-for="(image, index) in productForm.imageUrls" :key="index">
              <img :src="formatImageUrl(image)" alt="產品圖片" style="width: 100px; height: 100px;">
              <button type="button" @click="removeImage(index)">移除</button>
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
        <h2>產品詳情</h2>
        <p>籤數：{{ totalQuantity }}</p>
        <button @click="openAddDetailModal">新增商品</button>
        <table v-if="productDetails.length">
          <thead>
            <tr>
              <th>商品名稱</th>
              <th>描述</th>
              <th>規格</th>
              <th>數量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in productDetails" :key="detail.productDetailId">
              <td>{{ detail.productName }}</td>
              <td>{{ detail.description }}</td>
              <td>{{ detail.specification }}</td>
              <td>{{ detail.quantity }}</td>
              <td>
                <button @click="openEditDetailModal(detail)">編輯</button>
                <button @click="deleteProductDetail(detail.productDetailId)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>暫無商品</p>
        <button @click="closeProductDetailsModal">關閉</button>
      </div>
    </div>

    <!-- 新增/編輯商品模態窗 -->
    <div v-if="showDetailModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingDetail ? '編輯商品' : '新增商品' }}</h2>
        <form @submit.prevent="handleDetailSubmit">
          <div>
            <label for="detailProductName">商品名稱</label>
            <input id="detailProductName" v-model="detailForm.productName" required>
          </div>
          <div>
            <label for="detailDescription">描述</label>
            <textarea id="detailDescription" v-model="detailForm.description" required></textarea>
          </div>
          <div>
            <label for="detailNote">備註</label>
            <textarea id="detailNote" v-model="detailForm.note"></textarea>
          </div>
          <div>
            <label for="detailQuantity">數量</label>
            <input id="detailQuantity" type="number" v-model.number="detailForm.quantity" required>
          </div>
          <div>
            <label for="detailGrade">等級</label>
            <select id="detailGrade" v-model="detailForm.grade">
              <option
                v-for="grade in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'SP']"
                :key="grade" :value="grade">
                {{ grade }}
              </option>
            </select>
          </div>
          <div>
            <label for="detailLength">長度</label>
            <input id="detailLength" v-model.number="detailForm.length" type="number" required>
          </div>
          <div>
            <label for="detailWidth">寬度</label>
            <input id="detailWidth" v-model.number="detailForm.width" type="number" required>
          </div>
          <div>
            <label for="detailHeight">高度</label>
            <input id="detailHeight" v-model.number="detailForm.height" type="number" required>
          </div>
          <div>
            <label for="detailImage">商品圖片</label>
            <input id="detailImage" type="file" @change="handleDetailImageUpload" multiple accept="image/*">
          </div>
          <div v-if="detailForm.imageUrls.length > 0">
            <div v-for="(image, index) in detailForm.imageUrls" :key="index">
              <img :src="formatImageUrl(image)" alt="商品圖片" style="width: 100px; height: 100px;">
              <button type="button" @click="removeDetailImage(index)">移除</button>
            </div>
          </div>
          <button type="submit">{{ editingDetail ? '更新' : '新增' }}</button>
          <button type="button" @click="closeDetailModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DetailReq, DetailRes, PrizeCategory, ProductReq, ProductRes, ProductStatus, ProductType } from '@/interfaces/product';
import { productservice } from '@/services/backend/productservice';
import { computed, onMounted, reactive, ref, watch } from 'vue';

// 數據
const products = ref<ProductRes[]>([]);
const productDetails = ref<DetailRes[]>([]);
const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const showDetailModal = ref(false);
const editingProduct = ref<ProductRes | null>(null);
const editingDetail = ref<DetailRes | null>(null);
const currentProductId = ref<number | null>(null);

// 計算屬性
const totalQuantity = computed(() => {
  return productDetails.value.reduce((sum, detail) => sum + detail.quantity, 0);
});

// 表單數據
const productForm = reactive<ProductReq>({
  productName: '',
  description: '',
  price: 0,
  sliverPrice: 0,
  bonusPrice: 0,
  stockQuantity: 0,
  imageUrls: [],
  productType: ProductType.PRIZE,
  prizeCategory: PrizeCategory.NONE,
  status: ProductStatus.AVAILABLE,
  specification: '',
});
const productTypeOptions: Record<ProductType, string> = {
  [ProductType.PRIZE]: '一番賞',
  [ProductType.GACHA]: '扭蛋',
  [ProductType.BLIND_BOX]: '盲盒',
  [ProductType.CUSTMER_PRIZE]: '自製一番賞'
};
const productStatusOptions: Record<ProductStatus, string> = {
  [ProductStatus.AVAILABLE]: '上架',
  [ProductStatus.UNAVAILABLE]: '下架',
  [ProductStatus.NOT_AVAILABLE_YET]: '未上架',
  [ProductStatus.SOLD_OUT]: '上架已售完'
};

const detailForm = reactive<DetailReq>({
  productDetailId: undefined,
  productId: 0,
  description: '',
  note: '',
  quantity: 0,
  stockQuantity: 0,
  productName: '',
  grade: 'A',  // 預設等級
  price: 0,
  sliverPrice: 0,
  imageUrls: [],
  length: 0,
  width: 0,
  height: 0,
  specification: ''
});

// 生命週期鉤子
onMounted(async () => {
  console.log('組件已掛載，開始獲取產品列表');
  await fetchProducts();
});

// 監聽 productForm.productType 和 prizeCategory 的變化
watch(() => productForm.productType, (newType) => {
  if (newType !== ProductType.PRIZE) {
    productForm.prizeCategory = PrizeCategory.NONE;
  }
});

watch(() => productForm.prizeCategory, (newCategory) => {
  if (newCategory === PrizeCategory.BONUS) {
    productForm.price = 0;
    productForm.sliverPrice = 0;
  } else {
    productForm.bonusPrice = 0;
  }
});

// 方法
const fetchProducts = async () => {
  try {
    console.log('開始獲取產品列表');
    const response = await productservice.getAllProducts();
    console.log('獲取產品列表響應:', response);
    if (response.success) {
      products.value = response.data.map(product => ({
            ...product,
            status: productStatusOptions[product.status as ProductStatus] || product.status
          }));
      console.log('產品列表已更新', products.value);
    } else {
      console.error('獲取產品列表失敗:', response.message);
    }
  } catch (error) {
    console.error('獲取產品列表時發生錯誤:', error);
  }
};

const fetchProductDetails = async (productId: number) => {
  try {
    console.log('開始獲取產品詳情', productId);
    const response = await productservice.getAllProductDetails();
    console.log('獲取產品詳情響應:', response);
    if (response.success) {
      productDetails.value = response.data.filter(detail => detail.productId === productId);
      console.log('產品詳情已更新', productDetails.value);
      // 更新產品的庫存數量
      updateProductStockQuantity(productId);
    } else {
      console.error('獲取產品詳情失敗:', response.message);
    }
  } catch (error) {
    console.error('獲取產品詳情時發生錯誤:', error);
  }
};

const updateProductStockQuantity = (productId: number) => {
  const totalQuantity = productDetails.value.reduce((sum, detail) => sum + detail.quantity, 0);
  const productIndex = products.value.findIndex(p => p.productId === productId);
  if (productIndex !== -1) {
    products.value[productIndex].stockQuantity = totalQuantity;
  }
};

const openAddProductModal = () => {
  console.log('打開新增產品模態窗');
  editingProduct.value = null;
  resetProductForm();
  showProductModal.value = true;
};

const openEditProductModal = (product: ProductRes) => {
  console.log('打開編輯產品模態窗', product);
  editingProduct.value = product;
  Object.assign(productForm, product);
  showProductModal.value = true;
};

const closeProductModal = () => {
  console.log('關閉產品模態窗');
  showProductModal.value = false;
  resetProductForm();
};

const openProductDetailsModal = async (productId: number) => {
  console.log('打開產品詳情模態窗', productId);
  currentProductId.value = productId;
  await fetchProductDetails(productId);
  showProductDetailsModal.value = true;
};

const closeProductDetailsModal = () => {
  console.log('關閉產品詳情模態窗');
  showProductDetailsModal.value = false;
  currentProductId.value = null;
};

const openAddDetailModal = () => {
  console.log('打開新增商品詳情模態窗');
  editingDetail.value = null;
  resetDetailForm();
  showDetailModal.value = true;
};

const openEditDetailModal = (detail: DetailRes) => {
  console.log('打開編輯商品詳情模態窗', detail);
  editingDetail.value = detail;
  Object.assign(detailForm, detail);
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  console.log('關閉商品詳情模態窗');
  showDetailModal.value = false;
  resetDetailForm();
};

const handleProductSubmit = async () => {
  try {
    console.log('開始提交產品表單', productForm);
    let response;
    if (editingProduct.value) {
      console.log('更新現有產品', editingProduct.value.productId);
      response = await productservice.updateProduct(editingProduct.value.productId, productForm);
    } else {
      console.log('創建新產品');
      response = await productservice.createProduct(productForm);
    }

    console.log('產品提交響應:', response);
    if (response.success) {
      await fetchProducts();
      closeProductModal();
    } else {
      console.error('提交產品失敗:', response.message);
    }
  } catch (error) {
    console.error('提交產品時發生錯誤:', error);
  }
};

const handleDetailSubmit = async () => {
  try {
    console.log('開始提交商品詳情表單', detailForm);
    let response;
    if (editingDetail.value) {
      console.log('更新現有商品詳情', editingDetail.value.productDetailId);
      response = await productservice.updateProductDetail(editingDetail.value.productDetailId, detailForm);
    } else {
      console.log('創建新商品詳情');
      detailForm.productId = currentProductId.value!;
      response = await productservice.createProductDetails([detailForm]);
    }

    console.log('商品詳情提交響應:', response);
    if (response.success) {
      await fetchProductDetails(currentProductId.value!);
      closeDetailModal();
    } else {
      console.error('提交商品詳情失敗:', response.message);
    }
  } catch (error) {
    console.error('提交商品詳情時發生錯誤:', error);
  }
};

const deleteProduct = async (productId: number) => {
  if (confirm('確定要刪除這個產品系列嗎？')) {
    try {
      console.log('開始刪除產品', productId);
      const response = await productservice.deleteProduct(productId);
      console.log('刪除產品響應:', response);
      if (response.success) {
        await fetchProducts();
      } else {
        console.error('刪除產品失敗:', response.message);
      }
    } catch (error) {
      console.error('刪除產品時發生錯誤:', error);
    }
  }
};

const deleteProductDetail = async (productDetailId: number) => {
  if (confirm('確定要刪除這個商品嗎？')) {
    try {
      console.log('開始刪除商品詳情', productDetailId);
      const response = await productservice.deleteProductDetail(productDetailId);
      console.log('刪除商品詳情響應:', response);
      if (response.success) {
        await fetchProductDetails(currentProductId.value!);
      } else {
        console.error('刪除商品詳情失敗:', response.message);
      }
    } catch (error) {
      console.error('刪除商品詳情時發生錯誤:', error);
    }
  }
};

const handleImageUpload = (event: Event) => {
  console.log('處理圖片上傳');
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    productForm.imageUrls = [...productForm.imageUrls, ...files];
    console.log('更新後的產品圖片:', productForm.imageUrls);
  }
};

const handleDetailImageUpload = (event: Event) => {
  console.log('處理商品詳情圖片上傳');
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    detailForm.imageUrls = [...detailForm.imageUrls, ...files];
    console.log('更新後的商品詳情圖片:', detailForm.imageUrls);
  }
};

const removeImage = (index: number) => {
  console.log('移除產品圖片', index);
  productForm.imageUrls.splice(index, 1);
};

const removeDetailImage = (index: number) => {
  console.log('移除商品詳情圖片', index);
  detailForm.imageUrls.splice(index, 1);
};

const resetProductForm = () => {
  console.log('重置產品表單');
  Object.assign(productForm, {
    productName: '',
    description: '',
    price: 0,
    sliverPrice: 0,
    bonusPrice: 0,
    stockQuantity: 0,
    imageUrls: [],
    productType: ProductType.PRIZE,
    prizeCategory: PrizeCategory.NONE,
    status: ProductStatus.AVAILABLE,
    specification: '',
  });
};

const resetDetailForm = () => {
  console.log('重置商品詳情表單');
  Object.assign(detailForm, {
    productId: currentProductId.value,
    description: '',
    note: '',
    quantity: 0,
    productName: '',
    grade: 'A',  // 預設等級
    imageUrls: [],
    length: 0,
    width: 0,
    height: 0,
    specification: '',
  });
};

const formatImageUrl = (url: string | File): string => {
  if (typeof url === 'string') {
    return productservice.getImageUrl(url);
  }
  return URL.createObjectURL(url);
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
.product-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1,
h2 {
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
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

th,
td {
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
  background-color: rgba(0, 0, 0, 0.6);
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
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

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 20px;
  }

  table,
  th,
  td {
    font-size: 14px;
  }

  button {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
