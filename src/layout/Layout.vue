<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'
import Menu from '@/components/Menu.vue'

const router = useRouter()
const route = useRoute()

// 是否折叠
const isCollapse = ref(false)
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}



// 获取 Layout 的 children
const menuRoutes = computed(() => {
  const layout = router.getRoutes().find(r => r.path === '/')
  return layout?.children || []
})

// ============ Tabs 部分（保持不变） ============
const tabs = ref([{ title: '首页', path: '/home' }])
const activeTab = ref('/home')


// 模拟获取用户信息
const username = ref(localStorage.getItem('username') || '未登录')
const role = ref(localStorage.getItem('role') || 'guest')

watchEffect(() => {
  const newPath = route.fullPath
  activeTab.value = newPath
  const exist = tabs.value.find(tab => tab.path === newPath)
  if (!exist) {
    tabs.value.push({
      title: route.meta.title || '未命名',
      path: newPath
    })
  }
})

const handleTabClick = (tab) => {
  router.push(tab.props.name)
}

// const removeTab = (targetPath) => {
//   if (targetPath === '/home') return  // 首页永远不能关
//   const index = tabs.value.findIndex(tab => tab.path === targetPath)
//   tabs.value.splice(index, 1)
//   if (activeTab.value === targetPath) {
//     const lastTab = tabs.value[index - 1] || tabs.value[0]
//     if (lastTab) router.push(lastTab.path)
//   }
// }
const removeTab = (targetPath) => {
  if (targetPath === '/home') return  // 首页永远不能关
  const index = tabs.value.findIndex(tab => tab.path === targetPath)

  // 如果删除的是当前激活的标签页
  if (activeTab.value === targetPath) {
    const lastTab = tabs.value[index - 1] || tabs.value[0]
    // 先更新activeTab，再执行删除操作
    activeTab.value = lastTab.path
    // 立即执行路由跳转
    router.push(lastTab.path)
  }

  // 执行删除操作
  tabs.value.splice(index, 1)

  // 强制更新响应式数据，确保DOM立即更新
  tabs.value = [...tabs.value]
}


const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
  router.push('/login')
}

</script>

<template>
  <!-- <p><strong>Current route path:</strong> {{ $route.fullPath }}</p> -->
  <el-container style="height: 100vh;overflow: auto;">
    <el-aside :width="isCollapse ? '64px' : '200px'" style="transition: width 0.3s ease;border-right: 1px solid #e6e6e6;
        height: 100%;
        margin-top: 0;
        padding-top: 0;">
      <Menu :menus="menuRoutes" active="/home" :collapse="isCollapse" />
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <el-header style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <el-button link @click="toggleCollapse">
            <el-icon>
              <component :is="isCollapse ? Expand : Fold" />
            </el-icon>
          </el-button>
          <!-- 左侧是系统名称 / 面包屑 -->
          <span>后台管理系统</span>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <el-avatar size="default" src="https://i.pravatar.cc/100?img=3">
              <!-- {{ username.charAt(0) }} -->
            </el-avatar>
            <span>{{ username }} ({{ role }})</span>
            <el-button type="danger" size="small" @click="handleLogout">
              退出
            </el-button>
          </div>
        </div>
      </el-header>

      <!-- 顶部 Tabs -->
      <el-header style="background: #f5f5f5;padding: 0;">
        <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab" @tab-click="handleTabClick">
          <el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.title" :name="tab.path" />
        </el-tabs>
      </el-header>

      <!-- 内容区 -->
      <el-main >
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
