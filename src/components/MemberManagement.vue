<template>
    <div class="member-management">
      <h1>會員管理</h1>
      <div class="stats">
        <div class="stat-item">
          <h3>會員總數</h3>
          <p>{{ totalMembers }}</p>
        </div>
        <div class="stat-item">
          <h3>正式會員</h3>
          <p>{{ regularMembers }}</p>
        </div>
        <div class="stat-item">
          <h3>體驗會員</h3>
          <p>{{ trialMembers }}</p>
        </div>
        <div class="stat-item">
          <h3>當月新增</h3>
          <p>{{ newMembers }}</p>
        </div>
      </div>
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
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.type }}</td>
            <td>{{ member.id }}</td>
            <td>{{ member.name }}</td>
            <td>{{ member.phone }}</td>
            <td>{{ member.address }}</td>
            <td>{{ member.lastModified }}</td>
            <td>{{ member.modifiedBy }}</td>
            <td>{{ member.status }}</td>
            <td>
              <button @click="editMember(member.id)">編輯</button>
              <button @click="deleteMember(member.id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  interface Member {
    type: string;
    id: string;
    name: string;
    phone: string;
    address: string;
    lastModified: string;
    modifiedBy: string;
    status: string;
  }
  
  export default defineComponent({
    name: 'MemberManagement',
    data() {
      return {
        totalMembers: 96,
        regularMembers: 50,
        trialMembers: 46,
        newMembers: 200,
        members: [] as Member[]
      };
    },
    mounted() {
      this.loadMembers();
    },
    methods: {
      loadMembers() {
        // 这里应该加载真实数据，这里仅为示例数据
        this.members = [
          {
            type: '正式會員',
            id: 'A12345677890',
            name: '王小華',
            phone: '0912334567',
            address: '新北市東山街2號4樓-2',
            lastModified: '2024-12-22 20:23:22',
            modifiedBy: '系統管理員',
            status: 'A'
          },
          // 添加更多示例数据
        ];
      },
      editMember(id: string) {
        // 编辑会员的逻辑
        alert(`编辑会员：${id}`);
      },
      deleteMember(id: string) {
        // 删除会员的逻辑
        alert(`删除会员：${id}`);
      }
    }
  });
  </script>
  
  <style scoped>
  .member-management {
    padding: 20px;
  }
  .stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .stat-item {
    background: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    flex: 1;
    margin: 0 10px;
  }
  .stat-item h3 {
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
  button {
    margin-right: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
  