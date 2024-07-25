<template>
    <div class="admin-dashboard">
      <header-component />
      <sidebar-component @navigate="setCurrentView" />
      <main>
        <component :is="currentView"></component>
      </main>
      <footer-component />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import HeaderComponent from '../components/layout/Header.vue';
  import SidebarComponent from '../components/layout/Sidebar.vue';
  import FooterComponent from '../components/layout/Footer.vue';
  import MemberManagement from '../components/MemberManagement.vue';
  import InventoryManagement from '../components/InventoryManagement.vue';
  import PermissionsManagement from '../components/PermissionsManagement.vue';
  import ProductDataManagement from '../components/ProductDataManagement.vue';
  import ShipmentManagement from '../components/ShipmentManagement.vue';
  
  export default defineComponent({
    name: 'AdminDashboard',
    components: {
      HeaderComponent,
      SidebarComponent,
      FooterComponent,
      MemberManagement,
      InventoryManagement,
      PermissionsManagement,
      ProductDataManagement,
      ShipmentManagement,
    },
    setup() {
      const currentView = ref('MemberManagement');
  
      const setCurrentView = (view: string) => {
        currentView.value = view;
      };
  
      return {
        currentView,
        setCurrentView,
      };
    }
  });
  </script>
  
  <style scoped>
  .admin-dashboard {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  main {
    flex: 1;
    padding: 20px;
  }
  </style>
  