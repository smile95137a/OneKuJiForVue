<template>
  <div class="product-data-management">
    <h2>出貨</h2>
    <div class="product-table">
      <table>
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>用戶id</th>
            <th>總金額</th>
            <th>獲得紅利</th>
            <th>創建時間</th>
            <th>訂單狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.orderId">
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.userId }}</td>
            <td>{{ order.totalAmount }}</td>
            <td>{{ order.bonusPointsEarned }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <!-- <select v-model="order.status">
                <option value="AVAILABLE">上架</option>
                <option value="UNAVAILABLE">下架</option>
                <option value="NOT_AVAILABLE_YET">尚未上架</option>
                <option value="SOLD_OUT">上架已售完</option>
              </select> -->
              {{order.status}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAllOrder } from '@/services/api';
import { onMounted, ref } from 'vue';

const orders = ref<any[]>([]);

onMounted(() => {
  getOrder();
    });


const getOrder = async () => {
  const res = await getAllOrder();
  orders.value = res.data;
}


const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };


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
