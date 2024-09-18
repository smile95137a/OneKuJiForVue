<template>
  <div class="shipping-method-management">
    <h2>運輸方式管理</h2>
    <button @click="openCreateModal">新增運輸方式</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>名稱</th>
          <th>描述</th>
          <th>狀態</th>
          <th>最小尺寸</th>
          <th>最大尺寸</th>
          <th>運費</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="method in shippingMethods" :key="method.shippingMethodId">
          <td>{{ method.shippingMethodId }}</td>
          <td>{{ method.name }}</td>
          <td>{{ method.description }}</td>
          <td>{{ method.status }}</td>
          <td>{{ method.minSize }}</td>
          <td>{{ method.maxSize }}</td>
          <td>{{ method.shippingPrice }}</td>
          <td>
            <button @click="openEditModal(method)">編輯</button>
            <button @click="deleteShippingMethod(method.shippingMethodId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? '編輯運輸方式' : '新增運輸方式' }}</h3>
        <form @submit.prevent="submitForm">
          <div>
            <label for="name">名稱</label>
            <input v-model="currentMethod.name" id="name" required>
          </div>
          <div>
            <label for="description">描述</label>
            <input v-model="currentMethod.description" id="description" required>
          </div>
          <div>
            <label for="status">狀態</label>
            <input v-model.number="currentMethod.status" id="status" type="number" required>
          </div>
          <div>
            <label for="minSize">最小尺寸</label>
            <input v-model.number="currentMethod.minSize" id="minSize" type="number" step="0.01" required>
          </div>
          <div>
            <label for="maxSize">最大尺寸</label>
            <input v-model.number="currentMethod.maxSize" id="maxSize" type="number" step="0.01" required>
          </div>
          <div>
            <label for="shippingPrice">運費</label>
            <input v-model.number="currentMethod.shippingPrice" id="shippingPrice" type="number" step="0.01" required>
          </div>
          <button type="submit">{{ isEditing ? '更新' : '創建' }}</button>
          <button type="button" @click="closeModal">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ShipService } from '@/services/backend/shipservice';
import { ShippingMethod, ShippingMethodReq } from '@/interfaces/ship';

const shippingMethods = ref<ShippingMethod[]>([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentMethod = ref<ShippingMethodReq>({
  name: '',
  description: '',
  status: 1,
  minSize: 0,
  maxSize: 0,
  shippingPrice: 0,
});

onMounted(async () => {
  await fetchShippingMethods();
});

const fetchShippingMethods = async () => {
  try {
    const response = await ShipService.getAllShippingMethods();
    shippingMethods.value = response.data || [];
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  currentMethod.value = {
    name: '',
    description: '',
    status: 1,
    minSize: 0,
    maxSize: 0,
    shippingPrice: 0,
  };
  showModal.value = true;
};

const openEditModal = (method: ShippingMethod) => {
  isEditing.value = true;
  currentMethod.value = {
    shippingMethodId: method.shippingMethodId,
    name: method.name,
    description: method.description,
    status: method.status,
    minSize: method.minSize,
    maxSize: method.maxSize,
    shippingPrice: method.shippingPrice
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitForm = async () => {
  try {
    if (isEditing.value && currentMethod.value.shippingMethodId) {
      await ShipService.updateShippingMethod(currentMethod.value.shippingMethodId, currentMethod.value);
    } else {
      await ShipService.createShippingMethod(currentMethod.value);
    }
    await fetchShippingMethods();
    closeModal();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const deleteShippingMethod = async (id: number) => {
  if (confirm('確定要刪除這個運輸方式嗎？')) {
    try {
      await ShipService.deleteShippingMethod(id);
      await fetchShippingMethods();
    } catch (error) {
      console.error('Error deleting shipping method:', error);
    }
  }
};
</script>

<style scoped>
.shipping-method-management {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

form div {
  margin-bottom: 10px;
}

label {
  display: inline-block;
  width: 100px;
}

input {
  width: 200px;
  padding: 5px;
}
</style>