<template>
  <div class="order-management">
    <h1 class="title">訂單管理</h1>

    <!-- 新增篩選按鈕 -->
    <div class="filter-buttons">
      <button @click="filterOrders('SHIPPED')" class="filter-btn">
        已發貨
      </button>
      <button @click="filterOrders('PREPARING_SHIPMENT')" class="filter-btn">
        未發貨
      </button>
      <button @click="filterOrders('')" class="filter-btn">全部訂單</button>
      <button @click="filterOrders('NO_PAY')" class="filter-btn">未付款</button>
      <!-- 改成未付款 -->
    </div>

    <div class="order-table-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>收件人姓名</th>
            <th>總金額</th>
            <th>運送方式</th>
            <th>運費</th>
            <th>出貨總數</th>
            <th>創建時間</th>
            <th>訂單狀態</th>
            <th>訂單明細</th>
            <th>出貨單</th>
            <th>建立物流訂單</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.billingName }}</td>
            <td>{{ order.totalAmount }} 元</td>
            <td>{{ order.shippingMethod }}</td>
            <td>{{ order.shippingCost }} 元</td>
            <td>{{ order.orderCount }} 個</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <select
                v-model="order.resultStatus"
                @change="updateOrderStatus(order)"
                class="status-select"
              >
                <option
                  v-for="status in availableStatuses(order.resultStatus)"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </td>

            <td>
              <button
                @click="viewOrderDetails(order.id)"
                class="view-details-btn"
              >
                查看訂單明細
              </button>
            </td>
            <td>
              <button
                @click="viewShippingInfo(order.id)"
                class="view-details-btn"
              >
                出貨單
              </button>
            </td>
            <td>
              <button
                @click="openModal(order.orderNumber)"
                class="view-details-btn"
              >
                建立物流訂單
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 寄送信息弹出视窗 -->
    <!-- 寄送資訊模態 -->
    <div v-if="showShippingInfoModal" class="modal">
      <div class="shipping-note">
        <span class="close-button" @click="closeShippingInfoModal"
          >&times;</span
        >
        <div class="header">
          <h1>出貨單</h1>
        </div>
        <div class="info-section">
          <div class="left-section">
            <h3>寄送資訊</h3>
            <p><strong>Email:</strong> {{ orderShippingInfo.shippingEmail }}</p>
            <p><strong>姓名:</strong> {{ orderShippingInfo.shippingName }}</p>
            <p><strong>電話:</strong> {{ orderShippingInfo.shippingPhone }}</p>
            <p>
              <strong>物流方式:</strong> {{ orderShippingInfo.shippingMethod }}
            </p>
            <p
              v-if="
                orderShippingInfo.shippingMethod === '711' ||
                orderShippingInfo.shippingMethod === '全家'
              "
            >
              <strong>門市代號:</strong> {{ orderShippingInfo.storeCode }}<br />
              <strong>門市名稱:</strong> {{ orderShippingInfo.storeName }}<br />
              <strong>門市地址:</strong> {{ orderShippingInfo.storeAddress }}
            </p>
            <p v-else>
              <strong>寄送地址:</strong> {{ orderShippingInfo.shippingAddress }}
            </p>
            <p>
              <strong>物流單號:</strong>
              <span v-if="!isEditing">{{
                orderShippingInfo.trackingNumber || '無'
              }}</span>
              <input
                v-else
                v-model="orderShippingInfo.trackingNumber"
                type="text"
                placeholder="輸入物流單號"
                class="tracking-input"
              />
            </p>
            <div class="button-group">
              <button
                v-if="!isEditing"
                @click="toggleEdit"
                class="edit-btn highlight-btn"
              >
                編輯
              </button>
              <button
                v-else
                @click="saveTrackingNumber"
                class="save-btn highlight-btn"
              >
                保存
              </button>
            </div>
          </div>
          <div class="right-section">
            <h3>訂單資訊</h3>
            <p><strong>訂單編號:</strong> {{ orderInfo.orderNumber }}</p>
            <p>
              <strong>訂單日期:</strong> {{ formatDate(orderInfo.createdAt) }}
            </p>
            <p><strong>訂單總額:</strong> {{ orderInfo.totalAmount }} 元</p>
            <p><strong>運費總額:</strong> {{ orderInfo.shippingCost }} 元</p>
            <p><strong>商品總數:</strong> {{ orderDetails.length }} 件</p>
          </div>
        </div>
        <div class="product-list">
          <h3>商品列表</h3>
          <table>
            <thead>
              <tr>
                <th>商品名稱</th>
                <th>獎品名稱</th>
                <th>商品圖片</th>
                <th>類型</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="detail in orderDetails"
                :key="detail.productDetailRes.productDetailId"
              >
                <td>{{ detail.productName }}</td>
                <td>{{ detail.productDetailRes.productName || '無' }}</td>
                <td>
                  <img
                    :src="formatImageUrl(detail.imageUrls[0])"
                    alt="商品圖片"
                    style="width: 100px; height: 100px"
                  />
                </td>
                <td>{{ detail.grade }}</td>
                <td>{{ detail.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showOrderDetailsModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>
        <h2>訂單明細 - 訂單號: {{ selectedOrderId }}</h2>
        <table
          v-if="orderDetails && orderDetails.length"
          class="order-details-table"
        >
          <thead>
            <tr>
              <th>產品 ID</th>
              <th>商品名稱</th>
              <th>產品名稱</th>
              <th>產品圖片</th>
              <th>數量</th>
              <th>單價</th>
              <th>類型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in orderDetails" :key="detail.orderDetailId">
              <td>
                {{
                  detail.storeProduct?.storeProductId ??
                  detail.productDetailRes?.productDetailId ??
                  'N/A'
                }}
              </td>
              <td>
                {{ detail.pname }}
              </td>
              <td>
                <!-- 判断 storeProduct 或 productDetailRes 是否为 null，显示相应信息 -->
                <div v-if="detail.storeProduct">
                  <p>
                    <strong>{{ detail.storeProduct.productName }}</strong>
                  </p>
                </div>
                <div v-else-if="detail.productDetailRes">
                  <p>
                    <strong>{{ detail.productDetailRes.productName }}</strong>
                  </p>
                </div>

                <div v-else>
                  <p>無產品</p>
                </div>
              </td>

              <td>
                <div
                  v-if="detail.storeProduct && detail.storeProduct.imageUrls"
                >
                  <img
                    :src="formatImageUrl(detail.storeProduct.imageUrls[0])"
                    alt="Product Image"
                    style="width: 100px; height: 100px"
                  />
                </div>
                <div
                  v-else-if="
                    detail.productDetailRes && detail.productDetailRes.imageUrls
                  "
                >
                  <img
                    :src="formatImageUrl(detail.productDetailRes.imageUrls[0])"
                    alt="Product Image"
                    style="width: 100px; height: 100px"
                  />
                </div>
              </td>
              <td>{{ detail.quantity }}</td>
              <td>{{ detail.unitPrice }}元</td>
              <td>
                <div v-if="detail.productDetailRes.productDetailId">
                  <p>
                    <strong>{{ detail.productDetailRes.grade }}賞</strong>
                  </p>
                </div>
                <div v-else>
                  <p><strong>商城商品</strong></p>
                </div>
              </td>
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
            <input
              type="text"
              v-model="logisticsRequest.vendorOrder"
              readonly
            />
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
              <input
                type="text"
                v-model="logisticsRequest.receiverMobilePhone"
              />
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
import {
  convenience,
  getAllOrder,
  getAllVendor,
  saveTrackingNumberAPI,
  xxx,
} from '@/services/backend/orderservice';
import { productservice } from '@/services/backend/productservice';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
const isEditing = ref(false);
const orders = ref<Order[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const currentFilter = ref<string>(''); // 訂單狀態篩選
const showShippingInfoModal = ref(false); // 控制寄送信息弹出视窗的显示
const orderShippingInfo = ref(null); // 存储寄送信息
const orderInfo = ref(null);
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveTrackingNumber = async () => {
  isEditing.value = false;
  console.log('保存物流單號:', orderShippingInfo.value.trackingNumber);
  try {
    // 調用後端 API 保存物流單號
    const response = await saveTrackingNumberAPI({
      orderId: selectedOrderId.value,
      trackingNumber: orderShippingInfo.value.trackingNumber,
    });
    console.log('物流單號保存成功:', response.data);
  } catch (error) {
    console.error('保存物流單號時出錯:', error);
  }
};
const viewShippingInfo = async (orderId: number | null) => {
  const order = orders.value.find((o) => o.id === orderId); // 根據訂單 ID 查找訂單
  const vendor = await getAllVendor(order?.orderNumber);
  if (order) {
    // 設置寄送資訊
    orderShippingInfo.value = {
      shippingEmail: order.shippingEmail, // 若無 email，顯示 N/A
      nickname: order.nickname || '無暱稱',
      shippingName: order.shippingName || '無收件人',
      shippingPhone: order.shippingPhone || '無電話',
      shippingMethod: order.shippingMethod || '無物流方式',
      shippingAddress: `${order.shippingCity || ''} ${
        order.shippingArea || ''
      } ${order.shippingAddress || ''}`,
      storeCode: order.shopId || '無',
      storeName: order.shopName || '無',
      storeAddress: order.shopAddress || '無',
      trackingNumber: null, // 若無物流單號
    };
    if (vendor?.data?.orderNo) {
      orderShippingInfo.value.trackingNumber = vendor.data.orderNo.slice(0, 8);
    }
    // 設置訂單資訊
    orderInfo.value = {
      orderNumber: order.orderNumber || '未知訂單號',
      createdAt: order.createdAt || [],
      totalAmount: order.totalAmount || 0,
      shippingCost: order.shippingCost || 0,
      orderDetails: order.orderDetails || [],
      opmode: order.opmode || '無',
    };

    // 合併訂單商品明細
    const mergedOrderDetails: any[] = [];
    order.orderDetails.forEach((detail) => {
      const existingDetail = mergedOrderDetails.find(
        (d) => d.productDetailId === detail.productDetailRes?.productDetailId
      );

      if (existingDetail) {
        // 如果相同的商品已存在，累加數量
        existingDetail.quantity += detail.quantity;
      } else {
        // 判断是 `productDetail` 还是 `storeProduct`
        const isProductDetail = !!detail.productDetailRes?.productDetailId; // 是否存在 productDetailId
        const grade = isProductDetail
          ? `${detail.productDetailRes?.grade || 'N/A'}賞` // `productDetail` 情况
          : '商城商品'; // `storeProduct` 情况

        // 新增新的商品明細
        mergedOrderDetails.push({
          productName: detail.productName || '無名稱',
          productDetailRes: detail.productDetailRes || {},
          imageUrls: detail.imageUrls || [],
          grade: grade,
          quantity: detail.quantity || 0,
        });
      }
    });

    orderDetails.value = mergedOrderDetails; // 更新商品明細
    selectedOrderId.value = orderId; // 設置選中的訂單 ID
    showShippingInfoModal.value = true; // 顯示寄送資訊彈窗
  }
};

const closeShippingInfoModal = () => {
  showShippingInfoModal.value = false;
  orderShippingInfo.value = null; // 清除寄送信息
};

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

  if (status === 'NO_PAY') {
    // 篩選出未付款的訂單
    filteredOrders.value = orders.value.filter(
      (order) => order.resultStatus === 'NO_PAY'
    );
  } else if (status) {
    filteredOrders.value = orders.value.filter(
      (order) => order.resultStatus === status
    );
  } else {
    filteredOrders.value = orders.value; // 顯示所有訂單
  }
};

const _paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredOrders.value.slice(startIndex, endIndex);
});

