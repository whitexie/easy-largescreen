import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

const managementRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Management',
    redirect: { name: 'DataLargeScreen' },
  },
  // {
  //   path: 'dataset',
  //   name: 'Dataset',
  //   component: () => import('@/views/management/Dataset/Dataset.vue'),
  //   meta: {
  //     title: '数据集',
  //   },
  // },
  {
    path: 'largescreen',
    name: 'DataLargeScreen',
    component: () => import('@/views/management/DataLargeScreen/DataLargeScreen.vue'),
    meta: {
      title: '数据大屏',
    },
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/management',
  },
  {
    path: '/render/:id',
    name: 'Render',
    props: true,
    component: () => import('@/views/render/Render.vue'),
  },
  {
    path: '/management',
    name: 'Management',
    component: () => import('@/views/management/index.vue'),
    children: [
      ...managementRoutes,
    ],
  },
  {
    path: '/largescreen/designer/:id',
    name: 'DataLargeScreenDesigner',
    component: () => import('@/views/management/DataLargeScreen/Designer.vue'),
    props: true,
    meta: {
      title: '大屏设计',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
