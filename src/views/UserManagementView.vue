<template>
  <div class="user-management">
    <div class="management-container">
      <div class="management-header">
        <h2>👤 用户管理</h2>
        <p>管理所有注册的探险家</p>
      </div>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-info">
            <div class="stat-value">{{ userStore.users.length }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-info">
            <div class="stat-value">{{ activeUsers }}</div>
            <div class="stat-label">活跃玩家</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalScore }}</div>
            <div class="stat-label">总积分</div>
          </div>
        </div>
      </div>
      
      <div class="user-table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
              <th>总分</th>
              <th>完成状态</th>
              <th>注册日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in userStore.users"
              :key="user.id"
              :class="{ 'current-user-row': user.id === userStore.currentUser?.id }"
            >
              <td>
                <div class="user-cell">
                  <div class="user-avatar-small">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <span class="user-name">{{ user.username }}</span>
                  <span v-if="user.id === userStore.currentUser?.id" class="current-badge">当前</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="score-badge">{{ user.totalScore }}</span>
              </td>
              <td>
                <div class="regions-cell">
                  <span class="region-count">{{ user.completedRegions.length }}</span>
                  <span class="region-icons">
                    <span
                      v-if="user.completedRegions.includes('library')"
                      title="古老的图书馆"
                    >
                      📚
                    </span>
                    <span v-else class="not-completed">未完成</span>
                  </span>
                </div>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    v-if="user.id !== userStore.currentUser?.id"
                    @click="confirmDelete(user)"
                    class="btn-delete"
                    title="删除用户"
                  >
                    🗑️
                  </button>
                  <button
                    @click="viewDetails(user)"
                    class="btn-view"
                    title="查看详情"
                  >
                    👁️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="userStore.users.length === 0" class="empty-users">
          <p>暂无用户数据</p>
        </div>
      </div>
      
      <!-- 用户详情弹窗 -->
      <div v-if="selectedUser" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>用户详情</h3>
            <button @click="closeModal" class="btn-close">×</button>
          </div>
          
          <div class="modal-body">
            <div class="detail-row">
              <span class="detail-label">用户名:</span>
              <span class="detail-value">{{ selectedUser.username }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">邮箱:</span>
              <span class="detail-value">{{ selectedUser.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">总分:</span>
              <span class="detail-value score">{{ selectedUser.totalScore }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">注册时间:</span>
              <span class="detail-value">{{ formatDateTime(selectedUser.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">完成状态:</span>
              <div class="completed-regions">
                <span
                  v-if="selectedUser.completedRegions.includes('library')"
                  class="region-tag"
                >
                  📚 古老的图书馆
                </span>
                <span v-else class="no-regions">
                  尚未完成图书馆探险
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const selectedUser = ref(null)

const activeUsers = computed(() => {
  return userStore.users.filter(u => u.totalScore > 0).length
})

const totalScore = computed(() => {
  return userStore.users.reduce((sum, u) => sum + u.totalScore, 0)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const confirmDelete = (user) => {
  if (confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`)) {
    userStore.deleteUser(user.id)
  }
}

const viewDetails = (user) => {
  selectedUser.value = user
}

const closeModal = () => {
  selectedUser.value = null
}
</script>

<style scoped>
.user-management {
  padding: 20px 0;
}

.management-container {
  max-width: 1200px;
  margin: 0 auto;
}

.management-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.management-header h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #4ade80;
  text-shadow: 0 0 30px rgba(74, 222, 128, 0.6),
               0 0 60px rgba(74, 222, 128, 0.4);
  animation: glow-pulse 3s ease-in-out infinite;
}

.management-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  color: #cbd5e1;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.3);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2);
  border-color: rgba(74, 222, 128, 0.5);
}

.stat-icon {
  font-size: 3rem;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: #4ade80;
  line-height: 1;
  margin-bottom: 5px;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
}

.stat-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.user-table-container {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.3);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(74, 222, 128, 0.1);
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  padding: 15px;
  text-align: left;
  font-weight: 800;
}

.user-table th:first-child {
  border-top-left-radius: 10px;
}

.user-table th:last-child {
  border-top-right-radius: 10px;
}

.user-table td {
  padding: 15px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  color: #e2e8f0;
}

.user-table tr:last-child td {
  border-bottom: none;
}

.user-table tr:hover {
  background: rgba(74, 222, 128, 0.05);
}

.current-user-row {
  background: rgba(74, 222, 128, 0.1) !important;
  border-left: 4px solid #4ade80;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-small {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  flex-shrink: 0;
}

.user-name {
  font-weight: 600;
}

.current-badge {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.score-badge {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(34, 197, 94, 0.3));
  border: 1px solid #4ade80;
  color: #4ade80;
  padding: 5px 12px;
  border-radius: 12px;
  font-weight: 800;
  display: inline-block;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
}

.regions-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.region-count {
  font-weight: 600;
  color: #4ade80;
}

.region-icons {
  display: flex;
  gap: 5px;
  font-size: 1.2rem;
}

.not-completed {
  color: #94a3b8;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-delete, .btn-view {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #fed7d7;
}

.btn-view:hover {
  background: #e6f2ff;
}

.empty-users {
  text-align: center;
  padding: 40px;
  color: #718096;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fade-in 0.3s;
}

.modal-content {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 3px solid rgba(74, 222, 128, 0.5);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2);
  animation: bounce-in 0.3s;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(74, 222, 128, 0.3);
}

.modal-header h3 {
  color: #4ade80;
  font-size: 1.5rem;
  margin: 0;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #718096;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-close:hover {
  color: #ef4444;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 700;
}

.detail-value {
  color: #e2e8f0;
  font-size: 1.1rem;
}

.detail-value.score {
  color: #4ade80;
  font-weight: 900;
  font-size: 1.5rem;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.6);
}

.completed-regions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.region-tag {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2));
  border: 1px solid #4ade80;
  color: #4ade80;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

.no-regions {
  color: #94a3b8;
  font-style: italic;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
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

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .user-table {
    font-size: 0.85rem;
  }
  
  .user-table th,
  .user-table td {
    padding: 10px;
  }
}
</style>