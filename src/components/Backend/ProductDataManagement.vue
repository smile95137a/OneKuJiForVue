<template>
  <div class="product-management">
    <h1>產品系列管理</h1>
    <div class="filter-container">
      <button @click="openAddProductModal">新增產品系列</button>
       <!-- 商品類別管理按鈕 -->
    <div class="category-management">
      <button @click="openCategoryModal">管理商品類別</button>
    </div>
      <div class="filter-form">
        <select v-model="filterProductType" @change="handleProductTypeChange">
          <option value="">全部類型</option>
          <option v-for="(label, value) in productTypeOptions" :key="value" :value="value">{{ label }}</option>
        </select>
        <select v-if="filterProductType === ProductType.PRIZE" v-model="filterPrizeCategory">
          <option value="">全部一番賞類別</option>
          <option v-for="category in PrizeCategory" :key="category" :value="category">
            {{ getPrizeCategoryDescription(category) }}
          </option>
        </select>
      </div>
    </div>

   

    <!-- 商品類別管理模態窗 -->
    <div v-if="showCategoryModal" class="modal">
      <div class="modal-content">
        <h2>商品類別管理</h2>
        <button @click="openAddCategoryModal">新增商品類別</button>
        <table v-if="categories.length">
          <thead>
            <tr>
              <th>類別名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.categoryId">
              <td>{{ category.categoryName }}</td>
              <td>
                <button @click="openEditCategoryModal(category)">編輯</button>
                <button @click="deleteCategory(category.categoryId)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>暫無商品類別</p>
        <button type="button" @click="closeCategoryModal">關閉</button>
      </div>
    </div>

    <!-- 新增/編輯商品類別模態窗 -->
    <div v-if="showCategoryEditModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingCategory ? '編輯商品類別' : '新增商品類別' }}</h2>
        <form @submit.prevent="handleCategorySubmit">
          <div>
            <label for="categoryName">類別名稱</label>
            <input id="categoryName" v-model="categoryForm.categoryName" required />
          </div>
          <button type="submit">{{ editingCategory ? '更新' : '新增' }}</button>
          <button type="button" @click="closeCategoryEditModal">取消</button>
        </form>
      </div>
    </div>

    <table v-if="filteredProducts.length">
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
          <th>商品類別</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.productId">
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
          <td>{{ getCategoryName(product.categoryId) }}</td>
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
            <textarea id="description" v-model="productForm.description"></textarea>
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
            <label for="categorySelect">商品類別</label>
            <select id="categorySelect" v-model="selectedCategoryId" @change="handleCategoryChange">
              <option value="">選擇現有類別或創建新類別</option>
              <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                {{ category.categoryName }}
              </option>
              <option value="new">創建新類別</option>
            </select>
          </div>
          <div v-if="selectedCategoryId === 'new'">
            <label for="newCategory">新類別名稱</label>
            <input id="newCategory" v-model="newCategoryName" required>
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
          <div v-if="!editingDetail">
            <h3>批量新增</h3>
            <div v-for="(detail, index) in batchDetails" :key="index" class="batch-item">
              <h4>商品 #{{ index + 1 }}</h4>
              <div>
                <label :for="'detailProductName' + index">商品名稱</label>
                <input :id="'detailProductName' + index" v-model="detail.productName" required>
              </div>
              <div>
                <label :for="'detailDescription' + index">描述</label>
                <textarea :id="'detailDescription' + index" v-model="detail.description"></textarea>
              </div>
              <div>
                <label :for="'detailQuantity' + index">數量</label>
                <input :id="'detailQuantity' + index" type="number" v-model.number="detail.quantity" required>
              </div>
              <div v-if="currentProductType === ProductType.PRIZE">
                <label :for="'detailGrade' + index">等級</label>
                <select :id="'detailGrade' + index" v-model="detail.grade">
                  <option v-for="grade in ['SP','LAST','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'SP']" :key="grade" :value="grade">
                    {{ grade }}
                  </option>
                </select>
              </div>
              <div v-if="currentProductType === ProductType.PRIZE">
                <label :for="'detailSliverPrice' + index">銀幣價格</label>
                <input :id="'detailSliverPrice' + index" type="number" v-model.number="detail.sliverPrice" step="0.01">
              </div>
              <div>
                <label :for="'detailSpecification' + index">規格</label>
                <input :id="'detailSpecification' + index" v-model="detail.specification">
              </div>
              <div>
                <label :for="'detailSize' + index">尺寸</label>
                <select :id="'detailSize' + index" v-model="detail.size" @change="updateDimensions(detail)">
                  <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
                </select>
              </div>
              <div v-if="currentProductType === ProductType.PRIZE">
                <label :for="'detailProbability' + index">機率</label>
                <input :id="'detailProbability' + index" type="number" v-model.number="detail.probability" step="0.01" min="0" max="1">
              </div>
              <div>
                <label :for="'detailImage' + index">商品圖片</label>
                <input :id="'detailImage' + index" type="file" @change="(event) => handleDetailImageUpload(event, index)" multiple accept="image/*">
              </div>
              <div v-if="detail.imageUrls && detail.imageUrls.length > 0">
                <div v-for="(image, imageIndex) in detail.imageUrls" :key="imageIndex">
                  <img v-if="isValidImageUrl(image)" :src="formatImageUrl(image)" alt="商品圖片" style="width: 100px; height: 100px;">
                  <button type="button" @click="removeDetailImage(index, imageIndex)">移除</button>
                </div>
              </div>
              <button type="button" @click="removeDetailFromBatch(index)">移除</button>
            </div>
            <button type="button" @click="addDetailToBatch">新增另一個商品</button>
          </div>
          <div v-else>
            <div>
              <label for="detailProductName">商品名稱</label>
              <input id="detailProductName" v-model="detailForm.productName" required>
            </div>
            <div>
              <label for="detailDescription">描述</label>
              <textarea id="detailDescription" v-model="detailForm.description"></textarea>
            </div>
            <div>
              <label for="detailNote">備註</label>
              <textarea id="detailNote" v-model="detailForm.note"></textarea>
            </div>
            <div>
              <label for="detailQuantity">數量</label>
              <input id="detailQuantity" type="number" v-model.number="detailForm.quantity" required>
            </div>
            <div v-if="currentProductType === ProductType.PRIZE">
              <label for="detailGrade">等級</label>
              <select id="detailGrade" v-model="detailForm.grade">
                <option v-for="grade in ['SP','LAST','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'SP']" :key="grade" :value="grade">
                  {{ grade }}
                </option>
              </select>
            </div>
            <div v-if="currentProductType === ProductType.PRIZE">
              <label for="detailSliverPrice">銀幣價格</label>
              <input id="detailSliverPrice" v-model.number="detailForm.sliverPrice" type="number" step="0.01">
            </div>
            <div>
              <label for="detailSpecification">規格</label>
              <input id="detailSpecification" v-model="detailForm.specification">
            </div>
            <div>
              <label for="detailSize">尺寸</label>
              <select id="detailSize" v-model="detailForm.size" @change="updateDimensions(detailForm)">
                <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
            <div v-if="currentProductType === ProductType.PRIZE">
              <label for="detailProbability">機率</label>
              <input id="detailProbability" v-model.number="detailForm.probability" type="number" step="0.01" min="0" max="1">
            </div>
            <div>
              <label for="detailImage">商品圖片</label>
              <input id="detailImage" type="file" @change="handleDetailImageUpload" multiple accept="image/*">
            </div>
            <div v-if="detailForm.imageUrls && detailForm.imageUrls.length > 0">
              <div v-for="(image, index) in detailForm.imageUrls" :key="index">
                <img v-if="isValidImageUrl(image)" :src="formatImageUrl(image)" alt="商品圖片" style="width: 100px; height: 100px;">
                <button type="button" @click="removeDetailImage(index)">移除</button>
              </div>
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
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { DetailReq, DetailRes, PrizeCategory, ProductReq, ProductRes, ProductStatus, ProductType, ProductCategory } from '@/interfaces/product';
import { productservice } from '@/services/backend/productservice';

