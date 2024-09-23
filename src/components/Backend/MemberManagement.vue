<template>
  <div class="member-management">
    <div class="header">
      <h2 class="title">會員管理</h2>
      <button class="add-member-button" @click="showAddMemberModal = true">新增會員</button>
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
          <tr v-for="member in paginatedMembers" :key="member.id">
            <td>{{ member.roleId === 2 ? '正式會員' : '體驗會員' }}</td>
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
          <!-- 其他欄位 -->
          <div v-for="field in memberFields" :key="field.key">
            <label :for="'edit-' + field.key">{{ field.label }}:</label>
            <input :id="'edit-' + field.key" v-model="(editingMember as any)[field.key]" :type="field.type" required>
          </div>

          <!-- 角色選擇 -->
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
  </div>
</template>

<script lang="ts">
import { User, UserReq } from '@/interfaces/user';
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
    const searchInput = ref('');

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
      nickname: '',
      email: '',
      phoneNumber: '',
      address: '',
      roleId: 4
    });

    const editingMember = reactive<User>({
      id: 0,
      username: '',
      password: '',
      nickname: '',
      email: '',
      phoneNumber: '',
      address: '',
      createdAt: '',
      updatedAt: '',
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
      { key: 'password', label: '密碼', type: 'password' },
      { key: 'nickname', label: '暱稱', type: 'text' },
      { key: 'email', label: '電子郵件', type: 'email' },
      { key: 'phoneNumber', label: '電話號碼', type: 'tel' },
      { key: 'address', label: '地址', type: 'text' },
      { key: 'roleId', label: '會員權限', type: 'text' }
    ];

    const statItems = ref([
      { title: '會員總數', value: 0 },
      { title: '正式會員', value: 0 },
      { title: '體驗會員', value: 0 },
      { title: '當月新增', value: 0 }
    ]);

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
          member.phoneNumber.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
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
      if (confirm(`確定要刪除會員 ${member.nickname} 嗎？`)) {
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
      formatDate,
      memberFields,
      roleOptions
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

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-item {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.search-section {
  margin-bottom: 20px;
}

.search-section input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
}

.delete-button:hover {
  background-color: #da190b;
}
</style>