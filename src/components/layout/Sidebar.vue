<template>
  <div class="sidebar">
    <ul>
      <li @click="navigate('MemberManagement')">会员管理系统</li>
      <li @click="navigate('InventoryManagement')">进销存管理系统</li>
      <li @click="navigate('PermissionsManagement')">权限管理系统</li>
      <li @click="navigate('ProductDataManagement')">商品资料管理系统</li>
      <li @click="navigate('ShipmentManagement')">进出货管理系统</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SidebarComponent',
  emits: ['navigate'],
  setup(_, { emit }) {
    const navigate = (view: string) => {
      emit('navigate', view);
    };

    return {
      navigate,
    };
  }
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
}
.sidebar ul {
  list-style-type: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
  cursor: pointer;
}
.sidebar li:hover {
  background-color: #ddd;
}
</style>
