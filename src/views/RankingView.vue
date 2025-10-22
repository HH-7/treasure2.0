<template>
  <div class="ranking-view">
    <div class="ranking-container">
      <div class="ranking-header">
        <h2>🏆 探险家排行榜</h2>
        <p>最优秀的图书馆探险家们</p>
      </div>
      
      <div class="ranking-list">
        <div
          v-for="(user, index) in rankedUsers"
          :key="user.id"
          class="ranking-item"
          :class="{
            'current-user': user.id === userStore.currentUser?.id,
            'top-three': index < 3
          }"
        >
          <div class="rank">
            <span v-if="index === 0" class="medal">🥇</span>
            <span v-else-if="index === 1" class="medal">🥈</span>
            <span v-else-if="index === 2" class="medal">🥉</span>
            <span v-else class="rank-number">{{ index + 1 }}</span>
          </div>
          
          <div class="user-avatar">
            {{ user.username.charAt(0).toUpperCase() }}
          </div>
          
          <div class="user-details">
            <div class="username">
              {{ user.username }}
              <span v-if="user.id === userStore.currentUser?.id" class="you-badge">你</span>
            </div>
            <div class="user-stats">
              <span class="stat">
                <span class="stat-icon">📚</span>
                {{ user.completedRegions.length }} 个区域
              </span>
              <span class="stat">
                <span class="stat-icon">📅</span>
                {{ formatDate(user.createdAt) }}
              </span>
            </div>
          </div>
          
          <div class="user-score">
            <div class="score-value">{{ user.totalScore }}</div>
            <div class="score-label">总分</div>
          </div>
        </div>
        
        <div v-if="rankedUsers.length === 0" class="empty-state">
          <div class="empty-icon">🎮</div>
          <p>还没有玩家完成探险</p>
          <p class="empty-hint">成为第一个探险家吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const rankedUsers = computed(() => {
  return [...userStore.users]
    .filter(user => user.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<style scoped>
.ranking-view {
  padding: 20px 0;
}

.ranking-container {
  max-width: 900px;
  margin: 0 auto;
}

.ranking-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.ranking-header h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #4ade80;
  text-shadow: 0 0 30px rgba(74, 222, 128, 0.6),
               0 0 60px rgba(74, 222, 128, 0.4);
  animation: glow-pulse 3s ease-in-out infinite;
}

.ranking-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  color: #cbd5e1;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ranking-item {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 15px;
  padding: 20px 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: bounce-in 0.5s;
  animation-fill-mode: both;
}

.ranking-item:nth-child(1) { animation-delay: 0.1s; }
.ranking-item:nth-child(2) { animation-delay: 0.2s; }
.ranking-item:nth-child(3) { animation-delay: 0.3s; }
.ranking-item:nth-child(4) { animation-delay: 0.4s; }
.ranking-item:nth-child(5) { animation-delay: 0.5s; }

.ranking-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2);
  border-color: rgba(74, 222, 128, 0.4);
}

.ranking-item.current-user {
  border: 3px solid #4ade80;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.1));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.2);
}

.ranking-item.top-three {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(34, 197, 94, 0.1));
  border-color: rgba(74, 222, 128, 0.3);
}

.rank {
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.medal {
  font-size: 2rem;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e2e8f0;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.username {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.you-badge {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 800;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.user-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat {
  color: #94a3b8;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-icon {
  font-size: 1rem;
}

.user-score {
  text-align: center;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3));
  border: 2px solid #4ade80;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
}

.score-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #4ade80;
  line-height: 1;
  margin-bottom: 5px;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.8);
}

.score-label {
  font-size: 0.8rem;
  color: #86efac;
  opacity: 0.9;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.3);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.2);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px rgba(74, 222, 128, 0.3));
}

.empty-state p {
  color: #e2e8f0;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.empty-hint {
  color: #94a3b8;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .ranking-item {
    padding: 15px;
    gap: 12px;
  }
  
  .rank {
    width: 40px;
  }
  
  .medal {
    font-size: 1.5rem;
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .username {
    font-size: 1.1rem;
  }
  
  .user-stats {
    flex-direction: column;
    gap: 5px;
  }
  
  .user-score {
    padding: 8px 15px;
  }
  
  .score-value {
    font-size: 1.5rem;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    text-shadow: 0 0 30px rgba(74, 222, 128, 0.6),
                 0 0 60px rgba(74, 222, 128, 0.4);
  }
  50% {
    text-shadow: 0 0 40px rgba(74, 222, 128, 0.8),
                 0 0 80px rgba(74, 222, 128, 0.6);
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