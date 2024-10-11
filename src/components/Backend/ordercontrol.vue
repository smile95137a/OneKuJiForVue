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
            <th>建立物流訂單</th>
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
            <td>
              <button @click="openModal(order.orderNumber)" class="view-details-btn">建立物流訂單</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showOrderDetailsModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>
        <h2>訂單明細 - 訂單號: {{ selectedOrderId }}</h2>
        <table v-if="orderDetails && orderDetails.length" class="order-details-table">
          <thead>
            <tr>
              <th>產品 ID</th>
              <th>產品名稱</th>
              <th>數量</th>
              <th>單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in orderDetails" :key="detail.orderDetailId">
              <td>{{ detail.storeProduct?.storeProductId ?? detail.productDetailRes?.productDetailId ?? 'N/A' }}</td>
              <td>
                <!-- 判断 storeProduct 或 productDetailRes 是否为 null，显示相应信息 -->
                <div v-if="detail.storeProduct">
                  <p><strong></strong>{{ detail.storeProduct.productName }}</p>
                </div>
                <div v-else-if="detail.productDetailRes">
                  <p><strong></strong>{{ detail.productDetailRes.productName }}</p>
                </div>
                <div v-else>
                  <p>無產品</p>
                </div>
              </td>
              <td>{{ detail.quantity }}</td>
              <td>{{ formatCurrency(detail.unitPrice) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">無訂單詳情資料</p>
      </div>
    </div>


    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>建立物流訂單</h3>
        <form @submit.prevent="submitLogistics">
          <!-- 客戶訂單編號 -->
          <div>
            <label for="vendorOrder">客戶訂單編號：</label>
            <input type="text" v-model="logisticsRequest.vendorOrder" readonly />
          </div>

          <!-- 物流方式選擇 -->
          <div>
            <label for="logisticsMode">物流方式：</label>
            <select v-model="logisticsRequest.logisticsMode">
              <option value="store">便利商店配送</option>
            </select>
          </div>

          <!-- 便利商店配送 -->
          <div v-if="logisticsRequest.logisticsMode === 'store'">
            <div>
              <label for="storeId">門市代號：</label>
              <input type="text" v-model="logisticsRequest.storeId" />
            </div>
            <div>
              <label for="opMode">通路代號：</label>
              <select v-model="logisticsRequest.opMode">
                <option value="1">全家</option>
                <option value="3">統一超商</option>
              </select>
            </div>
            <div>
              <label for="amount">交易金額：</label>
              <input type="number" v-model="logisticsRequest.amount" />
            </div>
            <div>
              <label for="senderName">商品價值:</label>
              <input type="text" v-model="logisticsRequest.orderAmount" />
            </div>
            <div>
              <label for="senderName">寄件人姓名：</label>
              <input type="text" v-model="logisticsRequest.senderName" />
            </div>
            <div>
              <label for="sendMobilePhone">寄件人手機電話：</label>
              <input type="text" v-model="logisticsRequest.sendMobilePhone" />
            </div>
            <div>
              <label for="receiverName">取貨人姓名：</label>
              <input type="text" v-model="logisticsRequest.receiverName" />
            </div>
            <div>
              <label for="receiverMobilePhone">取貨人手機電話：</label>
              <input type="text" v-model="logisticsRequest.receiverMobilePhone" />
            </div>
            <div>
              <label for="shipmentDate">出貨日期：</label>
              <input type="date" v-model="logisticsRequest.shipmentDate" />
            </div>
          </div>
          <!-- 提交和取消按鈕 -->
          <div>
            <button type="submit">提交訂單</button>
            <button type="button" @click="closeModal2">取消</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { Order, OrderDetail } from '@/interfaces/order';
import { convenience, getAllOrder, xxx } from '@/services/backend/orderservice';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const orders = ref<Order[]>([]);
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



const showModal = ref(false);
const logisticsRequest = ref({
  vendorOrder: '', // 示例訂單編號
  logisticsMode: '', // 儲存物流方式
  storeId: '', // 便利商店門市代號
  opMode: '', // 通路代號
  receiverName: '', // 取貨人姓名
  receiverMobilePhone: '', // 取貨人手機
  thermosphere: '', // 黑貓溫層
  spec: '', // 黑貓規格
  serviceType: '', // 固定黑貓的服務型態代碼
  amount: '', // 金額
  senderName: '', // 寄件人姓名
  sendMobilePhone: '', // 寄件人手機
  shipmentDate: '', // 出貨日期
  orderAmount: '',//商品價值
  recipientAddress: '',//取貨人地址
  senderZipCode: '',//寄件人郵碼
  senderAddress: '',// 寄件人地址
  deliveryDate: '', // 希望配達日期 (yyyy-MM-dd)
  senderMobile: '', //黑貓寄件人手機
  recipientName: '', //黑貓取貨人姓名
  recipientMobile: '', //// 取貨人手機電話
  deliveryTime: '',
});

// 開啟對話框並設置訂單編號
const openModal = (orderNumber: any) => {
  const filteredOrder = orders.value.find(order => order.orderNumber === orderNumber);
  if (filteredOrder) {
    logisticsRequest.value.vendorOrder = filteredOrder.orderNumber; // 設置訂單號
    logisticsRequest.value.storeId = filteredOrder.shopId;
    logisticsRequest.value.opMode = filteredOrder.opmode; // 初始化 opMode
    logisticsRequest.value.amount = filteredOrder.totalAmount; // 初始化交易金額
    logisticsRequest.value.receiverName = filteredOrder.shippingName; // 初始化取貨人姓名
    logisticsRequest.value.receiverMobilePhone = filteredOrder.shippingPhone; // 初始化取貨人手機
    showModal.value = true;
  }
};


// 關閉對話框
const closeModal2 = () => {
  showModal.value = false;
};

// 提交物流訂單
const submitLogistics = async () => {
  try {
    const response = await convenience(logisticsRequest.value);
    alert('物流訂單已建立：' + response);
    closeModal2();
  } catch (error) {
    alert('建立訂單失敗：' + error.response.data.message);
  }
};


const fetchPostNumber = async () => {
  try {
    console.log('Sender Address:', logisticsRequest.value.senderAddress);
    const address = { address: logisticsRequest.value.senderAddress };
    const response = await axios.post('http://localhost:8080/api/express/getAddress', address);
    const result = response.data;

    // 從返回的字符串中提取 PostNumber
    const postNumber = extractPostNumber(result);
    if (postNumber) {
      logisticsRequest.value.senderZipCode = postNumber;
    } else {
      alert('未找到郵遞區號');
    }
  } catch (error) {
    console.error('獲取郵遞區號失敗:', error);
    alert('查詢郵遞區號失敗，請稍後重試');
  }
};

const extractPostNumber = (responseString: string) => {
  const parts = responseString.split(',');
  for (const part of parts) {
    if (part.startsWith('PostNumber=')) {
      return part.split('=')[1];
    }
  }
  return null;
};


// 當前選中的訂單 ID
const selectedOrderId = ref<number | null>(null);
const showOrderDetailsModal = ref(false);
const orderDetails = ref<OrderDetail[]>([]);

// 過濾訂單，這裡你可以應用自己的過濾邏輯
const filteredOrders = ref(orders.value);

// 格式化貨幣
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(value);
};

// 更新訂單狀態
const updateOrderStatus = async (order) => {
  try {
    
    const response = await xxx(order.id , order.resultStatus);
    if (response.ok) {
      const updatedOrder = await response.json();
      console.log('订单状态更新成功', updatedOrder);
    } else {
      console.error('更新订单状态失败', response.status);
    }
  } catch (error) {
    console.error('请求失败', error);
  }
};
// 查看訂單詳情
const viewOrderDetails = (orderId: number) => {
  const order = orders.value.find((o) => o.id === orderId);
  if (order) {
    orderDetails.value = order.orderDetails;
    selectedOrderId.value = orderId;
    showOrderDetailsModal.value = true;
  }
};

// 關閉訂單詳情模態框
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

.order-table,
.order-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-table th,
.order-table td,
.order-details-table th,
.order-details-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.order-table th,
.order-details-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.order-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.status-select,
.view-details-btn {
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
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明背景 */
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin-bottom: 15px;
  font-size: 1.5em;
  color: #333;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.modal input,
.modal select {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}

.modal input[type="date"],
.modal input[type="number"] {
  max-width: 100%;
}

.modal button {
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.modal button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  margin-right: 10px;
}

.modal button[type="button"] {
  background-color: #f44336;
  color: white;
}

.modal button:hover {
  opacity: 0.9;
}
body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }
        .modal {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .close-button {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        .close-button:hover {
            color: #555;
        }
        h2 {
            color: #333;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #eee;
            padding-bottom: 0.5rem;
        }
        .order-details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .order-details-table th, .order-details-table td {
            text-align: left;
            padding: 0.75rem;
            border-bottom: 1px solid #eee;
        }
        .order-details-table th {
            background-color: #f8f8f8;
            font-weight: bold;
            color: #333;
        }
        .order-details-table tr:last-child td {
            border-bottom: none;
        }
        .order-details-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .no-data {
            text-align: center;
            color: #888;
            font-style: italic;
            margin-top: 2rem;
        }
</style>
