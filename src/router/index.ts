import { getCurrentUser } from '@/interfaces/auth'; // 导入 getCurrentUser 方法
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
import NotFound from '@/views/NotFound.vue';
import Product from '@/views/Product.vue';
import Product2 from '@/views/Product2.vue';
import Product3 from '@/views/Product3.vue';
import ProductDetail1 from '@/views/ProductDetail1.vue';
import ProductDetail2 from '@/views/ProductDetail2.vue';
import Register from '@/views/Register.vue';
import MemberCenter from '@/views/MemberCenter/MemberCenter.vue';
import ProfileEdit from '@/views/MemberCenter/ProfileEdit.vue';
import PurchaseHistory from '@/views/MemberCenter/PurchaseHistory.vue';
import Rewards from '@/views/MemberCenter/Rewards.vue';
import OrderHistory from '@/views/MemberCenter/OrderHistory.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/register',
    component: Register,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/home',
    component: Home,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/product',
    component: Product,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/product2',
    component: Product2,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/product3',
    component: Product3,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/product-detail1',
    component: ProductDetail1,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/product-detail2/:id',
    name: 'ProductDetail2',
    component: () => import('@/views/ProductDetail2.vue'),
  },
  {
    path: '/product-detail2/:id',
    name: 'ProductDetail2',
    component: () => import('@/views/ProductDetail2.vue'),
  },
  {
    path: '/product-detail2',
    component: ProductDetail2,
    meta: { layout: 'default' }, // 前台頁面
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, layout: 'admin' }, // 驗證身分並設定為後台頁面
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
    meta: { layout: 'admin' }, // 後台登入頁面
  },
  {
    path: '/member-center',
    component: MemberCenter,
    meta: { requiresAuth: false }, // 驗證身分並設定為前台頁面
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
    path: '/',
    redirect: '/home',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { layout: 'default' }, // 前台404頁面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守衛
router.beforeEach(async (to, _, next) => {
  const token = localStorage.getItem('token'); // 檢查本地存儲中是否有 token
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (token) {
      try {
        await getCurrentUser();
        next();
      } catch (error) {
        next('/admin-login');
      }
    } else {
      next('/admin-login');
    }
  } else {
    next();
  }
});

export default router;
