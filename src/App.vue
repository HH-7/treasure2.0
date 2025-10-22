<template>
  <!-- 根组件容器，所有页面内容会在这里渲染 -->
  <div class="app-container">
    <!-- 路由出口：匹配的路由组件会在这里显示（必须有，否则页面空白） -->
    <router-view />
  </div>
</template>

<script setup>
// 无需额外逻辑，确保组件结构完整即可
// 若后续需要添加全局逻辑（如导航守卫、全局状态监听等），可在这里补充
</script>

<style scoped>
/* 基础全局样式，避免页面布局错乱 */
.app-container {
  width: 100%;
  min-height: 100vh; /* 确保容器占满屏幕高度 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>