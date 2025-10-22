<template>
  <div class="progress-container">
    <div class="progress-header">
      <span class="progress-text">寻宝进度</span>
      <span class="progress-count">{{ current }} / {{ total }}</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const progressPercentage = computed(() => {
  return (props.current / props.total) * 100
})
</script>

<style scoped>
.progress-container {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.3);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 700;
  color: #e2e8f0;
}

.progress-count {
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  font-weight: 800;
}

.progress-bar {
  height: 20px;
  background: rgba(10, 14, 26, 0.8);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e, #4ade80);
  background-size: 200% 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.6);
  animation: gradient-shift 3s ease infinite;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}
</style>