// 路由相關
const route = useRoute();

// 數據
const products = ref<ProductRes[]>([]);
const productDetails = ref<DetailRes[]>([]);
const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const showDetailModal = ref(false);
const editingProduct = ref<ProductRes | null>(null);
const editingDetail = ref<DetailRes | null>(null);
const currentProductId = ref<number | null>(null);
const currentProductType = ref<ProductType>(ProductType.PRIZE);
const batchDetails = ref<(DetailReq & { size?: number })[]>([]);
const categoryNameMap = ref(new Map<number, string>());

// 類別管理數據
const showCategoryModal = ref(false);
const showCategoryEditModal = ref(false);
const editingCategory = ref<ProductCategory | null>(null);
const categoryForm = reactive<{ categoryName: string }>({
  categoryName: '',
});

// 篩選和類別相關
const filterProductType = ref('');
const filterPrizeCategory = ref('');
const categories = ref<ProductCategory[]>([]);
const selectedCategoryId = ref<number | string>('');
const newCategoryName = ref('');

// 尺寸選項
const sizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

// 計算屬性
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    if (filterProductType.value && product.productType !== filterProductType.value) {
      return false;
    }
    if (filterProductType.value === ProductType.PRIZE && 
        filterPrizeCategory.value && 
        product.prizeCategory !== filterPrizeCategory.value) {
      return false;
    }
    return true;
  });
});

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
  status: ProductStatus.NOT_AVAILABLE_YET,
  specification: '',
  categoryId: null,
});

