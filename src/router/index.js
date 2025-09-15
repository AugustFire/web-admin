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
        title: '首页',
        path: '/home',
        icon: 'HomeFilled',
        component: () => import('@/views/HomeIndex.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        title: '用户管理',
        path: '/users',
        icon: 'UserFilled',
        component: () => import('@/views/UserList.vue'),
        meta: { title: '用户管理', icon: 'UserFilled' }
      },
      {
        title: '商品管理',
        path: '/products',
        icon: 'ShoppingCart',
        component: () => import('@/views/ProductList.vue'),
        meta: { title: '商品管理', icon: 'ShoppingCart' }
      },
      {
        title: '系统管理',
        path: '/system',
        icon: 'Setting',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            title: '角色管理',
            icon: 'User',
            path: '/system/roles',
            component: () => import('@/views/RoleList.vue'),
            meta: { title: '角色管理', icon: 'User' }
          },
          {
            title: '权限管理',
            icon: 'Lock',
            path: '/system/permissions',
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
