<template>
    <div>
      <h1>所有廠商訂單</h1>
      <table border="1">
        <thead>
          <tr>
            <th>廠商訂單編號</th>
            <th>訂單編號</th>
            <th>訊息代碼</th>
            <th>訊息內容</th>
            <th>快遞公司</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in vendorOrders" :key="order.vendorOrder">
            <td>{{ order.vendorOrder }}</td>
            <td>{{ order.orderNo }}</td>
            <td>{{ order.errorCode }}</td>
            <td>{{ order.errorMessage }}</td>
            <td>{{ order.express }}</td>
            <td>
            <select v-model="order.status" @change="updateVendorOrder(order)">
              <option value="未寄出">未寄出</option>
              <option value="已寄出">已寄出</option>
            </select>
          </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 當無類別時顯示 -->
      <p v-if="vendorOrders.length === 0">無類別</p>
    </div>
  </template>
  
  <script setup>
  import { getAllOrder, updateOrder } from '@/services/backend/vendorservice'; // 引入 API 函数
import { onMounted, ref } from 'vue';
  
  // 使用 ref 创建响应式状态
  const vendorOrders = ref([]);
  
  // 定义获取訂單資料的异步函数
  const fetchVendorOrders = async () => {
    try {
      // 调用 API 获取订单数据
      vendorOrders.value = await getAllOrder();
    } catch (error) {
      console.error('無法取得訂單資料', error);
    }
  };
  
  // 使用 onMounted 生命周期钩子调用函数
  onMounted(() => {
    fetchVendorOrders();
  });
  
  // 定义更新订单状态的函数（如果需要）
  const updateVendorOrder = async (order) => {
    try {
      const updatedOrder = await updateOrder(order);
      console.log('更新成功', updatedOrder);
      // 在这里你可以更新 vendorOrders 中的对应订单
    } catch (error) {
      console.error('無法更新訂單資料', error);
    }
  };
  </script>
  <style scoped>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  
  p {
    text-align: center;
    color: #888;
    font-style: italic;
  }
  </style>
  