const productTypeOptions: Record<ProductType, string> = {
  [ProductType.PRIZE]: '一番賞',
  [ProductType.GACHA]: '扭蛋',
  [ProductType.BLIND_BOX]: '盲盒',
};

const productStatusOptions: Record<ProductStatus, string> = {
  [ProductStatus.AVAILABLE]: '上架',
  [ProductStatus.UNAVAILABLE]: '下架',
  [ProductStatus.NOT_AVAILABLE_YET]: '未上架',
  [ProductStatus.SOLD_OUT]: '上架已售完'
};

const detailForm = reactive<DetailReq & { size?: number }>({
  productDetailId: undefined,
  productId: 0,
  description: '',
  note: '',
  quantity: 0,
  stockQuantity: 0,
  productName: '',
  grade: 'A',
  price: 0,
  sliverPrice: 0,
  imageUrls: [],
  length: 0,
  width: 0,
  height: 2,
  specification: '',
  probability: 0.0,
  size: 10
});

// 生命週期鉤子
onMounted(async () => {
  await fetchProducts();
  await fetchCategories();
  if (route.params.productId) {
    const productId = parseInt(route.params.productId as string);
    if (productId > 0) {
      currentProductId.value = productId;
      await fetchProductDetails(productId);
    } else {
      console.error('無效的路由參數 productId');
    }
  }
});

// 監聽器
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

watch(
  () => route.params.productId,
  async (newProductId) => {
    if (newProductId) {
      currentProductId.value = parseInt(newProductId as string);
      await fetchProductDetails(currentProductId.value);
    } else {
      currentProductId.value = null;
    }
  }
);

