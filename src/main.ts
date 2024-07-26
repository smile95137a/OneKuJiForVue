import router from '@/router';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/admin.scss'; // 引入 admin.scss
import './assets/styles/main.scss';

createApp(App).use(router).mount('#app');
