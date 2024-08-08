import { getCurrentUser } from '@/interfaces/auth';
import { useUserStore } from '@/stores/userstore';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 导入组件
import InventoryManagement from '@/components/Backend/InventoryManagement.vue';
import MemberManagement from '@/components/Backend/MemberManagement.vue';
import PermissionManagement from '@/components/Backend/PermissionsManagement.vue';
import ProductDataManagement from '@/components/Backend/ProductDataManagement.vue';
import ShipmentManagement from '@/components/Backend/ShipmentManagement.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import MemberCenter from '@/views/MemberCenter/MemberCenter.vue';
import OrderHistory from '@/views/MemberCenter/OrderHistory.vue';
import ProfileEdit from '@/views/MemberCenter/ProfileEdit.vue';
import PurchaseHistory from '@/views/MemberCenter/PurchaseHistory.vue';
import Rewards from '@/views/MemberCenter/Rewards.vue';
import NotFound from '@/views/NotFound.vue';
import Product from '@/views/Product.vue';
import Product2 from '@/views/Product2.vue';
import Product3 from '@/views/Product3.vue';
import ProductDetail1 from '@/views/ProductDetail1.vue';
import Register from '@/views/Register.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login,
    meta: { layout: 'default' },
  },
  {
    path: '/register',
    component: Register,
    meta: { layout: 'default' },
  },
  {
    path: '/member-center',
    component: MemberCenter,
    meta: { requiresAuth: true, layout: 'default' },
    children: [
      {
        path: 'profile-edit',
        component: ProfileEdit,
      },
      {
        path: 'purchase-history',
        component: PurchaseHistory,
      },
      {
        path: 'rewards',
        component: Rewards,
      },
      {
        path: 'order-history',
        component: OrderHistory,
      },
    ],
  },
  {
    path: '/home',
    component: Home,
    meta: { layout: 'default' },
  },
  {
    path: '/product',
    component: Product,
    meta: { layout: 'default' },
  },
  {
    path: '/product2',
    component: Product2,
    meta: { layout: 'default' },
  },
  {
    path: '/product3',
    component: Product3,
    meta: { layout: 'default' },
  },
  {
    path: '/product-detail1',
    component: ProductDetail1,
    meta: { layout: 'default' },
  },
  {
    path: '/product-detail1/:id',
    name: 'productDetail1',
    component: () => import('@/views/ProductDetail1.vue'),
    meta: { layout: 'default' },
  },
  {
    path: '/product-detail2/:id',
    name: 'ProductDetail2',
    component: () => import('@/views/ProductDetail2.vue'),
    meta: { layout: 'default' },
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, layout: 'admin' },
    children: [
      {
        path: 'member-management',
        component: MemberManagement,
      },
      {
        path: 'inventory-management',
        component: InventoryManagement,
      },
      {
        path: 'shipment-management',
        component: ShipmentManagement,
      },
      {
        path: 'permission-management',
        component: PermissionManagement,
      },
      {
        path: 'product-data-management',
        component: ProductDataManagement,
      },
    ],
  },
  {
    path: '/admin-login',
    component: AdminLogin,
    meta: { layout: 'admin' },
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { layout: 'default' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem('token');

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (token) {
      if (!userStore.isLoggedIn) {
        try {
          const user = await getCurrentUser();
          userStore.login(user.username);
        } catch (error) {
          console.error('Error getting current user:', error);
          localStorage.removeItem('token');
          next('/login');
          return;
        }
      }
      next();
    } else {
      next('/login');
    }
  } else {
    if (token && !userStore.isLoggedIn) {
      try {
        const user = await getCurrentUser();
        userStore.login(user.username);
      } catch (error) {
        console.error('Error getting current user:', error);
        localStorage.removeItem('token');
      }
    }
    next();
  }
});

export default router;