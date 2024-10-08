<template>
  <div class="member-management">
    <div class="header">
      <h2 class="title">會員管理</h2>
      <div class="button-group">
        <button class="distribute-reward-button" @click="showDistributeRewardModal = true" :disabled="selectedMembers.length === 0">
          發放獎勵
        </button>
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-item" v-for="(item, index) in statItems" :key="index">
        <div class="stat-content">
          <h3>{{ item.title }}</h3>
          <p class="stat-value">{{ item.value }}</p>
        </div>
      </div>
    </div>

    <div class="search-section">
      <input v-model="searchInput" placeholder="輸入會員編號、電話或電子郵件搜索會員" @input="debounceSearch" />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th>會員類型</th>
            <th>會員編號</th>
            <th>帳號</th>
            <th>暱稱</th>
            <th>電話</th>
            <th>居住地址</th>
            <th>金幣</th>
            <th>銀幣</th>
            <th>紅利點數</th>
            <th>修改時間</th>
            
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
  <tr v-for="member in paginatedMembers" :key="member.id">
    <td><input type="checkbox" v-model="selectedMembers" :value="member.id" /></td>
    <td>{{ getRoleName(member.roleId) }}</td>
    <td>{{ member.id }}</td>
    <td>{{ member.username }}</td> <!-- 帳號 -->
    <td>{{ member.nickName }}</td> <!-- 暱稱 -->
    <td>{{ member.phoneNumber }}</td>
    <td>{{ member.address }}</td>
    <td>{{ member.balance }}</td> <!-- 金幣 -->
    <td>{{ member.sliverCoin }}</td> <!-- 紅利點數 -->
    <td>{{ member.bonus }}</td> <!-- 銀幣 -->
    <td>{{ formatDate(member.updatedAt) }}</td>
    
    <td>
      <button @click="editMember(member)" class="edit-button">編輯</button>
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

    <!-- Add Member Modal -->
    <div v-if="showAddMemberModal" class="modal">
      <div class="modal-content">
        <h3>新增會員</h3>
        <form @submit.prevent="addMember">
          <div v-for="field in memberFields" :key="field.key">
            <label :for="field.key">{{ field.label }}:</label>
            <input :id="field.key" v-model="(newMember as any)[field.key]" :type="field.type" required>
          </div>
          <button type="submit">提交</button>
          <button type="button" @click="showAddMemberModal = false">取消</button>
        </form>
      </div>
    </div>

    <!-- Edit Member Modal -->
    <div v-if="showUpdateMemberModal" class="modal">
      <div class="modal-content">
        <h3>編輯會員</h3>
        <form @submit.prevent="updateMember">
          <div v-for="field in memberFields" :key="field.key">
            <label :for="'edit-' + field.key">{{ field.label }}:</label>
            <input :id="'edit-' + field.key" v-model="(editingMember as any)[field.key]" :type="field.type" required>
          </div>
          <div>
            <label for="edit-roleId">角色:</label>
            <select id="edit-roleId" v-model="editingMember.roleId" required>
              <option v-for="role in roleOptions" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>
          <button type="submit">更新</button>
          <button type="button" @click="showUpdateMemberModal = false">取消</button>
        </form>
      </div>
    </div>

    <!-- Distribute Reward Modal -->
    <div v-if="showDistributeRewardModal" class="modal">
      <div class="modal-content">
        <h3>發放獎勵</h3>
        <p>選中的會員數：{{ selectedMembers.length }}</p>
        <form @submit.prevent="distributeReward">
          <div>
            <label for="silverAmount">銀幣數量：</label>
            <input id="silverAmount" v-model.number="silverAmount" type="number" required min="0" />
          </div>
          <div>
            <label for="bonusAmount">紅利數量：</label>
            <input id="bonusAmount" v-model.number="bonusAmount" type="number" required min="0" />
          </div>
          <button type="submit">確認發放</button>
          <button type="button" @click="showDistributeRewardModal = false">取消</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { User, UserReq, SliverUpdate } from '@/interfaces/user';
