import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Product from '@/views/Product.vue';
import Product2 from '@/views/Product2.vue';
import Product3 from '@/views/Product3.vue';
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
    path: '/',
    redirect: '/home',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/notfound',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
