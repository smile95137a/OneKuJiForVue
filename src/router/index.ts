import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userstore';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 导入组件
import About from '@/views/About/About.vue';
import Blindox from '@/views/BlindBox/BlindBox.vue';
import CustomizedDraw from '@/views/CustomizedDraw/CustomizedDraw.vue';
import Gacha from '@/views/Gacha/Gacha.vue';
import Home from '@/views/Home/Home.vue';
import Ichiban from '@/views/Ichiban/Ichiban.vue';
import Login from '@/views/Login/Login.vue';
import Mall from '@/views/Mall/Mall.vue';
import MallCheckout from '@/views/Mall/MallCheckout.vue';
import MallOrderSuccess from '@/views/Mall/MallOrderSuccess.vue';
import MallProduct from '@/views/Mall/MallProduct.vue';
import DrawHistory from '@/views/MemberCenter/DrawHistory.vue';
import MemberCenter from '@/views/MemberCenter/MemberCenter.vue';
import OrderHistory from '@/views/MemberCenter/OrderHistory.vue';
import ProfileEdit from '@/views/MemberCenter/ProfileEdit.vue';
import PurchaseHistory from '@/views/MemberCenter/PurchaseHistory.vue';
import Rewards from '@/views/MemberCenter/Rewards.vue';
import News from '@/views/News/News.vue';
import NewsDetail from '@/views/NewsDetail/NewsDetail.vue';
import NotFound from '@/views/NotFound/NotFound.vue';
import OAuth2Redirect from '@/views/OAuth2Redirect/OAuth2Redirect.vue';
import Policy from '@/views/Policy/Policy.vue';
import Privacy from '@/views/Privacy/Privacy.vue';
import Register from '@/views/Register/Register.vue';
import Transaction from '@/views/Transaction/Transaction.vue';
import Verify from '@/views/Verify/Verify.vue';
import Deposit from '@/views/Deposit/Deposit.vue';
import PrizeOrderSuccess from '@/views/Prize/PrizeOrderSuccess.vue';

// 后台组件
import MemberManagement from '@/components/backend/MemberManagement.vue';
import Newscontrol from '@/components/backend/Newscontrol.vue';
import ProductDataManagement from '@/components/backend/ProductDataManagement.vue';
import Storecontrol from '@/components/backend/Storecontrol.vue';
import AdminDashboard from '@/views/Control/AdminDashboard.vue';
import AdminLogin from '@/views/Control/AdminLogin.vue';
import PrizeCheckout from '@/views/Prize/PrizeCheckout.vue';

import ordercontrol from '@/components/backend/ordercontrol.vue';
import ProductRecommendation from '@/components/backend/ProductRecommendation.vue';
import Shipcontrol from '@/components/backend/shipcontrol.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/oauth2/redirect',
    component: OAuth2Redirect,
  },
  {
    path: '/verify/:token',
    component: Verify,
  },
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
    path: '/about',
    component: About,
    meta: { layout: 'default' },
  },
  {
    path: '/transaction',
    component: Transaction,
    meta: { layout: 'default' },
  },
  {
    path: '/deposit',
    component: Deposit,
    meta: { layout: 'default' },
  },

  {
    path: '/privacy',
    component: Privacy,
    meta: { layout: 'default' },
  },
  {
    path: '/policy',
    component: Policy,
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
    meta: { layout: 'default', requiresAuth: true },
  },
  {
    path: '/mall-order-success/:orderNumber',
    name: 'MallOrderSuccess',
    component: MallOrderSuccess,
    meta: { layout: 'default', requiresAuth: true },
  },
  {
    path: '/prize-checkout',
    component: PrizeCheckout,
    meta: { layout: 'default', requiresAuth: true },
  },
  {
    path: '/prize-order-success/:orderNumber',
    name: 'PrizeOrderSuccess',
    component: PrizeOrderSuccess,
    meta: { layout: 'default', requiresAuth: true },
  },
  {
    path: '/member-center',
    component: MemberCenter,
    meta: { requiresAuth: true, layout: 'default' },
    children: [
      {
        path: '',
        redirect: { name: 'ProfileEdit' },
      },
      {
        path: 'profile-edit',
        name: 'ProfileEdit',
        component: ProfileEdit,
      },
      {
        path: 'purchase-history',
        name: 'PurchaseHistory',
        component: PurchaseHistory,
      },
      {
        path: 'rewards',
        name: 'Rewards',
        component: Rewards,
      },
      {
        path: 'order-history',
        name: 'OrderHistory',
        component: OrderHistory,
      },
      {
        path: 'draw-history',
        name: 'DrawHistory',
        component: DrawHistory,
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
    path: '/news/:newsUid',
    name: 'NewsDetail',
    component: NewsDetail,
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
  // 后台路由
  {
    path: '/admin-login',
    component: AdminLogin,
    meta: { layout: 'admin' },
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdminAuth: true, layout: 'admin' },
    children: [
      {
        path: 'member-management',
        component: MemberManagement,
      },
      {
        path: 'order-management',
        component: ordercontrol,
      },
      {
        path: 'news-management',
        component: Newscontrol,
      },
      {
        path: 'shipment-management',
        component: Shipcontrol,
      },
      {
        path: 'product-recommendation',
        component: ProductRecommendation,
      },
      // {
      //   path: 'permission-management',
      //   component: PermissionManagement,
      // },
      {
        path: 'product-data-management',
        component: ProductDataManagement,
      },
      {
        path: 'store-control',
        component: Storecontrol,
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
    meta: { layout: 'default' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  const authStore = useAuthStore();

  // 检查路由是否需要认证
  if (
    to.matched.some(
      (record) => record.meta.requiresAuth || record.meta.requiresAdminAuth
    )
  ) {
    // 检查是否为后台路由
    if (to.matched.some((record) => record.meta.requiresAdminAuth)) {
      if (!adminStore.isAuthenticated) {
        // 如果没有登录，重定向到管理员登录页面
        next('/admin-login');
      } else {
        // 已登录，允许访问
        next();
      }
    } else {
      // 前台需要认证的路由
      if (!authStore.isLogin) {
        // 如果没有登录，重定向到登录页面
        next('/login');
      } else {
        // 已登录，允许访问
        next();
      }
    }
  } else {
    // 公开路由，直接通过
    next();
  }
});

export default router;
