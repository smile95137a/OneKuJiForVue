\<template>
  <div class="admin-dashboard">
    <Sidebar @navigate="handleNavigation" />
    <div class="admin-content">
      <div class="admin-header">
        <div class="admin-header-left">
          <i class="menu-icon"></i>
          <span>再來一抽後台管理系統</span>
        </div>
        <div class="admin-header-right">
          <i class="notification-icon"></i>
          <span class="user-name">系統管理員</span>
          <i class="dropdown-icon"></i>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AdminDashboard',
  components: {
    Sidebar,
  },
  setup() {
    const isSidebarOpen = ref(true);
    const router = useRouter();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const handleNavigation = (view: string) => {
      router.push(`/admin/${view}`);
    };

    return {
      isSidebarOpen,
      toggleSidebar,
      handleNavigation,
    };
  }
});
</script>

<style scoped>
@import "@/assets/styles/admin.scss";

.admin-dashboard {
  display: flex;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6366f1;
  color: #ffffff;
  padding: 10px 20px;
}

.admin-header-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 24px;
  cursor: pointer;
}

.admin-header-right {
  display: flex;
  align-items: center;
}

.notification-icon,
.dropdown-icon {
  font-size: 24px;
  margin-left: 15px;
  cursor: pointer;
}

.user-name {
  margin-left: 10px;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f1f1f1;
  overflow: auto;
}

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
}

.sidebar a:hover {
  background-color: #4b5563;
  border-radius: 5px;
}

.sidebar a i {
  margin-right: 10px;
}
</style>
