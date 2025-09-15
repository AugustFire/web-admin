<template>
  <el-menu :default-active="active" :collapse="collapse"
    active-text-color="#409EFF" class="menu-container" router>

    <MenuItem v-for="item in menus" :key="item.path" :item="item" />
  </el-menu>
</template>

<script setup>
import { defineProps } from 'vue'
import MenuItem from './MenuItem.vue'

defineProps({
  menus: { type: Array, required: true },     // 菜单数据
  active: { type: String, default: '' },      // 默认激活菜单
  collapse: { type: Boolean, default: false } // 是否折叠
})


</script>

<style scoped>
.menu-container {
  height: 100%;
  border-right: none;
}
</style>
