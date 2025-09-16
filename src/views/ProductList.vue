<script setup>
import request from '@/utils/request'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const fetchProducts = async () => {
  try {
    tableData.value = await request.post('/product/list')
  } catch (e) {
    console.error(e)
    ElMessage.error('获取用户失败')
  }
}

onMounted(() => {
  fetchProducts()
})

//=========添加商品
const dialogVisible = ref(false)
const newProduct = ref({ name: '', price: '' })

const openDialog = () => {
  newProduct.value = { name: '', price: '' }
  dialogVisible.value = true
}

const addProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price) {
    ElMessage.warning('请输入商品和价格')
    return
  }
  await request.post('/products', newProduct.value)
  ElMessage.success('添加成功')
  dialogVisible.value = false
  fetchProducts()
}

//=========编辑商品
const editDialogVisible = ref(false)
const editProduct = ref({ id: null, name: '', email: '' })

const openEditDialog = (row) => {
  editProduct.value = { ...row } // 拷贝数据
  editDialogVisible.value = true
}

const updateProduct = async () => {
  if (!editProduct.value.name || !editProduct.value.price) {
    ElMessage.warning('请输入商品和价格')
    return
  }
  await request.put(`/products/${editProduct.value.id}`, editProduct.value)
  ElMessage.success('修改成功')
  editDialogVisible.value = false
  fetchProducts()
}
//=========删除商品

const delProductId = ref(null)
const deleteDialogVisible = ref(false)

const openDelDialog = (id) => {
  delProductId.value = id;
  deleteDialogVisible.value = true
}

const delProduct = async () => {
  await request.delete(`/products/${delProductId.value}`)
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
  fetchProducts()
}





</script>
<template>

<div>
    <!-- 添加用户按钮 -->
    <el-button type="primary" @click="openDialog">添加商品</el-button>
    <el-table :data="tableData" border style="margin-top: 16px;width: 30%">
      <el-table-column prop="id" label="Id" width="180" />
      <el-table-column prop="name" label="商品" width="180" />
      <el-table-column prop="price" label="价格" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="openDelDialog(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加用户对话框 -->
    <el-dialog v-model="dialogVisible" title="添加商品" width="400px">
      <el-form :model="newProduct" label-width="80px">
        <el-form-item label="商品">
          <el-input v-model="newProduct.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="newProduct.price" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addProduct">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="400px">
      <el-form :model="editProduct" label-width="80px">
        <el-form-item label="商品">
          <el-input v-model="editProduct.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editProduct.price" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateProduct">保存</el-button>
      </template>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog v-model="deleteDialogVisible" title="提醒" width="500">
      <span>确认要删除吗?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="delProduct">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>


  </div>



</template>
