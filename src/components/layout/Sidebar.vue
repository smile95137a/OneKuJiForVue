<template>
  <div class="sidebar">
    <ul>
      <li><a href="#" @click.prevent="navigate('member-management')"><i class="icon"></i>會員管理</a></li>
      <li><a href="#" @click.prevent="navigate('permission-management')"><i class="icon"></i>權限管理</a></li>
      <li><a href="#" @click.prevent="navigate('inventory-management')"><i class="icon"></i>進銷存管理</a></li>
      <li><a href="#" @click.prevent="navigate('product-data-management')"><i class="icon"></i>商品資料管理</a></li>
      <li><a href="#" @click.prevent="navigate('shipment-management')"><i class="icon"></i>進出貨管理</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar',
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