// 方法
const fetchProducts = async () => {
  try {
    const response = await productservice.getAllProducts();
    if (response.success) {
      products.value = response.data.map(product => ({
        ...product,
        status: productStatusOptions[product.status as ProductStatus] || product.status
      }));
      
      const categoriesResponse = await productservice.getAllCategories();
      if (categoriesResponse.success) {
        categoryNameMap.value = new Map(
          categoriesResponse.data.map(category => [category.categoryId, category.categoryName])
        );
      }
    } else {
      console.error('獲取產品列表失敗:', response.message);
    }
  } catch (error) {
    console.error('獲取產品列表時發生錯誤:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await productservice.getAllCategories();
    if (response.success) {
      categories.value = response.data;
    } else {
      console.error('獲取類別列表失敗:', response.message);
    }
  } catch (error) {
    console.error('獲取類別列表時發生錯誤:', error);
  }
};

const fetchProductDetails = async (productId: number) => {
  try {
    const response = await productservice.getAllProductDetails();
    if (response.success) {
      productDetails.value = response.data
        .filter(detail => detail.productId === productId)
        .map(detail => ({
          ...detail,
          imageUrls: detail.imageUrls.filter(url => url.trim() !== '')
        }));
      updateProductStockQuantity(productId);
      const currentProduct = products.value.find(p => p.productId === productId);
      if (currentProduct) {
        currentProductType.value = currentProduct.productType;
      }
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
  editingProduct.value = null;
  resetProductForm();
  showProductModal.value = true;
};

const openEditProductModal = (product: ProductRes) => {
  editingProduct.value = product;
  Object.assign(productForm, product);
  selectedCategoryId.value = product.categoryId || '';
  newCategoryName.value = '';
  showProductModal.value = true;
};

const getCategoryName = (categoryId: number | null) => {
  if (!categoryId) return '-';
  return categoryNameMap.value.get(categoryId) || '-';
};

const closeProductModal = () => {
  showProductModal.value = false;
  resetProductForm();
};

const openProductDetailsModal = async (productId: number) => {
  if (!productId || productId <= 0) {
    console.error('無效的產品ID');
    alert('無法打開產品詳情：無效的產品ID');
    return;
  }
  currentProductId.value = productId;
  await fetchProductDetails(productId);
  showProductDetailsModal.value = true;
};

const closeProductDetailsModal = () => {
  showProductDetailsModal.value = false;
  currentProductId.value = null;
};

const openAddDetailModal = () => {
  if (!currentProductId.value) {
    console.error('當前產品ID未設置，無法添加商品');
    // TODO: 添加用戶提示
    return;
  }
  editingDetail.value = null;
  batchDetails.value = [{
    ...detailForm,
    productId: currentProductId.value,
    imageUrls: []
  }];
  if (currentProductType.value === ProductType.GACHA || currentProductType.value === ProductType.BLIND_BOX) {
    batchDetails.value[0].probability = 1;
  }
  showDetailModal.value = true;
};

const openEditDetailModal = (detail: DetailRes) => {
  editingDetail.value = detail;
  detail.imageUrls = detail.imageUrls.filter(url => url.trim() !== '');
  Object.assign(detailForm, detail);
  detailForm.size = calculateSize(detail.length, detail.width);
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  resetDetailForm();
  batchDetails.value = [];
};

const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (target.value === 'new') {
    selectedCategoryId.value = 'new';
    productForm.categoryId = null;
  } else if (target.value === '') {
    selectedCategoryId.value = '';
    productForm.categoryId = null;
    newCategoryName.value = '';
  } else {
    const categoryId = parseInt(target.value);
    selectedCategoryId.value = categoryId;
    productForm.categoryId = categoryId;
    newCategoryName.value = '';
  }
};

const handleProductSubmit = async () => {
  try {
    if (selectedCategoryId.value === 'new' && newCategoryName.value) {
      const newCategoryResponse = await productservice.createCategory({ categoryName: newCategoryName.value });
      if (newCategoryResponse.success) {
        productForm.categoryId = newCategoryResponse.data.categoryId;
      } else {
        console.error('創建新類別失敗:', newCategoryResponse.message);
        return;
      }
    } else if (typeof selectedCategoryId.value === 'number') {
      productForm.categoryId = selectedCategoryId.value;
    }

    let response;
    if (editingProduct.value) {
      response = await productservice.updateProduct(editingProduct.value.productId, productForm);
    } else {
      response = await productservice.createProduct(productForm);
    }

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

const cleanImageUrls = (detail: DetailReq) => ({
  ...detail,
  imageUrls: detail.imageUrls.filter(url => url instanceof File || (typeof url === 'string' && url.trim() !== ''))
});

const handleDetailSubmit = async () => {
  if (!currentProductId.value || currentProductId.value <= 0) {
    console.error('當前產品ID無效，無法提交');
    alert('無法提交：當前產品未選擇或ID無效');
    return;
  }

  try {
    let response;

    if (editingDetail.value) {
      // 編輯單個商品詳情
      updateDimensions(detailForm);
      const updatedDetail = {
        ...cleanImageUrls(detailForm),
        productId: currentProductId.value
      };
      response = await productservice.updateProductDetail(
        editingDetail.value.productDetailId!, 
        updatedDetail
      );
    } else {
      // 新增商品詳情（單筆或多筆）
      const cleanedDetails = batchDetails.value.map(detail => ({
        ...cleanImageUrls(detail),
        productId: currentProductId.value
      }));
      response = await (productservice.createProductDetails as (details: any[]) => Promise<any>)(cleanedDetails);
    }

    if (response.success) {
      await fetchProductDetails(currentProductId.value);
      closeDetailModal();
      alert('提交成功');
    } else {
      console.error('提交失敗:', response.message);
      alert(`提交失敗: ${response.message}`);
    }
  } catch (error) {
    console.error('提交時發生錯誤:', error);
    alert('提交時發生錯誤，請稍後再試');
  }
};

const deleteProduct = async (productId: number) => {
  if (confirm('確定要刪除這個產品系列嗎？')) {
    try {
      const response = await productservice.deleteProduct(productId);
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
      const response = await productservice.deleteProductDetail(productDetailId);
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
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files).filter(file => file.size > 0);
    productForm.imageUrls = [...productForm.imageUrls, ...files];
  }
};

const handleDetailImageUpload = (event: Event, detailIndex?: number) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files).filter(file => file.size > 0);
    if (editingDetail.value) {
      detailForm.imageUrls = [...detailForm.imageUrls, ...files];
    } else if (detailIndex !== undefined) {
      const updatedDetail = { ...batchDetails.value[detailIndex] };
      updatedDetail.imageUrls = [...(updatedDetail.imageUrls || []), ...files];
      batchDetails.value.splice(detailIndex, 1, updatedDetail);
    }
  }
};

const removeImage = (index: number) => {
  productForm.imageUrls.splice(index, 1);
};

const removeDetailImage = (detailIndex: number, imageIndex?: number) => {
  if (editingDetail.value) {
    detailForm.imageUrls.splice(detailIndex, 1);
  } else if (imageIndex !== undefined) {
    const updatedDetail = { ...batchDetails.value[detailIndex] };
    updatedDetail.imageUrls.splice(imageIndex, 1);
    batchDetails.value.splice(detailIndex, 1, updatedDetail);
  }
};

const resetProductForm = () => {
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
    status: ProductStatus.NOT_AVAILABLE_YET,
    specification: '',
    categoryId: null,
  });
  selectedCategoryId.value = '';
  newCategoryName.value = '';
};

