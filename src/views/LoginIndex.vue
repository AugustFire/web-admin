<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()


const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  try {
    const loginForm = {
      username: username.value,
      password: password.value
    }

    // 使用配置好的代理地址
    const userData = await request.post('/auth/login', loginForm)
    console.log(userData)

    // 假设响应拦截器已经处理了统一格式，直接获取用户数据
    localStorage.setItem('token', userData.token)
    localStorage.setItem('role', userData.role)
    localStorage.setItem('username', userData.username)
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    console.log(error)
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<template>
  <div style="display:flex;justify-content:center;align-items:center;height:100vh;">
    <el-card style="width: 300px;">
      <h3 style="text-align:center;">hub-server</h3>
      <el-input v-model="username" placeholder="用户名" style="margin:8px 0;" />
      <el-input v-model="password" placeholder="密码" show-password style="margin:8px 0;" />
      <el-button type="primary" style="width:100%;margin-top:12px;" @click="handleLogin">
        登录
      </el-button>
    </el-card>
  </div>
</template>
