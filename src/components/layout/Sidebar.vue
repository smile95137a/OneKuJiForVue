<template>
  <div class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.path">
        <router-link :to="item.path" custom v-slot="{ navigate, isActive }">
          <a @click="navigate" :class="{ active: isActive }">
            <i :class="item.icon"></i>
            {{ item.name }}
          </a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const menuItems = ref([
      { name: '會員管理', path: '/admin/member-management', icon: 'fas fa-users' },
      // { name: '庫存管理', path: '/admin/inventory-management', icon: 'fas fa-warehouse' },
      { name: '抽獎資料管理', path: '/admin/product-data-management', icon: 'fas fa-box' },
      { name: '運輸方式管理', path: '/admin/shipment-management', icon: 'fas fa-truck' },
      { name: '商城資料管理', path: '/admin/store-control', icon: 'fas fa-store' },
      { name: '最新消息管理', path: '/admin/news-management', icon: 'fas fa-newspaper' },
      { name: '訂單狀態管理', path: '/admin/order-management', icon: 'fas fa-newspaper' },
      { name: '推薦商品管理', path: '/admin/product-recommendation', icon: 'fas fa-newspaper' },

    ]);

    return {
      menuItems
    };
  }
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #374151;
  padding: 10px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar a {
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 10px;
}

.sidebar a:hover, .sidebar a.active {
  background-color: #4b5563;
  border-radius: 5px;
}

.sidebar a i {
  margin-right: 10px;
}
</style>