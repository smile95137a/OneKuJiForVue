<template>
  <div class="order-management">
    <h1 class="title">訂單管理</h1>

    <!-- 新增篩選按鈕 -->
    <div class="filter-buttons">
  <button @click="filterOrders('SHIPPED')" class="filter-btn">已發貨</button>
  <button @click="filterOrders('PREPARING_SHIPMENT')" class="filter-btn">未發貨</button>
  <button @click="filterOrders('')" class="filter-btn">全部訂單</button>
  <button @click="filterOrders('UNSELECTED')" class="filter-btn">未選擇狀態</button> <!-- 新增的按鈕 -->
</div>


    <div class="order-table-container">
      <table class="order-table">
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
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.userId }}</td>
            <td>{{ formatCurrency(order.totalAmount) }}</td>
            <td>{{ order.bonusPointsEarned ?? 'N/A' }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <select v-model="order.resultStatus" @change="updateOrderStatus(order)" class="status-select">
                <option value="PREPARING_SHIPMENT">準備發貨</option>
                <option value="SHIPPED">已發貨</option>
              </select>
            </td>
            <td>
              <button @click="viewOrderDetails(order.id)" class="view-details-btn">查看訂單明細</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">上一頁</button>
      <span class="page-info">第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">下一頁</button>
    </div>

    <div v-if="showOrderDetailsModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>
        <h2>訂單明細 - 訂單號: {{ selectedOrderId }}</h2>
        <table v-if="orderDetails && orderDetails.length" class="order-details-table">
          <thead>
            <tr>
              <th>產品 ID</th>
              <th>商店產品名稱</th>
              <th>產品詳細名稱</th>
              <th>數量</th>
              <th>單價</th>
              <th>結果狀態</th>
              <th>獲得的獎勳點數</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in orderDetails" :key="detail.id">
              <td>{{ detail.productId }}</td>
              <td>{{ detail.storeProductName }}</td>
              <td>{{ detail.productDetailName }}</td>
              <td>{{ detail.quantity }}</td>
              <td>{{ formatCurrency(detail.unitPrice) }}</td>
              <td>{{ detail.resultStatus }}</td>
              <td>{{ detail.bonusPointsEarned ?? 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">無訂單詳情資料</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Order, OrderDetail } from '@/interfaces/order';
import { getAllOrder, getOrderDetailsByOrderId, updateOrder } from '@/services/backend/orderservice';
import { computed, onMounted, ref } from 'vue';

const orders = ref<Order[]>([]);
const filteredOrders = ref<Order[]>([]);
const orderDetails = ref<OrderDetail[]>([]);
const selectedOrderId = ref<number | null>(null);
const showOrderDetailsModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const currentFilter = ref<string>(''); // 訂單狀態篩選

onMounted(() => {
  loadOrders();
});

const loadOrders = async () => {
  try {
    orders.value = await getAllOrder();
    filteredOrders.value = orders.value; // 初始化為所有訂單
  } catch (error) {
    console.error('Error loading orders:', error);
  }
};

// 根據篩選條件過濾訂單
const filterOrders = (status: string) => {
  currentFilter.value = status;
  
  if (status === 'UNSELECTED') {
    // 篩選出狀態為 null 或未定義的訂單
    filteredOrders.value = orders.value.filter(order => !order.resultStatus);
  } else if (status) {
    filteredOrders.value = orders.value.filter(order => order.resultStatus === status);
  } else {
    filteredOrders.value = orders.value; // 顯示所有訂單
  }
};


const _paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredOrders.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));

function formatDate(dateArray: [any, any, any, any, any, any]) {
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);

  const pad = (num: { toString: () => string; }) => num.toString().padStart(2, '0');

  return `${year} 年 ${pad(month)} 月 ${pad(day)} 日 ${pad(hour)} 時 ${pad(minute)} 分 ${pad(second)} 秒`;
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(value);
};

const updateOrderStatus = async (order: Order) => {
  try {
    await updateOrder(order.id, { resultStatus: order.resultStatus });
    console.log(`已更新訂單 ${order.id} 的狀態為 ${order.resultStatus}`);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

const viewOrderDetails = async (orderId: number) => {
  try {
    selectedOrderId.value = orderId;
    const response = await getOrderDetailsByOrderId(orderId);
    orderDetails.value = Array.isArray(response) ? response : [response];
    showOrderDetailsModal.value = true;
  } catch (error) {
    console.error('Error fetching order details:', error);
    orderDetails.value = [];
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const closeModal = () => {
  showOrderDetailsModal.value = false;
};
</script>

<style scoped>
.order-management {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.filter-buttons {
  margin-bottom: 20px;
  text-align: center;
}

.filter-btn {
  padding: 10px 20px;
  margin: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.order-table-container {
  overflow-x: auto;
}

.order-table, .order-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-table th, .order-table td,
.order-details-table th, .order-details-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.order-table th, .order-details-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.order-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.status-select, .view-details-btn {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.view-details-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  margin: 0 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.page-info {
  margin: 0 15px;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
