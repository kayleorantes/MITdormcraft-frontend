import { createRouter, createWebHistory } from 'vue-router'

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
    // Keep routes in sync with navigation
    {
      path: '/feed',
      name: 'feed',
      component: () => import('../components/Feed.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('../components/Feed.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
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
