import MemberManagement from '@/components/MemberManagement.vue';
import { getCurrentUser } from '@/services/auth'; // 导入 getCurrentUser 方法
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
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/product',
    component: Product,
  },
  {
    path: '/product2',
    component: Product2,
  },
  {
    path: '/product3',
    component: Product3,
  },
  {
    path: '/product-detail1',
    component: ProductDetail1,
  },
  {
    path: '/product-detail2',
    component: ProductDetail2,
  },
  {
    path: '/admin',
    component: MemberManagement,
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/admin-login',
    component: AdminLogin,
  },
  {
    path: '/admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }  // 需要身份验证
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      await getCurrentUser();
      next();
    } catch (error) {
      next('/admin-login');
    }
  } else {
    next();
  }
});

export default router;
