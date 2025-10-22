<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <h1>🎯 寻宝游戏</h1>
      </div>
      
      <nav class="nav">
        <router-link to="/main/game" class="nav-link">
          🎮 开始寻宝
        </router-link>
        <router-link to="/main/ranking" class="nav-link">
          🏆 排行榜
        </router-link>
        <router-link to="/main/user-management" class="nav-link">
          👤 个人中心
        </router-link>
      </nav>
      
      <div class="user-info">
        <div class="user-details">
          <span class="username">{{ userStore.currentUser?.username }}</span>
          <span class="score">⭐ {{ userStore.currentUser?.totalScore || 0 }} 分</span>
        </div>
        <button @click="handleLogout" class="btn-logout">
          退出
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, rgba(22, 27, 38, 0.95) 0%, rgba(26, 31, 46, 0.95) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.1);
  border-bottom: 1px solid rgba(74, 222, 128, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.logo h1 {
  color: #4ade80;
  font-size: 1.5rem;
  margin: 0;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.nav {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 500;
  transition: all 0.3s ease;
  background: transparent;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.username {
  font-weight: 600;
  color: #e2e8f0;
  text-shadow: 0 0 5px rgba(74, 222, 128, 0.3);
}

.score {
  font-size: 0.9rem;
  color: #4ade80;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.btn-logout {
  padding: 8px 20px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8));
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(239, 68, 68, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .nav {
    justify-content: center;
    order: 3;
    width: 100%;
  }
  
  .user-info {
    justify-content: space-between;
    order: 2;
    width: 100%;
  }
  
  .logo {
    order: 1;
    text-align: center;
  }
}
</style>