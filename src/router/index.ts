import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Feed from '../components/Feed.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (like when using browser back button), use it
    if (savedPosition) {
      return savedPosition
    }
    // Otherwise scroll to top
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/feed',
      name: 'feed',
      component: Feed,
    },
    {
      path: '/dorms',
      name: 'dorms',
      component: () => import('../views/DormsLayoutsView.vue'),
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: () => import('../views/CreatePostView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue'),
    },
  ],
})

export default router
