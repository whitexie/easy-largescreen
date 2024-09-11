import { type RouteRecordRaw, type RouteRecordSingleView, createRouter, createWebHistory } from 'vue-router';

interface ManagementRouteRecordRaw extends RouteRecordSingleView {
  name: string
  meta: {
    title: string
  }
}

const managementRoutes: ManagementRouteRecordRaw[] = [
  {
    path: '',
    name: 'Dashboard',
    component: () => import('@/views/management/Dashboard.vue'),
    meta: {
      title: '仪表盘',
    },
  },
  {
    path: 'data-set',
    name: 'Dataset',
    component: () => import('@/views/management/Dataset/Dataset.vue'),
    meta: {
      title: '数据集',
    },
  },
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
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/Demo.vue'),
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
    path: '/largescreen/designer',
    name: 'DataLargeScreenDesigner',
    component: () => import('@/views/management/DataLargeScreen/Designer.vue'),
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
