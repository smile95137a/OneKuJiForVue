<template>
  <div class="member-management">
    <div class="header">
      <h2 class="title">會員管理</h2>
      <button class="add-member-button" @click="showAddMemberModal = true">新增會員</button>
    </div>

    <!-- 優化後的統計顯示 -->
    <div class="stats-container">
      <div class="stat-item" v-for="(item, index) in statItems" :key="index">
        <div class="stat-content">
          <h3>{{ item.title }}</h3>
          <p class="stat-value">{{ item.value }}</p>
        </div>
      </div>
    </div>

    <!-- 搜索功能 -->
    <div class="search-section">
      <input 
        v-model="searchInput" 
        placeholder="輸入會員編號、電話或電子郵件搜索會員" 
        @input="debounceSearch"
      />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>會員類型</th>
            <th>會員編號</th>
            <th>姓名</th>
            <th>電話</th>
            <th>電子郵件</th>
            <th>居住地址</th>
            <th>最近修改時間</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>  
                 <!-- //v-for移除了index -->
          <tr v-for="(member) in paginatedMembers" :key="member.id">
            <td>{{ member.userType }}</td>
            <td>{{ member.id }}</td>
            <td>{{ member.nickname }}</td>
            <td>{{ member.phoneNumber }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.address }}</td>
            <td>{{ formatDate(member.updatedAt) }}</td>
            <td>{{ member.status }}</td>
            <td>
              <button @click="editMember(member)">編輯</button>
              <button class="delete-button" @click="handleDeleteMember(member)">刪除</button>
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

    <!-- 新增會員模態框 -->
    <div v-if="showAddMemberModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showAddMemberModal = false">&times;</span>
        <h2>新增會員</h2>
        <form @submit.prevent="addMember">
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
  </div>

  <!-- 編輯會員模態框 -->
  <div v-if="showUpdateMemberModal" class="modal">
    <div class="modal-content">
      <span class="close-button" @click="showUpdateMemberModal = false">&times;</span>
      <h2>編輯會員</h2>
      <form @submit.prevent="updateMember">
        <div>
          <label for="edit-username">用戶名:</label>
          <input id="edit-username" v-model="editingMember.username" required>
        </div>
        <div>
          <label for="edit-nickname">暱稱:</label>
          <input id="edit-nickname" v-model="editingMember.nickname" required>
        </div>
        <div>
          <label for="edit-email">電子郵件:</label>
          <input id="edit-email" v-model="editingMember.email" type="email" required>
        </div>
        <div>
          <label for="edit-phoneNumber">電話號碼:</label>
          <input id="edit-phoneNumber" v-model="editingMember.phoneNumber" required>
        </div>
        <div>
          <label for="edit-address">地址:</label>
          <input id="edit-address" v-model="editingMember.address" required>
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Member } from '@/interfaces/Member';
import { addUser, deleteUser, getUsers, updateUser } from '@/services/api';
import { AxiosResponse } from 'axios';
import { debounce } from 'lodash';
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  name: 'MemberManagement',
  setup() {
    const allMembers = ref<Member[]>([]);
    const displayedMembers = ref<Member[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showAddMemberModal = ref(false);
    const searchInput = ref('');

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
      status: ''
    });

    const statItems = ref([
      { title: '會員總數', value: 0 },
      { title: '正式會員', value: 0 },
      { title: '體驗會員', value: 0 },
      { title: '當月新增', value: 0 }
    ]);

    const fetchMemberData = async () => {
      try {
        const response: AxiosResponse<Member[]> = await getUsers();
        allMembers.value = response.data;
        displayedMembers.value = response.data;
        console.log('獲取到的會員數量:', allMembers.value.length);
        updateStats();
      } catch (error) {
        console.error('獲取會員數據失敗:', error);
      }
    };

    const updateStats = () => {
      const totalMembers = displayedMembers.value.length;
      const regularMembers = displayedMembers.value.filter(member => member.roleId === 2).length;
      const trialMembers = displayedMembers.value.filter(member => member.roleId === 3).length;
      // 假設當月新增需要額外的邏輯來計算
      const newMembersThisMonth = 0;

      statItems.value = [
        { title: '會員總數', value: totalMembers },
        { title: '正式會員', value: regularMembers },
        { title: '體驗會員', value: trialMembers },
        { title: '當月新增', value: newMembersThisMonth }
      ];
    };

    const addMember = async () => {
      try {
        await addUser(newMember.value);
        await fetchMemberData();
        showAddMemberModal.value = false;
        // 重置新會員表單
        newMember.value = {
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
          status: ''
        };
      } catch (error) {
        console.error('新增會員失敗:', error);
      }
    };

    const searchMembers = () => {
      console.log('搜尋函數被觸發');
      const query = searchInput.value.trim().toLowerCase();
      console.log('搜尋關鍵字:', query);
      
      if (!query) {
        displayedMembers.value = allMembers.value;
      } else {
        displayedMembers.value = allMembers.value.filter(member => 
          member.id.toString().includes(query) ||
          member.phoneNumber.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
        );
      }
      
      console.log('過濾後的會員數量:', displayedMembers.value.length);
      updateStats();
      currentPage.value = 1;
    };

    const debounceSearch = debounce(() => {
      searchMembers();
    }, 300);

    const showUpdateMemberModal = ref(false);
    const editingMember = reactive<Member>({
      id: 0,
      username: '',
      password: '',
      nickname: '',
      email: '',
      phoneNumber: '',
      address: '',
      createdAt: '',
      updatedAt: '',
      roles: [],
      balance: 0,
      bonusPoints: 0,
      lastTopUpTime: '',
      userType: '',
      roleId: 0,
      status: ''
    });

    const editMember = (member: Member) => {
      Object.assign(editingMember, member);
      showUpdateMemberModal.value = true;
    };

    const updateMember = async () => {
      try {
        await updateUser(editingMember);
        await fetchMemberData();
        showUpdateMemberModal.value = false;
      } catch (error) {
        console.error('更新會員失敗:', error);
      }
    };

    const handleDeleteMember = async (member: Member) => {
      if (confirm(`確定要刪除會員 ${member.nickname} 嗎？`)) {
        try {
          await deleteUser(member.id);
          await fetchMemberData();
        } catch (error) {
          console.error('刪除會員失敗:', error);
        }
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

    onMounted(() => {
      fetchMemberData();
    });

    const totalPages = computed(() => Math.ceil(displayedMembers.value.length / itemsPerPage));
    const paginatedMembers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return displayedMembers.value.slice(start, end);
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
      showUpdateMemberModal,
      editingMember,
      editMember,
      updateMember,
      displayedMembers,
      currentPage,
      totalPages,
      paginatedMembers,
      nextPage,
      previousPage,
      statItems,
      showAddMemberModal,
      newMember,
      searchInput,
      addMember,
      searchMembers,
      debounceSearch,
      handleDeleteMember,
      formatDate
    };
  }
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
