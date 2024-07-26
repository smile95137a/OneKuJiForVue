<template>
  <div class="member-management">
    <h2>會員管理</h2>
    <div class="stats">
      <div class="stat-item">
        <h3>會員總數</h3>
        <p>200</p>
      </div>
      <div class="stat-item">
        <h3>正式會員</h3>
        <p>150</p>
      </div>
      <div class="stat-item">
        <h3>體驗會員</h3>
        <p>50</p>
      </div>
      <div class="stat-item">
        <h3>當月新增</h3>
        <p>46</p>
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
          <tr>
            <td>正式會員</td>
            <td>334567889012</td>
            <td>王小華</td>
            <td>0912334567</td>
            <td>新北市東山街2號4樓-2</td>
            <td>2024-12-22 20:23:22</td>
            <td>系統管理員</td>
            <td>有效</td>
            <td><button>編輯</button> <button>刪除</button></td>
          </tr>
          <!-- Add more rows as needed -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MemberManagement',
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

.member-management {
  padding: 20px;
}

.member-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
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
</style>
