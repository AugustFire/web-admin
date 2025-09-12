import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import Login from '@/views/LoginIndex.vue'

const routes = [

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/HomeIndex.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'users',
        component: () => import('@/views/UserList.vue'),
        meta: { title: '用户管理', icon: 'UserFilled' }
      },
      {
        path: 'products',
        component: () => import('@/views/ProductList.vue'),
        meta: { title: '商品管理', icon: 'ShoppingCart' }
      },
      {
        path: 'system',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: 'roles',
            component: () => import('@/views/RoleList.vue'),
            meta: { title: '角色管理', icon: 'User' }
          },
          {
            path: 'permissions',
            component: () => import('@/views/PermissionList.vue'),
            meta: { title: '权限管理', icon: 'Lock' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
