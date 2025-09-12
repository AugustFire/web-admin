<script setup>
import { ref, watch, watchEffect, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'

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

// watch(
//   () => route.fullPath,
//   (newPath) => {
//     activeTab.value = newPath
//     const exist = tabs.value.find(tab => tab.path === newPath)
//     if (!exist) {
//       tabs.value.push({
//         title: route.meta.title || '未命名',
//         path: newPath
//       })
//     }
//   },
//   { immediate: true }
// )

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

const removeTab = (targetPath) => {
  if (targetPath === '/home') return  // 首页永远不能关
  const index = tabs.value.findIndex(tab => tab.path === targetPath)
  tabs.value.splice(index, 1)
  if (activeTab.value === targetPath) {
    const lastTab = tabs.value[index - 1] || tabs.value[0]
    if (lastTab) router.push(lastTab.path)
  }
}

// const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('username')
  router.push('/login')
}

</script>

<template>
  <!-- <p><strong>Current route path:</strong> {{ $route.fullPath }}</p> -->
  <el-container style="height: 100vh">
    <el-aside :width="isCollapse ? '64px' : '200px' " style="transition: width 0.3s ease;">
      <!-- style="transition: width 0.3s ease;" -->
      <!-- 折叠按钮 -->
      <div style="text-align:center;padding:10px;">
        <el-button link @click="toggleCollapse">
          <el-icon>
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
        </el-button>
      </div>
      <!-- <el-menu router :default-active="route.fullPath" :collapse="isCollapse">
        <template v-for="item in menuRoutes" :key="item.path">
          <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
            <template #title>
              <el-icon v-if="item.meta?.icon" style="margin-right:6px; width: 14px; height: 14px">
                <component :is="item.meta.icon" />
              </el-icon>
              {{ item.meta.title }}
            </template>
<el-menu-item v-for="child in item.children" :key="child.path" :index="`/${item.path}/${child.path}`">
  <el-icon v-if="child.meta?.icon" style="margin-right:6px; width: 14px; height: 14px">
    <component :is="child.meta.icon" />
  </el-icon>
  {{ child.meta.title }}
</el-menu-item>
</el-sub-menu>

<el-menu-item v-else :index="`/${item.path}`">
  <el-icon v-if="item.meta?.icon" style="margin-right:6px; width: 14px; height: 14px">
    <component :is="item.meta.icon" />
  </el-icon>
  {{ item.meta.title }}
</el-menu-item>
</template>
</el-menu> -->
      <el-menu router :default-active="route.fullPath" :collapse="isCollapse">
        <template v-for="item in menuRoutes" :key="item.path">
          <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
            <template #title>
              <el-icon v-if="item.meta?.icon" style="margin-right:6px; width: 14px; height: 14px">
                <component :is="item.meta.icon" />
              </el-icon>
              <span v-if="!isCollapse">{{ item.meta.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="`/${item.path}/${child.path}`">
              <el-icon v-if="child.meta?.icon" style="margin-right:6px; width: 14px; height: 14px">
                <component :is="child.meta.icon" />
              </el-icon>
              <span v-if="!isCollapse">{{ child.meta.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="`/${item.path}`">
            <el-icon v-if="item.meta?.icon" style="margin-right:6px; width: 14px; height: 14px">
              <component :is="item.meta.icon" />
            </el-icon>
            <span v-if="!isCollapse">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <el-header style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <!-- 左侧是系统名称 / 面包屑 -->
          <span>后台管理系统</span>
        </div>
        <div>
          <!-- 右侧退出按钮 -->
          <!-- <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button> -->
          <!-- 右侧用户信息 -->
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
      <el-header style="background: #f5f5f5;">
        <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab" @tab-click="handleTabClick">
          <el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.title" :name="tab.path" />
        </el-tabs>
      </el-header>

      <!-- 内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