const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage)
);

function formatDate(dateArray: [any, any, any, any, any, any]) {
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);

  const pad = (num: { toString: () => string }) =>
    num.toString().padStart(2, '0');

  return `${year} 年 ${pad(month)} 月 ${pad(day)} 日 ${pad(hour)} 時 ${pad(
    minute
  )} 分 ${pad(second)} 秒`;
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
  orderAmount: '', //商品價值
  recipientAddress: '', //取貨人地址
  senderZipCode: '', //寄件人郵碼
  senderAddress: '', // 寄件人地址
  deliveryDate: '', // 希望配達日期 (yyyy-MM-dd)
  senderMobile: '', //黑貓寄件人手機
  recipientName: '', //黑貓取貨人姓名
  recipientMobile: '', //// 取貨人手機電話
  deliveryTime: '',
});

// 開啟對話框並設置訂單編號
const openModal = (orderNumber: any) => {
  const filteredOrder = orders.value.find(
    (order) => order.orderNumber === orderNumber
  );
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
    const response = await axios.post(
      'http://localhost:8080/api/express/getAddress',
      address
    );
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

const formatImageUrl = (url: string | File): string => {
  if (typeof url === 'string') {
    return url.trim() !== '' ? productservice.getImageUrl(url) : '';
  }
  console.log(url);

  return URL.createObjectURL(url);
};

// 當前選中的訂單 ID
const selectedOrderId = ref<number | null>(null);
const showOrderDetailsModal = ref(false);
const orderDetails = ref<OrderDetail[]>([]);

// 過濾訂單，這裡你可以應用自己的過濾邏輯
const filteredOrders = ref(orders.value);

// 更新訂單狀態
const updateOrderStatus = async (order) => {
  try {
    const response = await xxx(order.id, order.resultStatus);
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
    orderDetails.value = [...order.orderDetails];
    selectedOrderId.value = orderId;
    showOrderDetailsModal.value = true;
  }
};

const availableStatuses = (currentStatus: string) => {
  const allStatuses = [
    { value: 'PREPARING_SHIPMENT', label: '準備發貨' },
    { value: 'SHIPPED', label: '已發貨' },
    { value: 'SOLD_OUT', label: '售罄' },
    { value: 'NO_PAY', label: '未付款' },
    { value: 'FAILED_PAYMENT', label: '付款失敗' },
  ];
  // 如果是 NO_PAY 或 FAILED_PAYMENT，不顯示其他選項
  if (currentStatus === 'NO_PAY' || currentStatus === 'FAILED_PAYMENT') {
    return allStatuses.filter((status) => status.value === currentStatus);
  }
  // 僅允許更改為準備發貨或已發貨
  return allStatuses.filter((status) =>
    ['PREPARING_SHIPMENT', 'SHIPPED'].includes(status.value)
  );
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
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.order-table-container {
  max-height: 5000px;
  /* 根据需要调整高度 */
  overflow-y: auto;
  /* 启用垂直滚动 */
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
  background-color: #4caf50;
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
  background-color: #4caf50;
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

.modal input[type='date'],
.modal input[type='number'] {
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

.modal button[type='submit'] {
  background-color: #4caf50;
  color: white;
  margin-right: 10px;
}

.modal button[type='button'] {
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
  background-color: rgba(0, 0, 0, 0.5);
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

.order-details-table th,
.order-details-table td {
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

.small-image {
  max-width: 100px;
  max-height: 100px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 背景半透明 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* 確保在最上層 */
}

.modal-content {
  width: 80%;
  /* 設置為螢幕寬度的 80% */
  max-width: 1200px;
  /* 設置最大寬度，避免過大 */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  /* 使內容超出時可滾動 */
  max-height: 80%;
  /* 最大高度 */
}

/* 寄送資訊模態 */
.shipping-info table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.shipping-info th,
.shipping-info td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.shipping-info th {
  background-color: #f2f2f2;
}

.no-shipping-info {
  text-align: center;
  margin-top: 10px;
  color: #888;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.shipping-note {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

.shipping-note .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.shipping-note .header h1 {
  margin: 0;
}

.shipping-note .close-button {
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
}

.shipping-note .close-button:hover {
  color: red;
}

.info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left-section,
.right-section {
  width: 48%;
}

.left-section h3,
.right-section h3 {
  margin-bottom: 10px;
  color: #555;
}

.product-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.product-list th,
.product-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.product-list th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.product-list img {
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 按鈕樣式 */
.button-group {
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.save-btn {
  background-color: #007bff;
  color: white;
}

button:focus {
  outline: none;
}

/* 高亮樣式 */
.highlight-btn {
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 輸入框樣式 */
.tracking-input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 隱藏按鈕於列印或導出 PDF */
@media print {
  .button-group,
  .highlight-btn {
    display: none;
  }
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  table-layout: auto;
}

th,
td {
  padding: 10px;
  text-align: left;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr:hover {
}

td {
  min-width: 160px;
}
</style>
