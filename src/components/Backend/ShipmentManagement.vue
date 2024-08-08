<template>
  <div class="product-data-management">
    <h2>出貨</h2>
    <div class="product-table">
      <table>
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>用戶ID</th>
            <th>總金額</th>
            <th>獲得紅利</th>
            <th>創建時間</th>
            <th>訂單狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.userId }}</td>
            <td>{{ order.totalAmount }}</td>
            <td>{{ order.bonusPointsEarned }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)">
                <option value="準備發貨">準備發貨</option>
                <option value="已發貨">已發貨</option>
                <option value="已送達">已送達</option>
                <option value="已取消">已取消</option>
              </select>
            </td>
            <td>
              <button @click="viewOrderDetails(order.id)">查看訂單明細</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">
    <button @click="previousPage" :disabled="currentPage === 1">上一頁</button>
    <span>第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
  </div>

  <div v-if="showOrderDetailsModal" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h3>訂單明細 - 訂單號: {{ selectedOrderId }}</h3>
      <table>
        <thead>
          <tr>
            <th>獎品ID</th>
            <th>獎品詳情ID</th>
            <th>獎品詳情名稱</th>
            <th>數量</th>
            <th>單價</th>
            <th>總價</th>
            <th>結果狀態</th>
            <th>獲得的積分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detail in paginatedOrderDetails" :key="detail.id">
            <td>{{ detail.productId }}</td>
            <td>{{ detail.productDetailId }}</td>
            <td>{{ detail.productDetailName }}</td>
            <td>{{ detail.quantity }}</td>
            <td>{{ detail.unitPrice }}</td>
            <td>{{ detail.totalPrice }}</td>
            <td>{{ detail.resultStatus }}</td>
            <td>{{ detail.bonusPointsEarned }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAllOrder, getOrderDetailsByOrderId } from '@/services/api';
import { computed, onMounted, ref } from 'vue';

const orders = ref<any[]>([]);
const orderDetails = ref<any[]>([]);
const selectedOrderId = ref<number | null>(null);
const showOrderDetailsModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(() => {
  getOrder();
});

const getOrder = async () => {
  const res = await getAllOrder();
  orders.value = res.data;
};

const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return orders.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));

const formatDate = (dateArray: number[]) => {
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);

  return `${date.getFullYear()}年${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}月${date
    .getDate()
    .toString()
    .padStart(2, '0')}日${date
    .getHours()
    .toString()
    .padStart(2, '0')}時${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}分${date
    .getSeconds()
    .toString()
    .padStart(2, '0')}秒`;
};

const updateOrderStatus = async (orderId: number, newStatus: string) => {
  // try {
  //   await updateOrderStatusAPI(orderId, newStatus);
  //   console.log(`已更新訂單 ${orderId} 的狀態為 ${newStatus}`);
  // } catch (error) {
  //   console.error('Error updating order status:', error);
  // }
};

const viewOrderDetails = async (orderId: number) => {
  try {
    selectedOrderId.value = orderId;
    const res = await getOrderDetailsByOrderId(orderId);
    orderDetails.value = res.data;
    showOrderDetailsModal.value = true;
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const closeModal = () => {
  showOrderDetailsModal.value = false;
};

const paginatedOrderDetails = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return orderDetails.value.slice(startIndex, endIndex);
});
</script>

<style scoped>
.member-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  margin: 0;
}

.add-member-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}

.stat-item {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-content h3 {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 0;
  color: #4CAF50;
}

.search-section {
  margin-bottom: 20px;
}

.search-section input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

form button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
