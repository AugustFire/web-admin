import axios from 'axios'

const service = axios.create({
  // baseURL: 'http://localhost:3001', // 你的后端接口地址
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器（可加 token）
service.interceptors.request.use(config => {
  // 可以在这里添加 token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 添加统一格式转换
service.interceptors.response.use(
  response => {
    const res = response.data

    // 检查响应是否符合预期格式
    if (typeof res === 'object' && 'code' in res) {
      // 假设 code 为 0 表示成功（具体根据您的后端定义调整）
      if (res.code === 0 || res.code === 200) {
        // 成功时只返回 data 部分
        return res.data
      } else {
        // 失败时显示错误信息并拒绝 Promise
        console.error('接口错误:', res.msg || '未知错误')
        return Promise.reject(new Error(res.msg || '请求失败'))
      }
    } else {
      // 如果不是预期的格式，原样返回
      return res
    }
  },
  error => {
    // 网络错误处理
    console.error('网络请求错误:', error)
    let errorMessage = '网络连接异常'
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status
      errorMessage = `请求失败 (${status})`
      if (error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      errorMessage = '服务器无响应'
    }
    return Promise.reject(new Error(errorMessage))
  }
)

export default service
