<template>
  <div class="product-management">
    <h1>產品管理</h1>
    
    <div class="product-type-selector">
      <button @click="fetchProducts('PRIZE')">一番賞</button>
      <button @click="fetchProducts('GACHA')">扭蛋</button>
      <button @click="fetchProducts('BLIND_BOX')">盲盒</button>
    </div>

    <div v-if="selectedType === 'PRIZE'" class="prize-category-selector">
      <button @click="fetchOneKuJiProducts('FIGURE')">一番賞</button>
      <button @click="fetchOneKuJiProducts('C3')">3C家電賞</button>
      <button @click="fetchOneKuJiProducts('BONUS')">紅利賞</button>
    </div>

    <button @click="showAddProductModal = true">新增產品</button>

    <table>
      <thead>
        <tr>
          <th>產品名稱</th>
          <th>類型</th>
          <th>價格</th>
          <th>庫存</th>
          <th>銷售量</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.productId">
          <td>{{ product.productName }}</td>
          <td>{{ product.productType }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stockQuantity }}</td>
          <td>{{ product.soldQuantity }}</td>
          <td>{{ product.status }}</td>
          <td>
            <button @click="editProduct(product)">編輯</button>
            <button @click="deleteProduct(product.productId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增/編輯產品模態框 -->
    <div v-if="showAddProductModal || showEditProductModal" class="modal">
      <div class="modal-content">
        <h3>{{ showAddProductModal ? '新增產品' : '編輯產品' }}</h3>
        <form @submit.prevent="submitProduct">
          <div>
            <label for="productName">產品名稱:</label>
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
            <label for="productType">產品類型:</label>
            <select id="productType" v-model="currentProduct.productType" required>
              <option value="PRIZE">一番賞</option>
              <option value="BLIND_BOX">盲盒</option>
              <option value="GACHA">扭蛋</option>
            </select>
          </div>
          <div v-if="currentProduct.productType === 'PRIZE'">
            <label for="prizeCategory">獎品類別:</label>
            <select id="prizeCategory" v-model="currentProduct.prizeCategory">
              <option value="FIGURE">一番賞</option>
              <option value="C3">3C家電賞</option>
              <option value="BONUS">紅利賞</option>
            </select>
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
            <label for="productImage">產品圖片:</label>
            <input id="productImage" type="file" @change="handleImageUpload" multiple>
          </div>
          <button type="submit">{{ showAddProductModal ? '新增' : '更新' }}</button>
          <button type="button" @click="closeProductModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { productService } from '@/services/backend/productservice';
import { ProductReq, ProductRes } from '@/interfaces/product';

const products = ref<ProductRes[]>([]);
const selectedType = ref<string>('');
const showAddProductModal = ref(false);
const showEditProductModal = ref(false);
const currentProduct = reactive<ProductReq>({
  productId: undefined,
  productName: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  soldQuantity: 0,
  startDate: '',
  endDate: '',
  productType: 'PRIZE',
  status: 'AVAILABLE',
});
const imageFiles = ref<File[]>([]);

onMounted(() => {
  fetchProducts('PRIZE');
});

const fetchProducts = async (type: string) => {
  selectedType.value = type;
  try {
    const response = await productService.getProductByType(type);
    products.value = response.data.data || [];
  } catch (error) {
    console.error('獲取產品列表失敗:', error);
  }
};

const fetchOneKuJiProducts = async (category: string) => {
  try {
    const response = await productService.getProductByOneKuJiType(category);
    products.value = response.data.data || [];
  } catch (error) {
    console.error('獲取一番賞產品列表失敗:', error);
  }
};

const editProduct = (product: ProductRes) => {
  Object.assign(currentProduct, product);
  currentProduct.productId = product.productId;
  showEditProductModal.value = true;
};

const deleteProduct = async (productId: number) => {
  if (confirm('確定要刪除這個產品嗎？')) {
    try {
      await productService.deleteProduct(productId);
      await fetchProducts(selectedType.value);
    } catch (error) {
      console.error('刪除產品失敗:', error);
    }
  }
};

const submitProduct = async () => {
  const formData = new FormData();
  Object.keys(currentProduct).forEach(key => {
    if (key !== 'productId' || currentProduct.productId) {
      formData.append(key, (currentProduct as any)[key]);
    }
  });
  imageFiles.value.forEach(file => {
    formData.append('images', file);
  });

  try {
    if (showAddProductModal.value) {
      await productService.createProduct(formData);
    } else {
      if (currentProduct.productId) {
        await productService.updateProduct(currentProduct.productId, formData);
      } else {
        throw new Error('無效的產品ID');
      }
    }
    await fetchProducts(selectedType.value);
    closeProductModal();
  } catch (error) {
    console.error('提交產品失敗:', error);
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
    productId: undefined,
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    soldQuantity: 0,
    startDate: '',
    endDate: '',
    productType: 'PRIZE',
    status: 'AVAILABLE',
  });
  imageFiles.value = [];
};
</script>

<style scoped>
.product-management {
  padding: 20px;
}
h1, h3 {
  margin-bottom: 20px;
}
.product-type-selector, .prize-category-selector {
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
}
</style>