import { userService } from '@/services/backend/userservice';
import { debounce } from 'lodash';
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  name: 'MemberManagement',
  setup() {
    const allMembers = ref<User[]>([]);
    const displayedMembers = ref<User[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const showAddMemberModal = ref(false);
    const showUpdateMemberModal = ref(false);
    const showDistributeRewardModal = ref(false);
    const searchInput = ref('');
    const selectedMembers = ref<number[]>([]);
    const selectAll = ref(false);
    const silverAmount = ref(0);
    const bonusAmount = ref(0);
  
    const roleOptions = [
      { value: 1, label: '權限控管管理者' },
      { value: 2, label: '一般管理者' },
      { value: 3, label: '驗證會員' },
      { value: 4, label: '未驗證會員' },
      { value: 5, label: '黑名單會員' }
    ];

    const newMember = reactive<UserReq>({
      username: '',
      password: '',
      nickName: '',
      phoneNumber: '',
      address: '',
      roleId: 4
    });

    const editingMember = reactive<User>({
      id: 0,
      username: '',
      password: '',
      nickName: '', 
      phoneNumber: '',
      address: '',
      createdAt: '',
      updatedAt: 0,
      roleId: 0,
      status: '',
      balance: 0,
      bonus: 0,
      sliverCoin: 0,
      provider: '',
      roles: []
    });

    const memberFields = [
      { key: 'username', label: '用戶名', type: 'text' },
      { key: 'nickName', label: '暱稱', type: 'text' },
      { key: 'phoneNumber', label: '電話號碼', type: 'tel' },
      { key: 'address', label: '地址', type: 'text' },
    ];

    const statItems = ref([
      { title: '會員總數', value: 0 },
      { title: '正式會員', value: 0 },
      { title: '體驗會員', value: 0 },
      { title: '當月新增', value: 0 }
    ]);
    const getRoleName = (roleId: number) => {
  const role = roleOptions.find(option => option.value === roleId);
  return role ? role.label : '未知角色';
};
    const fetchMemberData = async () => {
      try {
        const response = await userService.getAllUsers();
        if (response.code === 200 && response.data) {
          allMembers.value = response.data;
          displayedMembers.value = response.data;
          updateStats();
        }
      } catch (error) {
        console.error('獲取會員數據失敗:', error);
      }
    };

    const updateStats = () => {
      const totalMembers = displayedMembers.value.length;
      const regularMembers = displayedMembers.value.filter(member => member.roleId === 2).length;
      const trialMembers = displayedMembers.value.filter(member => member.roleId === 3).length;
      const newMembersThisMonth = displayedMembers.value.filter(member => {
        const createdDate = new Date(member.createdAt);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
      }).length;

      statItems.value = [
        { title: '會員總數', value: totalMembers },
        { title: '正式會員', value: regularMembers },
        { title: '體驗會員', value: trialMembers },
        { title: '當月新增', value: newMembersThisMonth }
      ];
    };

    const addMember = async () => {
      try {
        const response = await userService.createUser(newMember);
        if (response.code === 201 && response.data) {
          await fetchMemberData();
          showAddMemberModal.value = false;
          Object.keys(newMember).forEach(key => {
            (newMember as any)[key] = '';
          });
        }
      } catch (error) {
        console.error('新增會員失敗:', error);
      }
    };

    const searchMembers = () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        displayedMembers.value = allMembers.value;
      } else {
        displayedMembers.value = allMembers.value.filter(member =>
          member.id.toString().includes(query) ||
          member.phoneNumber.toLowerCase().includes(query)||
          member.username.toLowerCase().includes(query) 
        );
      }
      updateStats();
      currentPage.value = 1;
    };

    const debounceSearch = debounce(() => {
      searchMembers();
    }, 300);

    const editMember = (member: User) => {
      Object.keys(editingMember).forEach(key => {
        if (key in member) {
          (editingMember as any)[key] = (member as any)[key];
        }
      });
      showUpdateMemberModal.value = true;
    };

    const updateMember = async () => {
      try {
        const response = await userService.updateUser(editingMember.id, editingMember as UserReq);
        if (response.code === 200) {
          await fetchMemberData();
          showUpdateMemberModal.value = false;
        }
      } catch (error) {
        console.error('更新會員失敗:', error);
      }
    };

    const handleDeleteMember = async (member: User) => {
      if (confirm(`確定要刪除會員 ${member.nickName} 嗎？`)) {
        try {
          const response = await userService.deleteUser(member.id);
          if (response.code === 200) {
            await fetchMemberData();
          }
        } catch (error) {
          console.error('刪除會員失敗:', error);
        }
      }
    };

    const formatDate = (dateArray: number[]) => {
  if (!dateArray || dateArray.length < 6) {
    return 'Invalid Date';
  }
  const [year, month, day, hour, minute, second] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedMembers.value = paginatedMembers.value.map(member => member.id);
      } else {
        selectedMembers.value = [];
      }
    };

    const distributeReward = async () => {
      try {
        const sliverUpdate: SliverUpdate = {
          userId: selectedMembers.value,
          sliverCoin: silverAmount.value,
          bonus: bonusAmount.value
        };
        await userService.distributeSilver(sliverUpdate);
        await fetchMemberData();
        showDistributeRewardModal.value = false;
        selectedMembers.value = [];
        selectAll.value = false;
        silverAmount.value = 0;
        bonusAmount.value = 0;
      } catch (error) {
        console.error('發放獎勵失敗:', error);
      }
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
      showDistributeRewardModal,
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
      formatDate,
      memberFields,
      roleOptions,
      selectedMembers,
      selectAll,
      toggleSelectAll,
      silverAmount,
      bonusAmount,
      distributeReward,
      getRoleName
    };
  } // 關閉 setup 函數
}); // 關閉 defineComponent
</script>


<style scoped>
.member-management {
  padding: 30px;
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title {
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 15px;
}

.add-member-button, .distribute-reward-button {
  padding: 12px 20px;
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-member-button {
  background-color: #4CAF50;
}

.distribute-reward-button {
  background-color: #3498db;
}

.add-member-button:hover, .distribute-reward-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 20px;
}

.stat-item {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.stat-content h3 {
  margin: 0;
  font-size: 18px;
  color: #7f8c8d;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
}

.search-section {
  margin-bottom: 30px;
}

.search-section input {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-section input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.table-container {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

th {
  background-color: #34495e;
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr:hover {
  background-color: #f8f9fa;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-content form div {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
}

.modal-content input, .modal-content select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modal-content input:focus, .modal-content select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.modal-content button {
  margin-right: 15px;
  padding: 12px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-content button[type="submit"] {
  background-color: #4CAF50;
}

.modal-content button[type="button"] {
  background-color: #e74c3c;
}

.modal-content button:hover {
  opacity: 0.9;
}

.edit-button, .delete-button {
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 5px;
}

.edit-button {
  background-color: #3498db;
}

.delete-button {
  background-color: #e74c3c;
}

.edit-button:hover {
  background-color: #2980b9;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>