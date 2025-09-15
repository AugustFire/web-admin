<template>
  <!-- 有子菜单 -->
  <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
    <template #title>
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <span>{{ item.title }}</span>
    </template>
    <MenuItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>

  <!-- 无子菜单 -->
  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
    <span>{{ item.title }}</span>
  </el-menu-item>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  item: { type: Object, required: true }
})
</script>
