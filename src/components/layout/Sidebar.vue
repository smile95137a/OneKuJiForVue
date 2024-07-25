<template>
  <div class="sidebar">
    <ul>
      <li><a href="#" @click.prevent="navigate('MemberManagement')">會員管理</a></li>
      <li><a href="#" @click.prevent="navigate('PermissionsManagement')">權限管理</a></li>
      <li><a href="#" @click.prevent="navigate('InventoryManagement')">進銷存管理</a></li>
      <li><a href="#" @click.prevent="navigate('ProductDataManagement')">商品資料管理</a></li>
      <li><a href="#" @click.prevent="navigate('ShipmentManagement')">進出貨管理</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineEmits } from 'vue';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const emit = defineEmits(['navigate']);

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
@import '../assets/styles/admin.scss';

.sidebar {
  width: 200px;
  background-color: #f8f9fa;
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
  color: #000;
}
</style>
  