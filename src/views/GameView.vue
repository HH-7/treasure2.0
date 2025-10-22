<template>
  <div class="game-view">
    <div v-if="!gameStore.isGameCompleted" class="game-container">
      <div class="game-header">
        <button @click="exitGame" class="btn-back">← 返回</button>
        <h2>{{ gameStore.currentRegion?.name }}</h2>
        <div class="current-score">得分: {{ gameStore.currentScore }}</div>
      </div>
      
      <ProgressBar
        :current="gameStore.currentLevel + 1"
        :total="gameStore.getTotalLevels"
      />
      
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :level="gameStore.currentLevel + 1"
        @answer="handleAnswer"
      />
    </div>
    
    <div v-else class="completion-screen">
      <div class="completion-card">
        <div class="completion-icon">🎉</div>
        <h2>恭喜完成探险！</h2>
        <p class="region-name">{{ gameStore.currentRegion?.name }}</p>
        <div class="final-score">
          <span class="label">最终得分</span>
          <span class="score">{{ gameStore.currentScore }}</span>
        </div>
        <div class="completion-actions">
          <button @click="playAgain" class="btn-primary">
            再玩一次
          </button>
          <button @click="backToMain" class="btn-secondary">
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../stores/game'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import ProgressBar from '../components/ProgressBar.vue'
import QuestionCard from '../components/QuestionCard.vue'

const gameStore = useGameStore()
const userStore = useUserStore()
const router = useRouter()

const currentQuestion = computed(() => gameStore.getCurrentQuestion)

onMounted(() => {
  // 自动开始图书馆游戏
  if (!gameStore.currentRegion) {
    gameStore.startGame()
  }
})

const handleAnswer = (answerIndex) => {
  const result = gameStore.answerQuestion(answerIndex)
  
  if (result.correct) {
    setTimeout(() => {
      gameStore.nextLevel()
      
      if (gameStore.isGameCompleted) {
        userStore.updateUserScore(gameStore.currentScore)
      }
    }, 1500)
  }
}

const exitGame = () => {
  if (confirm('确定要退出当前游戏吗？进度将不会保存。')) {
    gameStore.resetGame()
    router.push('/main')
  }
}

const playAgain = () => {
  gameStore.startGame()
}

const backToMain = () => {
  gameStore.resetGame()
  router.push('/main')
}
</script>

<style scoped>
.game-view {
  min-height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-container {
  width: 100%;
  max-width: 800px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.3);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.1);
}

.game-header h2 {
  color: #4ade80;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.btn-back {
  background: linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(71, 85, 105, 0.8));
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: linear-gradient(135deg, #334155, #475569);
  box-shadow: 0 0 15px rgba(148, 163, 184, 0.3);
}

.current-score {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
  animation: glow-pulse 2s ease-in-out infinite;
}

.completion-screen {
  width: 100%;
  max-width: 600px;
}

.completion-card {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 3px solid rgba(74, 222, 128, 0.5);
  border-radius: 20px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2);
  animation: bounce-in 0.5s;
}

.completion-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(74, 222, 128, 0.8));
  animation: float 2s ease-in-out infinite;
}

.completion-card h2 {
  color: #e2e8f0;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.6);
}

.region-name {
  color: #4ade80;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
}

.final-score {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3));
  border: 2px solid #4ade80;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 0 30px rgba(74, 222, 128, 0.5);
  animation: glow-pulse 2s ease-in-out infinite;
}

.final-score .label {
  display: block;
  color: #86efac;
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.final-score .score {
  display: block;
  color: #4ade80;
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 0 0 30px rgba(74, 222, 128, 0.8);
}

.completion-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-color: #4ade80;
  color: #0a0e1a;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 0 25px rgba(74, 222, 128, 0.5);
  transform: translateY(-2px);
}

.btn-secondary {
  background: linear-gradient(135deg, rgba(51, 65, 85, 0.5), rgba(71, 85, 105, 0.5));
  border-color: rgba(148, 163, 184, 0.5);
  color: #cbd5e1;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #334155, #475569);
  border-color: #94a3b8;
  box-shadow: 0 0 20px rgba(148, 163, 184, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .game-header {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .game-header h2 {
    width: 100%;
    text-align: center;
    order: -1;
  }
  
  .completion-card {
    padding: 30px 20px;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(74, 222, 128, 0.8);
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