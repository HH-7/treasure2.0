<template>
  <div class="new-game-view">
    <!-- 顶部控制栏 -->
    <div class="game-controls">
      <div class="library-info">
        <div class="library-icon">📚</div>
        <div class="library-details">
          <h3>{{ gameStore.currentRegion?.name }}</h3>
          <p>{{ gameStore.currentRegion?.description }}</p>
        </div>
      </div>
      
      <div class="options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="fastMode" />
          <span>快速模式</span>
        </label>
      </div>
    </div>
    
    <!-- 关卡选择区 -->
    <div class="levels-section">
      <div 
        v-for="(level, index) in currentRegionLevels" 
        :key="index"
        @click="selectLevel(index)"
        :class="['level-card', { 
          active: currentLevel === index,
          completed: index < currentLevel,
          locked: index > currentLevel 
        }]"
      >
        <div class="level-number">{{ index + 1 }}</div>
        <div class="level-name">{{ getLevelName(index) }}</div>
      </div>
    </div>
    
    <!-- 主游戏区域 -->
    <div class="game-main-area">
      <!-- 左侧进度 -->
      <div class="left-panel">
        <div class="progress-section">
          <div class="progress-title">探险进度</div>
          <div class="circular-progress">
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(148, 163, 184, 0.2)" stroke-width="8"/>
              <circle 
                cx="60" cy="60" r="50" 
                fill="none" 
                stroke="url(#gradient)" 
                stroke-width="8"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#4ade80;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#22c55e;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
            <div class="progress-text">{{ gameProgress }}%</div>
          </div>
        </div>
      </div>
      
      <!-- 中间内容区 -->
      <div class="center-panel">
        <div v-if="!gameStarted" class="welcome-screen">
          <div class="wizard-icon">🧙</div>
          <h2 class="welcome-title">欢迎来到{{ gameStore.currentRegion?.name }}！</h2>
          <p class="welcome-text">
            高悬的书架上布满了灰尘，空气中弥漫着陈旧纸张的气息。
            无数古籍中可能藏有宝藏的线索，需要仔细搜寻。
          </p>
          
          <div class="question-area" v-if="currentQuestion">
            <div class="question-card-new">
              <div class="question-header-new">
                <span class="question-label">第 {{ currentLevel + 1 }} 关挑战</span>
                <span class="question-points">{{ currentQuestion.points }} 分</span>
              </div>
              
              <h3 class="question-text-new">{{ currentQuestion.question }}</h3>
              
              <div class="options-grid">
                <button
                  v-for="(option, idx) in currentQuestion.options"
                  :key="idx"
                  @click="handleAnswer(idx)"
                  :class="['option-btn-new', {
                    selected: selectedAnswer === idx,
                    correct: showResult && idx === currentQuestion.answer,
                    incorrect: showResult && selectedAnswer === idx && idx !== currentQuestion.answer
                  }]"
                  :disabled="showResult"
                >
                  <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
                  <span class="option-text-new">{{ option }}</span>
                </button>
              </div>
              
              <div v-if="showResult" :class="['result-banner', { success: isCorrect }]">
                <span v-if="isCorrect">✓ 回答正确！</span>
                <span v-else>✗ 回答错误</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="treasureFound" class="treasure-animation">
          <div class="treasure-found">
            <div class="treasure-icon-big">{{ foundTreasure?.icon }}</div>
            <h3>发现宝藏！</h3>
            <p>{{ foundTreasure?.name }}</p>
            <div :class="['rarity-badge', foundTreasure?.rarity]">
              {{ getRarityText(foundTreasure?.rarity) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧宝藏 -->
      <div class="right-panel">
        <div class="treasure-display">
          <div class="treasure-icon">📚</div>
          <h3 class="treasure-title">宝藏{{ treasureStore.getCollectedCount > 0 ? '已发现' : '尚未发现' }}</h3>
        </div>
        
        <div class="status-panel">
          <h4 class="status-title">探险状态</h4>
          <div class="status-item">
            <span class="status-label">探险进度</span>
            <span class="status-value gold">{{ gameProgress }}%</span>
          </div>
          <div class="status-item">
            <span class="status-label">成功步骤</span>
            <span class="status-value">{{ currentLevel }}/{{ totalLevels }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">宝藏收集</span>
            <span class="status-value">{{ treasureStore.getCollectedCount }}/{{ treasureStore.getTotalCount }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">探险时间</span>
            <span class="status-value">{{ formatTime(elapsedTime) }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">探险状态</span>
            <span class="status-value cyan">{{ gameStatus }}</span>
          </div>
        </div>
        
        <div class="collected-treasures">
          <h4>已收集宝藏</h4>
          <div class="treasure-grid">
            <div 
              v-for="treasure in regionTreasures" 
              :key="treasure.id"
              :class="['treasure-item', { collected: treasureStore.isCollected(treasure.id) }]"
              :title="treasure.name"
            >
              {{ treasure.icon }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作按钮 -->
    <div class="game-actions">
      <button @click="toggleGame" :class="['action-btn', 'start-btn', { active: gameStarted }]">
        {{ gameStarted ? '暂停' : '开始探险' }}
      </button>
      <button @click="pauseGame" class="action-btn pause-btn">暂停</button>
      <button @click="restartGame" class="action-btn restart-btn">重新开始</button>
      <button @click="saveProgress" class="action-btn save-btn">保存进度</button>
      <button @click="loadProgress" class="action-btn load-btn">加载进度</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'
import { useTreasureStore } from '../stores/treasure'

const gameStore = useGameStore()
const treasureStore = useTreasureStore()

const fastMode = ref(false)
const gameStarted = ref(false)
const currentLevel = ref(0)
const selectedAnswer = ref(null)
const showResult = ref(false)
const isCorrect = ref(false)
const treasureFound = ref(false)
const foundTreasure = ref(null)
const elapsedTime = ref(0)
const timerInterval = ref(null)

const currentRegionLevels = computed(() => gameStore.currentRegion?.levels || [])
const totalLevels = computed(() => currentRegionLevels.value.length)
const currentQuestion = computed(() => {
  if (currentLevel.value < currentRegionLevels.value.length) {
    return currentRegionLevels.value[currentLevel.value]
  }
  return null
})

const gameProgress = computed(() => {
  if (totalLevels.value === 0) return 0
  return Math.round((currentLevel.value / totalLevels.value) * 100)
})

const circumference = 2 * Math.PI * 50
const progressOffset = computed(() => {
  const progress = gameProgress.value / 100
  return circumference * (1 - progress)
})

const gameStatus = computed(() => {
  if (!gameStarted.value) return '准备中'
  if (currentLevel.value >= totalLevels.value) return '已完成'
  return '进行中'
})

const regionTreasures = computed(() => {
  return treasureStore.getTreasuresByRegion(gameStore.currentRegion?.id)
})

const getLevelName = (index) => {
  const names = [
    '寻找文献',
    '解读密码',
    '移动书架谜题',
    '守护者大厅',
    '知识考验'
  ]
  return names[index] || `第${index + 1}关`
}

const selectLevel = (index) => {
  if (index <= currentLevel.value) {
    currentLevel.value = index
    resetAnswer()
  }
}

const handleAnswer = (answerIndex) => {
  if (showResult.value) return
  
  selectedAnswer.value = answerIndex
  showResult.value = true
  const result = gameStore.answerQuestion(answerIndex)
  isCorrect.value = result.correct
  
  if (result.correct) {
    // 答对有概率发现宝藏
    if (result.treasureFound && regionTreasures.value.length > 0) {
      const uncollected = regionTreasures.value.filter(t => !treasureStore.isCollected(t.id))
      if (uncollected.length > 0) {
        foundTreasure.value = uncollected[Math.floor(Math.random() * uncollected.length)]
        treasureStore.collectTreasure(foundTreasure.value.id)
        treasureFound.value = true
        
        setTimeout(() => {
          treasureFound.value = false
        }, 3000)
      }
    }
    
    setTimeout(() => {
      currentLevel.value++
      resetAnswer()
    }, 2000)
  } else {
    setTimeout(() => {
      resetAnswer()
    }, 2000)
  }
}

const resetAnswer = () => {
  selectedAnswer.value = null
  showResult.value = false
  isCorrect.value = false
}

const toggleGame = () => {
  gameStarted.value = !gameStarted.value
  if (gameStarted.value && !timerInterval.value) {
    startTimer()
  } else if (!gameStarted.value && timerInterval.value) {
    stopTimer()
  }
}

const pauseGame = () => {
  gameStarted.value = false
  stopTimer()
}

const restartGame = () => {
  if (confirm('确定要重新开始吗？当前进度将丢失。')) {
    currentLevel.value = 0
    elapsedTime.value = 0
    gameStore.currentScore = 0
    resetAnswer()
    gameStarted.value = false
    stopTimer()
  }
}

const saveProgress = () => {
  gameStore.saveProgress()
  alert('进度已保存！')
}

const loadProgress = () => {
  if (gameStore.loadProgress()) {
    currentLevel.value = gameStore.currentLevel
    alert('进度已加载！')
  } else {
    alert('没有保存的进度')
  }
}

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const getRarityText = (rarity) => {
  const map = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return map[rarity] || '未知'
}

onMounted(() => {
  // 自动开始图书馆游戏
  if (!gameStore.currentRegion) {
    gameStore.startGame()
  }
  treasureStore.loadTreasures()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.new-game-view {
  min-height: calc(100vh - 100px);
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.library-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.library-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

.library-details h3 {
  color: #4ade80;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
}

.library-details p {
  color: #e2e8f0;
  margin: 0;
  opacity: 0.9;
}

.options {
  display: flex;
  gap: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  cursor: pointer;
  font-weight: 600;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.levels-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.level-card {
  background: linear-gradient(135deg, #161b26, #1a1f2e);
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  padding: 20px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  flex-shrink: 0;
}

.level-card.active {
  border-color: #4ade80;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.1));
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.level-card.completed {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));
}

.level-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.level-card:not(.locked):hover {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.level-number {
  font-size: 1.8rem;
  font-weight: 900;
  color: #4ade80;
  margin-bottom: 8px;
}

.level-name {
  font-size: 0.9rem;
  color: #e2e8f0;
  font-weight: 600;
}

.game-main-area {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 20px;
  margin-bottom: 20px;
  min-height: 500px;
}

.left-panel, .center-panel, .right-panel {
  background: linear-gradient(135deg, #161b26, #1a1f2e);
  border: 2px solid rgba(74, 222, 128, 0.3);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.1);
}

.progress-section {
  text-align: center;
}

.progress-title {
  color: #4ade80;
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.circular-progress {
  position: relative;
  display: inline-block;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 900;
  color: #4ade80;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.8);
}

.center-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.welcome-screen {
  text-align: center;
  width: 100%;
}

.wizard-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.welcome-title {
  color: #4ade80;
  font-size: 2rem;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.welcome-text {
  color: #e2e8f0;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.question-area {
  width: 100%;
  margin-top: 20px;
}

.question-card-new {
  background: rgba(10, 14, 26, 0.5);
  border: 2px solid rgba(74, 222, 128, 0.4);
  border-radius: 15px;
  padding: 25px;
}

.question-header-new {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.question-label, .question-points {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 800;
}

.question-label {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
}

.question-points {
  background: rgba(74, 222, 128, 0.3);
  border: 2px solid #4ade80;
  color: #4ade80;
}

.question-text-new {
  color: #e2e8f0;
  font-size: 1.3rem;
  margin-bottom: 20px;
  text-align: center;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.option-btn-new {
  background: linear-gradient(135deg, rgba(22, 27, 38, 0.8), rgba(26, 31, 46, 0.8));
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn-new:hover:not(:disabled) {
  border-color: #4ade80;
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.option-btn-new.selected {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
}

.option-btn-new.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.option-btn-new.incorrect {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.2);
  animation: shake 0.5s;
}

.option-letter {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  flex-shrink: 0;
}

.option-text-new {
  color: #e2e8f0;
  font-weight: 600;
  flex: 1;
  text-align: left;
}

.result-banner {
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-weight: 800;
  font-size: 1.1rem;
  border: 2px solid;
}

.result-banner.success {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #6ee7b7;
}

.result-banner:not(.success) {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fca5a5;
}

.treasure-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.treasure-found {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.95), rgba(34, 197, 94, 0.95));
  border: 3px solid #4ade80;
  border-radius: 20px;
  padding: 40px 60px;
  text-align: center;
  box-shadow: 0 0 50px rgba(74, 222, 128, 0.8);
  animation: bounce-in 0.5s;
}

.treasure-icon-big {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: float 2s ease-in-out infinite;
}

.treasure-found h3 {
  font-size: 2rem;
  color: #0a0e1a;
  margin-bottom: 10px;
}

.treasure-found p {
  font-size: 1.5rem;
  color: #0a0e1a;
  font-weight: 800;
  margin-bottom: 15px;
}

.rarity-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 800;
  display: inline-block;
  color: white;
}

.rarity-badge.common { background: #94a3b8; }
.rarity-badge.rare { background: #3b82f6; }
.rarity-badge.epic { background: #a855f7; }
.rarity-badge.legendary { background: #ef4444; }

.treasure-display {
  text-align: center;
  margin-bottom: 30px;
}

.treasure-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

.treasure-title {
  color: #4ade80;
  font-size: 1.2rem;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.status-panel {
  margin-bottom: 25px;
}

.status-title {
  color: #4ade80;
  font-weight: 800;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.status-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.status-value {
  color: #e2e8f0;
  font-weight: 700;
}

.status-value.gold {
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.status-value.cyan {
  color: #06b6d4;
}

.collected-treasures h4 {
  color: #4ade80;
  font-weight: 800;
  margin-bottom: 15px;
}

.treasure-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.treasure-item {
  aspect-ratio: 1;
  background: rgba(10, 14, 26, 0.5);
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  opacity: 0.3;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.treasure-item.collected {
  opacity: 1;
  filter: grayscale(0%);
  border-color: #4ade80;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
}

.game-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 35px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 1rem;
  border: 2px solid;
  transition: all 0.3s ease;
  cursor: pointer;
}

.start-btn {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #6ee7b7;
}

.start-btn.active {
  background: rgba(74, 222, 128, 0.3);
  border-color: #4ade80;
  color: #4ade80;
}

.pause-btn {
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
  color: #fbbf24;
}

.restart-btn {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fca5a5;
}

.save-btn {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #67e8f9;
}

.load-btn {
  background: rgba(6, 182, 212, 0.2);
  border-color: #06b6d4;
  color: #67e8f9;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px currentColor;
}

@media (max-width: 1200px) {
  .game-main-area {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .level-card {
    min-width: 100px;
    padding: 15px 10px;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>