<template>
  <div class="product-management">
    <h1>推薦系列管理</h1>
    <button @click="openCreateMappingModal">新增推薦系列</button>

    <table v-if="mappings.length">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>類別名稱</th>
          <th>創造時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recommand in mappings" :key="recommand.id">
          <td>
            <img v-if="recommand.imageUrl" 
                 :src="getImageUrl(recommand.imageUrl)" 
                 :alt="recommand.productName"
                 class="product-thumbnail" />
          </td>
          <td>{{ recommand.productName }}</td>
          <td>{{ recommand.recommendationName || '未設置類別' }}</td>
          <td>{{ formatDateArrayToChinese(recommand.createdDate) }}</td>
          <td>
            <button @click="openEditMappingModal(recommand)">編輯</button>
            <button @click="deleteMapping(recommand.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>暫無推薦產品</p>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <form @submit.prevent="isEditing ? updateMapping(currentMapping) : createMapping()">
          <div>
            <label for="categorySelection">選擇類別</label>
            <select id="categorySelection" v-model="currentMapping.storeProductRecommendationId" @change="onCategoryChange" required>
              <option v-for="recommendation in commandCategory" :key="recommendation.id" :value="recommendation.id">
                {{ recommendation.recommendationName }}
              </option>
            </select>
          </div>
          <div>
            <label for="productSelection">選擇商品</label>
            <select id="productSelection" v-model="currentMapping.storeProductId" required>
              <option v-for="product in products" :key="isGachaCategory ? product.productId : (product as StoreProductRes).storeProductId" :value="isGachaCategory ? product.productId : (product as StoreProductRes).storeProductId">
                {{ product.productName }}
              </option>
            </select>
          </div>
          <div v-if="selectedProduct">
            <img v-if="getSelectedProductImage(selectedProduct)" 
                 :src="getImageUrl(getSelectedProductImage(selectedProduct))" 
                 :alt="selectedProduct.productName"
                 class="selected-product-image" />
            <p>商品名稱: {{ selectedProduct.productName }}</p>
            <p>價格: {{ selectedProduct.price }}</p>
            <p>庫存: {{ selectedProduct.stockQuantity }}</p>
          </div>
          
          <button type="submit">{{ isEditing ? '更新' : '新增' }}</button>
          <button type="button" @click="closeModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { ProductRecommendationMapping, StoreProductRecommendation, StoreProductRes, ProductRes, ProductType, ApiResponse } from '@/interfaces/recommand';
import { createMapping as createMappingAPI, deleteMapping as deleteMappingAPI, getAllMappings, getAllRecommendations, updateMapping as updateMappingAPI } from '@/services/backend/recommand';
import { storeServices } from '@/services/backend/storeservice';
import { productservice } from '@/services/backend/productservice';

const mappings = ref<ProductRecommendationMapping[]>([]);
const currentMapping = ref<ProductRecommendationMapping>({ storeProductId: 0, storeProductRecommendationId: 0 });
const showModal = ref(false);
const isEditing = ref(false);
const products = ref<(StoreProductRes | ProductRes)[]>([]);
const commandCategory = ref<StoreProductRecommendation[]>([]);
const selectedCategoryName = ref<string>('');
const isGachaCategory = ref(false);

const selectedProduct = computed(() => {
  return products.value.find(p => 
    (isGachaCategory.value ? (p as ProductRes).productId : (p as StoreProductRes).storeProductId) === currentMapping.value.storeProductId
  );
});

const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return '';
  return `https://api.onemorelottery.tw:8080/img${imageUrl}`;
};

const getSelectedProductImage = (product: StoreProductRes | ProductRes) => {
  if ('imageUrl' in product && product.imageUrl.length > 0) {
    return product.imageUrl[0];
  } else if ('imageUrls' in product && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }
  return undefined;
};

const fetchAllMappings = async () => {
  try {
    const response = await getAllMappings();
    mappings.value = response.data || [];
    console.log('獲取到的映射:', mappings.value);
    mappings.value.forEach(mapping => {
      console.log(`Mapping ID: ${mapping.id}, RecommendationName: ${mapping.recommendationName}`);
    });
  } catch (error) {
    console.error('獲取映射失敗:', error);
  }
};

