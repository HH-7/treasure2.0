import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// 路由定义
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/MainView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'game',
        name: 'Game',
        component: () => import('../views/GameView.vue')
      },
      {
        path: 'new-game',
        name: 'NewGame',
        component: () => import('../views/NewGameView.vue')
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('../views/UserManagementView.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：验证登录状态
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 未登录用户访问需要权限的页面时，强制跳转登录页
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router