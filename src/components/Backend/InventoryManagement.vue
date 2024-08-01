<template>
  <div class="inventory-management">
    <button class="add-member-button">新增進貨</button>
    <h2>進銷存管理</h2>
    <table border="1">
      <thead>
        <tr>
          <th>產品名稱</th>
          <th>數量</th>
          <th>等級</th>
          <th>創建時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(productDetail, index) in paginatedproductDetail" :key="index">
          <td>{{ productDetail.productName }}</td>
          <td>{{ productDetail.quantity }}</td>
          <td>{{ productDetail.grade }}</td>
          <td>{{ formatDate(productDetail.createDate) }}</td>
          <button @click="updateDetail(productDetail)">編輯</button>
          <button class="delete-button" @click="handleDetail(productDetail)">刪除</button>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 新增進貨 -->
  <div v-if="showCreateDetail" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="showCreateDetail = false">&times;</span>
      <h2>新增會員</h2>
      <form @submit.prevent="createDetail">
        <div>
          <label for="username">用戶名:</label>
          <input id="username" v-model="newMember.username" required>
        </div>
        <div>
          <label for="password">密碼:</label>
          <input id="password" v-model="newMember.password" type="password" required>
        </div>
        <div>
          <label for="nickname">暱稱:</label>
          <input id="nickname" v-model="newMember.nickname" required>
        </div>
        <div>
          <label for="email">電子郵件:</label>
          <input id="email" v-model="newMember.email" type="email" required>
        </div>
        <div>
          <label for="phoneNumber">電話號碼:</label>
          <input id="phoneNumber" v-model="newMember.phoneNumber" required>
        </div>
        <div>
          <label for="address">地址:</label>
          <input id="address" v-model="newMember.address" required>
        </div>
        <button type="submit">提交</button>
      </form>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { getDetail } from '@/services/api';
import { computed, onMounted, ref } from 'vue';
const currentPage = ref(1);
const detail = ref<any[]>([]);
const itemsPerPage = 10;

const fetchDetailData = async () => {
      try {
        const x  = await getDetail();
        console.log(x);
        
        detail.value = x.data;
        
      } catch (error) {
        console.error('獲取會員數據失敗:', error);
      }
    };

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

const totalPages = computed(() => Math.ceil(detail.value.length / itemsPerPage));

const paginatedproductDetail = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return detail.value.slice(start, end);
});

const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
      }
    };

    onMounted(() => {
      fetchDetailData();
    });

</script>

<style scoped>
.inventory-management {
  padding: 20px;
}

.inventory-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.inventory-management table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-management table,
.inventory-management th,
.inventory-management td {
  border: 1px solid #ddd;
}

.inventory-management th,
.inventory-management td {
  padding: 8px;
  text-align: left;
}

.inventory-management th {
  background-color: #f2f2f2;
}
</style>
