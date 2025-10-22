<template>
  <div class="main-view">
    <Header />
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  // 如果直接访问 /main，重定向到游戏页面
  if (router.currentRoute.value.path === '/main') {
    router.push('/main/game')
  }
})
</script>

<style scoped>
.main-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%);
  position: relative;
}

.main-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(74, 222, 128, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.main-content {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>