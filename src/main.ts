import { createApp } from 'vue';
import './assets/styles/main.scss';
import router from '@/router';
import App from './App.vue';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

createApp(App).use(router).mount('#app');
