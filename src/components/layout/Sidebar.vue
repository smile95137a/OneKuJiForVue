<template>
  <div class="sidebar">
    <ul>
      <li v-for="item in filteredMenuItems" :key="item.path">
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

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
const adminStore = useAdminStore();

const roleId = computed(() => adminStore.user?.roleId ?? null);

const menuItems = ref([
  {
    name: '會員管理',
    path: '/admin/member-management',
    icon: 'fas fa-users',
    roles: [1],
  },
  {
    name: '抽獎資料管理',
    path: '/admin/product-data-management',
    icon: 'fas fa-box',
    roles: [1],
  },
  {
    name: '運輸方式管理',
    path: '/admin/shipment-management',
    icon: 'fas fa-truck',
    roles: [1],
  },
  {
    name: '商城資料管理',
    path: '/admin/store-control',
    icon: 'fas fa-store',
    roles: [1],
  },
  {
    name: '最新消息管理',
    path: '/admin/news-management',
    icon: 'fas fa-newspaper',
    roles: [1],
  },
  {
    name: '訂單狀態管理',
    path: '/admin/order-management',
    icon: 'fas fa-newspaper',
    roles: [1],
  },
  {
    name: '報表金額管理',
    path: '/admin/vendor',
    icon: 'fas fa-newspaper',
    roles: [1, 2],
  },
  {
    name: '推薦商品管理',
    path: '/admin/product-recommendation',
    icon: 'fas fa-newspaper',
    roles: [1],
  },
  {
    name: 'banner狀態管理',
    path: '/admin/banner-controler',
    icon: 'fas fa-newspaper',
    roles: [1],
  },
  {
    name: '兌換碼管理',
    path: '/admin/redemptionCodeList',
    icon: 'fas fa-newspaper',
    roles: [1],
  },
]);

const filteredMenuItems = computed(() => {
  return menuItems.value.filter((item) => item.roles.includes(roleId.value));
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

.sidebar a:hover,
.sidebar a.active {
  background-color: #4b5563;
  border-radius: 5px;
}

.sidebar a i {
  margin-right: 10px;
}
</style>
