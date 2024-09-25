<template>
  <div class="product-management">
    <h1>推薦系列管理</h1>
    <button @click="openCreateMappingModal">新增推薦系列</button>

    <table v-if="mappings.length">
      <thead>
        <tr>
          <th>商品名稱</th>
          <th>類別名稱</th>
          <th>創造時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recommand in mappings" :key="recommand.id">
          <td style="display: none;">{{ recommand.id }}</td>
          <td>{{ recommand.productName }}</td>
          <td>{{ recommand.recommendationName }}</td>
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
            <label for="productSelection">選擇商品</label>
            <select id="productSelection" v-model="currentMapping.storeProductId" required>
              <option v-for="product in products" :key="product.storeProductId" :value="product.storeProductId">
                {{ product.productName }}
              </option>
            </select>
          </div>
          <div>
            <label for="categorySelection">選擇類別</label>
            <select id="categorySelection" v-model="currentMapping.storeProductRecommendationId" required>
              <option v-for="(recommendation) in commandCategory" :key="recommendation.id" :value="recommendation.id">
                {{ recommendation.recommendationName }}
              </option>
            </select>
          </div>
          <button type="submit">{{ isEditing ? '更新' : '新增' }}</button>
          <button type="button" @click="closeModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductRecommendationMapping, StoreProductRecommendation } from '@/interfaces/recommand';
import { StoreProductRes } from '@/interfaces/store';
import { createMapping as createMappingAPI, deleteMapping as deleteMappingAPI, getAllMappings, getAllRecommendations, updateMapping as updateMappingAPI } from '@/services/backend/recommand';
import { storeServices } from '@/services/backend/storeservice';
import { onMounted, ref } from 'vue';

const mappings = ref<ProductRecommendationMapping[]>([]);
const currentMapping = ref<ProductRecommendationMapping>({ storeProductId: 0, storeProductRecommendationId: 0 });
const showModal = ref(false);
const isEditing = ref(false);
const products = ref<StoreProductRes[]>([]);
const commandCategory = ref<StoreProductRecommendation[]>([]);

const fetchAllMappings = async () => {
  try {
    const response = await getAllMappings();
    mappings.value = response.data || [];
  } catch (error) {
    console.error(error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await storeServices.getAllStoreProduct();
    products.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const createMapping = async () => {
  try {
    await createMappingAPI(currentMapping.value);
    fetchAllMappings();
    closeModal();
  } catch (error) {
    console.error(error);
  }
};

const updateMapping = async (mapping: ProductRecommendationMapping) => {
  try {
    await updateMappingAPI(mapping.id, currentMapping.value);
    fetchAllMappings();
    closeModal();
  } catch (error) {
    console.error(error);
  }
};

const deleteMapping = async (id: number) => {
  try {
    await deleteMappingAPI(id);
    fetchAllMappings();
  } catch (error) {
    console.error(error);
  }
};

const openCreateMappingModal = () => {
  showModal.value = true;
  clearForm();
};

const closeModal = () => {
  showModal.value = false;
};

const clearForm = () => {
  currentMapping.value = { storeProductId: 0, storeProductRecommendationId: 0 };
  isEditing.value = false;
};

const fetchRecommendations = async () => {
  try {
    const response = await getAllRecommendations();
    commandCategory.value = response.data || [];
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchAllMappings();
  fetchProducts();
  fetchRecommendations();
});

function formatDateArrayToChinese(dateArray: number[]): string {
  if (dateArray.length < 6) {
    throw new Error('時間數組格式不正確');
  }

  const date = new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4],
    dateArray[5]
  );

  const formattedDate = `西元${date.getFullYear()}年${(date.getMonth() + 1)}月${date.getDate()}日${date.getHours()}點${date.getMinutes()}分`;

  return formattedDate;
}

const openEditMappingModal = (mapping: ProductRecommendationMapping) => {
  currentMapping.value = { ...mapping };
  showModal.value = true;
  isEditing.value = true;
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
