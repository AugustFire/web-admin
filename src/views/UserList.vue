<script setup>
import { ref, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElLoading } from 'element-plus'

// 表格数据相关状态
const users = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const loading = ref(false)

// 对话框相关状态
const dialogVisible = ref(false)
const newUser = ref({ name: '', email: '' })
const editDialogVisible = ref(false)
const editUser = ref({ id: null, name: '', email: '' })

// 表格多选
const multipleSelection = ref([])

// 排序条件
const sortField = ref('')
const sortOrder = ref('')

// 防抖函数
const debounce = (fn, delay = 300) => {
  let timer = null
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

// 防抖搜索
const debouncedSearch = debounce(() => {
  page.value = 1
  fetchUsers()
}, 500)

// 获取用户列表（分页 + 搜索 + 排序）
const fetchUsers = async () => {
  if (loading.value) return

  loading.value = true
  const loadingInstance = ElLoading.service({ text: '加载中...' })

  try {
    const res = await request.post('/user/page', {
      page: page.value,
      size: pageSize.value,
      name: searchKeyword.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value
    })
    users.value = res.records || []
    total.value = res.total || 0
  } catch (e) {
    console.error('获取用户列表失败:', e)
    ElMessage.error('获取用户失败，请重试')
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

// 初始化数据
onMounted(() => {
  fetchUsers()
})

// 打开新增对话框
const openDialog = () => {
  newUser.value = { name: '', email: '' }
  dialogVisible.value = true
}

// 添加用户
const addUser = async () => {
  // 表单验证
  if (!newUser.value.name.trim()) {
    ElMessage.warning('请输入姓名')
    return
  }

  if (!newUser.value.email.trim()) {
    ElMessage.warning('请输入邮箱')
    return
  }

  // 简单邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newUser.value.email)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  try {
    await request.post('/user/add', newUser.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchUsers()
  } catch (e) {
    console.error('添加用户失败:', e)
    ElMessage.error('添加失败，请重试')
  }
}

// 打开编辑对话框
const openEditDialog = (row) => {
  editUser.value = { ...row } // 深拷贝数据，避免直接修改原数据
  editDialogVisible.value = true
}

// 更新用户
const updateUser = async () => {
  // 表单验证
  if (!editUser.value.name.trim()) {
    ElMessage.warning('请输入姓名')
    return
  }

  if (!editUser.value.email.trim()) {
    ElMessage.warning('请输入邮箱')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(editUser.value.email)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  try {
    await request.post('/user/update', editUser.value)
    ElMessage.success('编辑成功')
    editDialogVisible.value = false
    fetchUsers()
  } catch (e) {
    console.error('更新用户失败:', e)
    ElMessage.error('编辑失败，请重试')
  }
}

// 单个删除
const deleteUser = async (id) => {
  try {
    await request.post(`/user/delete?id=${id}`)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (e) {
    console.error('删除用户失败:', e)
    ElMessage.error('删除失败，请重试')
  }
}

// 批量删除优化
const deleteSelected = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请先选择用户')
    return
  }

  // 提取所有选中用户的ID
  const userIds = multipleSelection.value.map(user => user.id)

  try {
    // 优化为一次请求（如果后端支持）
    // await request.post('/user/delete/batch', { ids: userIds })

    // 如果后端不支持批量接口，保持原逻辑但添加加载状态
    const loadingInstance = ElLoading.service({ text: '删除中...' })
    for (const id of userIds) {
      await request.post(`/user/delete?id=${id}`)
    }
    loadingInstance.close()

    ElMessage.success(`成功删除 ${userIds.length} 个用户`)
    multipleSelection.value = [] // 清空选择
    fetchUsers()
  } catch (e) {
    console.error('批量删除失败:', e)
    ElMessage.error('批量删除失败，请重试')
  }
}

// 搜索处理
const handleSearch = () => {
  page.value = 1
  fetchUsers()
}

// 分页切换
const handlePageChange = (p) => {
  page.value = p
  fetchUsers()
}

// 表格选择变化
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 排序事件处理
const handleSortChange = ({ prop, order }) => {
  if (order === 'ascending') {
    sortField.value = prop
    sortOrder.value = 'asc'
  } else if (order === 'descending') {
    sortField.value = prop
    sortOrder.value = 'desc'
  } else {
    sortField.value = ''
    sortOrder.value = ''
  }
  fetchUsers()
}
</script>

<template>
  <div>
    <h2>用户管理</h2>

    <!-- 搜索框 -->
    <div style="margin-bottom: 12px;">
      <el-input
        v-model="searchKeyword"
        placeholder="输入姓名搜索"
        clearable
        style="width: 200px; margin-right: 8px;"
        @keyup.enter="handleSearch"
        @input="debouncedSearch"
      />
      <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
      <el-button type="primary" @click="openDialog">新增</el-button>
      <el-button
        type="danger"
        @click="deleteSelected"
        :disabled="multipleSelection.length === 0"
      >
        批量删除 ({{ multipleSelection.length }})
      </el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="users"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      v-loading="loading"
      element-loading-text="加载中..."
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="55" label="No" />
      <el-table-column prop="id" label="ID" width="60" sortable="custom" />
      <el-table-column prop="name" label="姓名" sortable="custom" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next, total"
      :total="total"
      :current-page="page"
      :page-size="pageSize"
      @current-change="handlePageChange"
      style="margin-top: 12px; text-align: right;"
    />
  </div>

  <!-- 添加用户对话框 -->
  <el-dialog v-model="dialogVisible" title="添加用户" width="400px">
    <el-form :model="newUser" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="newUser.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="newUser.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addUser">确定</el-button>
    </template>
  </el-dialog>

  <!-- 编辑用户对话框 -->
  <el-dialog v-model="editDialogVisible" title="编辑用户" width="400px">
    <el-form :model="editUser" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="editUser.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editUser.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="updateUser">确定</el-button>
    </template>
  </el-dialog>
</template>