const fetchProducts = async (isGacha: boolean) => {
  try {
    if (isGacha) {
      const response: ApiResponse<ProductRes[]> = await productservice.getAllProducts();
      products.value = response.data?.filter(product => product.productType === ProductType.GACHA) || [];
    } else {
      const response: ApiResponse<StoreProductRes[]> = await storeServices.getAllStoreProduct();
      products.value = response.data || [];
    }
    console.log('獲取到的產品:', products.value);
  } catch (error) {
    console.error('獲取產品失敗:', error);
  }
};

const fetchRecommendations = async () => {
  try {
    const response = await getAllRecommendations();
    commandCategory.value = response.data || [];
    console.log('獲取到的推薦類別:', commandCategory.value);
  } catch (error) {
    console.error('獲取推薦類別失敗:', error);
  }
};

const createMapping = async () => {
  try {
    const selectedRecommendation = commandCategory.value.find(cat => cat.id === currentMapping.value.storeProductRecommendationId);
    const newMapping = {
      ...currentMapping.value,
      recommendationName: selectedRecommendation?.recommendationName
    };
    console.log('Creating new mapping:', newMapping);
    await createMappingAPI(newMapping);
    await fetchAllMappings();
    closeModal();
  } catch (error) {
    console.error('創建映射失敗:', error);
  }
};

const updateMapping = async (mapping: ProductRecommendationMapping) => {
  try {
    if (mapping.id !== undefined) {
      const selectedRecommendation = commandCategory.value.find(cat => cat.id === currentMapping.value.storeProductRecommendationId);
      const updatedMapping = {
        ...currentMapping.value,
        recommendationName: selectedRecommendation?.recommendationName
      };
      console.log('Updating mapping:', updatedMapping);
      await updateMappingAPI(mapping.id, updatedMapping);
      await fetchAllMappings();
      closeModal();
    }
  } catch (error) {
    console.error('更新映射失敗:', error);
  }
};

const deleteMapping = async (id: number | undefined) => {
  if (id !== undefined) {
    try {
      await deleteMappingAPI(id);
      await fetchAllMappings();
    } catch (error) {
      console.error('刪除映射失敗:', error);
    }
  }
};

const openCreateMappingModal = () => {
  showModal.value = true;
  clearForm();
};

const openEditMappingModal = (mapping: ProductRecommendationMapping) => {
  currentMapping.value = { ...mapping };
  showModal.value = true;
  isEditing.value = true;
  onCategoryChange();
};

const closeModal = () => {
  showModal.value = false;
  clearForm();
};

const clearForm = () => {
  currentMapping.value = { storeProductId: 0, storeProductRecommendationId: 0 };
  isEditing.value = false;
  selectedCategoryName.value = '';
  isGachaCategory.value = false;
};

const onCategoryChange = async () => {
  const selectedRecommendation = commandCategory.value.find(cat => cat.id === currentMapping.value.storeProductRecommendationId);
  selectedCategoryName.value = selectedRecommendation?.recommendationName || '';
  isGachaCategory.value = selectedCategoryName.value === '扭蛋推薦';
  await fetchProducts(isGachaCategory.value);
  currentMapping.value.storeProductId = 0; // 重置產品選擇
  console.log('類別變更，當前選擇:', selectedCategoryName.value, '是否為扭蛋類別:', isGachaCategory.value);
};

function formatDateArrayToChinese(dateArray: number[] | null | undefined): string {
  if (!dateArray || dateArray.length < 6) {
    return '時間格式不正確';
  }

  const date = new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4],
    dateArray[5]
  );

  return `西元${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}點${date.getMinutes()}分`;
}

onMounted(() => {
  fetchAllMappings();
  fetchRecommendations().then(() => {
    console.log('Available categories:', commandCategory.value);
  });
  console.log('組件掛載完成，初始化數據獲取');
});

watch(mappings, (newMappings) => {
  console.log('映射更新:', newMappings);
});

watch(selectedCategoryName, () => {
  console.log('選中的推薦類別變更:', selectedCategoryName.value);
});
</script>

<style scoped>
.product-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
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
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #3498db;
  color: white;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 500px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.selected-product-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
}
</style>