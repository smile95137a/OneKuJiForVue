<template>
  <div class="member-management">
    <div class="header">
      <div class="title-and-button">
        <h2 class="title">會員管理</h2>
        <button class="add-member-button" @click="showAddMemberModal = true">新增會員</button>
      </div>
    </div>
    <div class="stats">
      <div class="stat-item" v-for="(item, index) in statItems" :key="index">
        <h3>{{ item.title }}</h3>
        <p>{{ item.value }}</p>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>會員類型</th>
            <th>會員編號</th>
            <th>姓名</th>
            <th>電話</th>
            <th>居住地址</th>
            <th>最近修改時間</th>
            <th>最近修改人</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in paginatedMembers" :key="index">
            <td>{{ member.userType }}</td>
            <td>{{ member.id }}</td>
            <td>{{ member.nickname }}</td>
            <td>{{ member.phoneNumber }}</td>
            <td>{{ member.address }}</td>
            <td>{{ member.updatedAt }}</td>
            <td>{{ member.username }}</td>
            <td>{{ member.status }}</td>
            <td>
              <button>編輯</button>
              <button class="delete-button">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">上一頁</button>
      <span>第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
    </div>

    <div v-if="showAddMemberModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showAddMemberModal = false">&times;</span>
        <h2>新增會員</h2>
        <form @submit.prevent="addMember">
          <div>
            <label for="username">用戶名:</label>
            <input type="text" id="username" v-model="newMember.username" required>
          </div>
          <div>
            <label for="password">密碼:</label>
            <input type="password" id="password" v-model="newMember.password" required>
          </div>
          <div>
            <label for="nickname">暱稱:</label>
            <input type="text" id="nickname" v-model="newMember.nickname" required>
          </div>
          <div>
            <label for="email">電子郵件:</label>
            <input type="email" id="email" v-model="newMember.email" required>
          </div>
          <div>
            <label for="phoneNumber">電話:</label>
            <input type="text" id="phoneNumber" v-model="newMember.phoneNumber" required>
          </div>
          <div>
            <label for="address">地址:</label>
            <input type="text" id="address" v-model="newMember.address" required>
          </div>
          <div>
            <label for="balance">餘額:</label>
            <input type="number" id="balance" v-model="newMember.balance" required>
          </div>
          <div>
            <label for="bonusPoints">紅利點數:</label>
            <input type="number" id="bonusPoints" v-model="newMember.bonusPoints" required>
          </div>
          <div>
            <label for="userType">會員類型:</label>
            <select id="userType" v-model="newMember.userType" required>
              <option value="REGULAR">正式會員</option>
              <option value="TRIAL">體驗會員</option>
            </select>
          </div>
          <div>
            <label for="status">狀態:</label>
            <input type="text" id="status" v-model="newMember.status" required>
          </div>
          <button type="submit">提交</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import apiClient from '@/interceptors/jwtInterceptor.ts'; // 確保路徑正確
import { computed, defineComponent, onMounted, ref } from 'vue';

interface Member {
  id: number;
  username: string;
  password: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  roles: Array<{ id: number; name: string }>;
  balance: number;
  bonusPoints: number;
  lastTopUpTime: string;
  userType: string;
  roleId: number;
  status: string;
}

export default defineComponent({
  name: 'MemberManagement',
  setup() {
    const totalMembers = ref(0);
    const regularMembers = ref(0);
    const trialMembers = ref(0);
    const newMembersThisMonth = ref(0);
    const members = ref<Member[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showAddMemberModal = ref(false);
    const newMember = ref<Member>({
      id: 1,
      username: '',
      password: '',
      nickname: '',
      email: '',
      phoneNumber: '',
      address: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: [{ id: 0, name: 'string' }],
      balance: 0,
      bonusPoints: 0,
      lastTopUpTime: new Date().toISOString(),
      userType: 'REGULAR',
      roleId: 2,
      status: 'Y等於啟用 N等於未啟用'
    });

    const statItems = ref([
      { title: '會員總數', value: 0 },
      { title: '正式會員', value: 0 },
      { title: '體驗會員', value: 0 },
      { title: '當月新增', value: 0 }
    ]);

    const fetchMemberData = async () => {
      try {
        const response = await apiClient.get('/api/user/count');
        const data = response.data;

        statItems.value = [
          { title: '會員總數', value: data.additionalProp1 },
          { title: '正式會員', value: data.additionalProp2 },
          { title: '體驗會員', value: data.additionalProp3 },
          { title: '當月新增', value: 0 }  // 假設當月新增需要其他 API 來獲取
        ];
      } catch (error) {
        console.error('Failed to fetch member data:', error);
      }
    };

    const fetchMembersList = async () => {
      try {
        const response = await apiClient.get('/api/user/query');
        const data = response.data;

        members.value = data;
        // 在此更新其他數據如當月新增數據
      } catch (error) {
        console.error('Failed to fetch members list:', error);
      }
    };

    const addMember = async () => {
      try {
        const response = await apiClient.post('/api/user/add', newMember.value);
        if (response.status === 201) {
          fetchMembersList(); // 重新獲取會員列表
          showAddMemberModal.value = false;
        } else {
          console.error('Failed to add member:', response.data);
        }
      } catch (error) {
        console.error('Failed to add member:', error);
      }
    };

    onMounted(() => {
      fetchMemberData();
      fetchMembersList();
    });

    const totalPages = computed(() => Math.ceil(members.value.length / itemsPerPage));
    const paginatedMembers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return members.value.slice(start, end);
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

    return {
      totalMembers,
      regularMembers,
      trialMembers,
      newMembersThisMonth,
      members,
      currentPage,
      totalPages,
      paginatedMembers,
      nextPage,
      previousPage,
      statItems,
      showAddMemberModal,
      newMember,
      addMember,
    };
  },
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

.member-management {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.title-and-button {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  font-size: 24px;
  margin: 0;
}

.add-member-button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.add-member-button:hover {
  background-color: #45a049;
}

.stats {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.stat-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #3f51b5;
  color: #fff;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #303f9f;
}

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #3f51b5;
  color: #fff;
  margin: 0 10px;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
}

/* Modal styles */
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
  background-color: #fff;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
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

form input, form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