const resetDetailForm = () => {
  Object.assign(detailForm, {
    productId: currentProductId.value,
    description: '',
    note: '',
    quantity: 0,
    productName: '',
    grade: 'A',
    imageUrls: [],
    length: 0,
    width: 0,
    height: 2,
    specification: '',
    probability: 0.0,
    size: 10
  });
};

const formatImageUrl = (url: string | File): string => {
  if (typeof url === 'string') {
    return url.trim() !== '' ? productservice.getImageUrl(url) : '';
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
    case PrizeCategory.PRIZESELF:
      return '自製賞';
    case PrizeCategory.NONE:
    default:
      return '無';
  }
};

const addDetailToBatch = () => {
  if (!currentProductId.value) {
    console.error('當前產品ID未設置，無法添加商品');
    // TODO: 添加用戶提示
    return;
  }
  const newDetail = { 
    ...detailForm, 
    productId: currentProductId.value,
    imageUrls: [],
    size: 10
  };
  if (currentProductType.value === ProductType.GACHA || currentProductType.value === ProductType.BLIND_BOX) {
    newDetail.probability = 1;
  }
  updateDimensions(newDetail);
  batchDetails.value.push(newDetail);
};

const removeDetailFromBatch = (index: number) => {
  batchDetails.value.splice(index, 1);
};

const handleProductTypeChange = () => {
  if (filterProductType.value !== ProductType.PRIZE) {
    filterPrizeCategory.value = '';
  }
};

const isValidImageUrl = (url: string | File): boolean => {
  if (url instanceof File) return url.size > 0;
  return typeof url === 'string' && url.trim() !== '';
};

const updateDimensions = (detail: DetailReq & { size?: number }) => {
  if (detail.size !== undefined) {
    const dimension = Math.floor((detail.size - 2) / 2);
    detail.length = dimension;
    detail.width = dimension;
    detail.height = 2;
  }
};

const calculateSize = (length: number, width: number): number => {
  return Math.min(200, Math.max(10, (length + width) * 2 + 2));
};

// 類別管理相關方法
const openCategoryModal = () => {
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
};

const openAddCategoryModal = () => {
  editingCategory.value = null;
  categoryForm.categoryName = '';
  showCategoryEditModal.value = true;
};

const openEditCategoryModal = (category: ProductCategory) => {
  editingCategory.value = category;
  categoryForm.categoryName = category.categoryName;
  showCategoryEditModal.value = true;
};

const closeCategoryEditModal = () => {
  showCategoryEditModal.value = false;
  categoryForm.categoryName = '';
};

const handleCategorySubmit = async () => {
  try {
    let response;
    if (editingCategory.value) {
      response = await productservice.updateCategory(editingCategory.value.categoryId, {
        categoryId: editingCategory.value.categoryId,
        categoryName: categoryForm.categoryName,
      });
    } else {
      response = await productservice.createCategory({ categoryName: categoryForm.categoryName });
    }

    if (response.success) {
      await fetchCategories();
      closeCategoryEditModal();
      alert(editingCategory.value ? '更新成功' : '創建成功');
    } else {
      alert(`操作失敗：${response.message || '發生未知錯誤'}`);
    }
  } catch (error) {
    console.error('提交類別時發生錯誤:', error);
    alert('操作失敗：伺服器錯誤，請稍後再試');
  }
};

const deleteCategory = async (categoryId: number) => {
  if (confirm('確定要刪除這個類別嗎？')) {
    try {
      const response = await productservice.deleteCategory(categoryId);
      if (response.success) {
        await fetchCategories();
        alert('刪除成功');
      } else {
        alert(`刪除失敗：${response.message || '該類別下有產品，無法刪除'}`);
      }
    } catch (error) {
      console.error('刪除類別時發生錯誤:', error);
      alert('刪除失敗：伺服器錯誤，請稍後再試');
    }
  }
};

// 導出需要在模板中使用的方法和響應式數據
</script>
<style scoped>
.product-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1, h2 {
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

.batch-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.batch-item h4 {
  margin-top: 0;
  color: #3498db;
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

  .batch-item {
    padding: 10px;
  }
}

</style>
