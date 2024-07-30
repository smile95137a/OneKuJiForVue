<template>
  <div class="member-management">
    <div class="header">
      <div class="title-and-button">
        <h2 class="title">會員管理</h2>
        <button class="add-member-button" @click="showAddMemberModal = true">新增會員</button>
        <button class="search-member-button" @click="showSearchMemberModal = true">查詢會員</button>
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
            <td>
              <select v-model="member.status">
                <option value="啟用">啟用</option>
                <option value="未啟用">未啟用</option>
              </select>
            </td>
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
          <!-- 其他表單元素保持不變 -->
          <div>
            <label for="status">狀態:</label>
            <select id="status" v-model="newMember.status" required>
              <option value="啟用">啟用</option>
              <option value="未啟用">未啟用</option>
            </select>
          </div>
          <button type="submit">提交</button>
        </form>
      </div>
    </div>

    <div v-if="showSearchMemberModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showSearchMemberModal = false">&times;</span>
        <h2>查詢會員</h2>
        <form @submit.prevent="searchMember">
          <div>
            <label for="searchInput">查詢條件:</label>
            <input type="text" id="searchInput" v-model="searchInput" placeholder="輸入電話、ID、email等" required>
          </div>
          <button type="submit">查詢</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Member } from '@/interfaces/Member';
import { addUser, getUserById, getUsers, setAuthToken } from '@/services/api'; // 確保路徑正確
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'MemberManagement',
  setup() {
    const totalMembers = ref(0);
    const regularMembers = ref(0);
    const trialMembers = ref(0);
    const members = ref<Member[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showAddMemberModal = ref(false);
    const showSearchMemberModal = ref(false);
    const searchInput = ref('');
    const currentUser = ref(''); // 当前登录用户

    const newMember = ref<Member>({
      id: 0,
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
      status: '啟用'
    });

    const statItems = ref([
      { title: '會員總數', value: 0 },
      { title: '正式會員', value: 0 },
      { title: '體驗會員', value: 0 },
      { title: '當月新增', value: 0 }
    ]);

    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthToken(token);
          // 获取当前登录用户的信息，可以使用另一个API端点来获取
          currentUser.value = 'current_logged_in_user'; // 这里需要用实际的用户名替换
        }
        const response = await getUsers();
        members.value = response.data;
        regularMembers.value = members.value.filter(member => member.roleId === 2).length;
        trialMembers.value = members.value.filter(member => member.roleId === 3).length;
        totalMembers.value = members.value.length;

        statItems.value = [
          { title: '會員總數', value: totalMembers.value },
          { title: '正式會員', value: regularMembers.value },
          { title: '體驗會員', value: trialMembers.value },
          { title: '當月新增', value: 0 }  // 假設當月新增需要其他 API 來獲取
        ];
      } catch (error) {
        console.error('Failed to fetch member data:', error);
      }
    };

    const addMember = async () => {
      try {
        newMember.value.updatedAt = new Date().toISOString(); // 更新时间
        newMember.value.username = currentUser.value; // 设置最近修改人
        await addUser(newMember.value);
        fetchMemberData(); // 重新获取会员列表
        showAddMemberModal.value = false;
      } catch (error) {
        console.error('Failed to add member:', error);
      }
    };

    const searchMember = async () => {
      try {
        const response = await getUserById(searchInput.value);
        if (response.data) {
          members.value = [response.data]; // 假设只返回一个结果
        }
        showSearchMemberModal.value = false;
      } catch (error) {
        console.error('Failed to search member:', error);
      }
    };

    onMounted(() => {
      fetchMemberData();
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
      members,
      currentPage,
      totalPages,
      paginatedMembers,
      nextPage,
      previousPage,
      statItems,
      showAddMemberModal,
      showSearchMemberModal,
      newMember,
      searchInput,
      addMember,
      searchMember,
      currentUser
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

.add-member-button, .search-member-button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.add-member-button:hover, .search-member-button:hover {
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
