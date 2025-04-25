import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'

const routes = [

  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },




  {
    path: '/forgot',
    name: 'forgot',
    component: () => import( '../views/LoginForgot.vue')
  },

  {
    path: '/register',
    name: 'register',
    component: () => import( '../views/LoginRegister.vue')
  },


  
]

const router = createRouter({
  history: createWebHistory(), // Cambiar a createWebHistory
  routes
});

export default router
