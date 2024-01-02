import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';
import Home from '@/views/Home/index.vue';
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
      },
      {
        path: '/guide',
        name: 'Guide',
        component: () => import('@/views/Guide/index.vue'),
      },
      {
        path: '/doc',
        name: 'Doc',
        component: () => import('@/views/Doc/index.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
