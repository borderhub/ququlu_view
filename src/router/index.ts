import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import RootViewer from '@/views/pages/RootViewer.vue';
import CalenderViewer from '@/views/pages/CalenderViewer.vue';
import ShareMapViewer from '@/views/pages/ShareMapViewer.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: RootViewer
  },
  {
    path: '/calender',
    name: 'Calender',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // () => import(/* webpackChunkName: "about" */ '../views/pages/About.vue')
    component: CalenderViewer
  },
  {
    path: '/sharemap',
    name: 'ShareMap',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: ShareMapViewer
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
