import { useUserStore } from '@/stores/userstore';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 導入組件
import InventoryManagement from '@/components/backend/InventoryManagement.vue';
import MemberManagement from '@/components/backend/MemberManagement.vue';
import PermissionManagement from '@/components/backend/PermissionsManagement.vue';
import ProductDataManagement from '@/components/backend/ProductDataManagement.vue';
import ShipmentManagement from '@/components/backend/ShipmentManagement.vue';
import { useAdminStore } from '@/stores/adstore';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import Home from '@/views/Home/Home.vue';
import Login from '@/views/Login/Login.vue';
import Register from '@/views/Register/Register.vue';
import MemberCenter from '@/views/MemberCenter/MemberCenter.vue';
import OrderHistory from '@/views/MemberCenter/OrderHistory.vue';
import ProfileEdit from '@/views/MemberCenter/ProfileEdit.vue';
import PurchaseHistory from '@/views/MemberCenter/PurchaseHistory.vue';
import Rewards from '@/views/MemberCenter/Rewards.vue';
import NotFound from '@/views/NotFound/NotFound.vue';
import Ichiban from '@/views/Ichiban/Ichiban.vue';
import Blindox from '@/views/BlindBox/BlindBox.vue';
import Gacha from '@/views/Gacha/Gacha.vue';
import ProductDetail1 from '@/views/ProductDetail1.vue';
import Mall from '@/views/Mall/Mall.vue';
import MallProduct from '@/views/Mall/MallProduct.vue';
import MallCheckout from '@/views/Mall/MallCheckout.vue';
import MallOrderSuccess from '@/views/Mall/MallOrderSuccess.vue';
import News from '@/views/News/News.vue';
import CustomizedDraw from '@/views/CustomizedDraw/CustomizedDraw.vue';
import { getAuthToken } from '@/services/frontend/AuthService';
import { useAuthStore } from '@/stores';

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
    path: '/mall',
    component: Mall,
    meta: { layout: 'default' },
  },
  {
    path: '/mall-product/:id',
    name: 'MallProduct',
    component: MallProduct,
    meta: { layout: 'default' },
  },
  {
    path: '/mall-checkout',
    component: MallCheckout,
    meta: { layout: 'default' },
  },
  {
    path: '/mall-order-success',
    component: MallOrderSuccess,
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
    path: '/ichiban',
    component: Ichiban,
    meta: { layout: 'default' },
  },
  {
    path: '/blindox',
    component: Blindox,
    meta: { layout: 'default' },
  },
  {
    path: '/gacha',
    component: Gacha,
    meta: { layout: 'default' },
  },
  {
    path: '/news',
    component: News,
    meta: { layout: 'default' },
  },
  {
    path: '/customized-draw',
    component: CustomizedDraw,
    meta: { layout: 'default' },
  },
  {
    path: '/product-detail1/:id',
    name: 'ProductDetail1',
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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  const token = getAuthToken();
  const authStore = useAuthStore();

  console.log('Routing from:', from.path, 'to:', to.path);
  console.log(
    'Token:',
    token,
    'Is User Logged In:',
    userStore.isLoggedIn,
    'Is Admin Logged In:',
    adminStore.isLoggedIn
  );

  // 檢查路由是否需要認證
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 檢查是否為後台路由
    if (to.path.startsWith('/admin')) {
      console.log('Accessing admin route:', to.path);
      if (adminStore.isLoggedIn) {
        next();
      } else {
        console.log('Admin not logged in, redirecting to admin login');
        next('/admin-login');
      }
    } else {
      if (authStore.isLogin) {
        next();
      } else {
        next('/login');
      }
    }
  } else {
    // 公開路由，直接通過
    next();
  }
});

export default router;
