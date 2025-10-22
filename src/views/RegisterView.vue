<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>🎯 加入探险队</h1>
        <p>创建账号，开始你的图书馆冒险</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            required
            minlength="3"
          />
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码 (至少6位)"
            required
            minlength="6"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
        
        <button type="submit" class="btn-primary">
          注册账号
        </button>
      </form>
      
      <div class="login-link">
        <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

const handleRegister = () => {
  error.value = ''
  success.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  try {
    userStore.register(username.value, password.value, email.value)
    success.value = '注册成功！2秒后跳转到登录页面...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%);
  position: relative;
  overflow: hidden;
}

.register-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite reverse;
}

.register-card {
  background: linear-gradient(135deg, #161b26 0%, #1a1f2e 100%);
  border: 2px solid rgba(74, 222, 128, 0.3);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(74, 222, 128, 0.2);
  animation: bounce-in 0.5s;
  position: relative;
  z-index: 1;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  color: #4ade80;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.register-header p {
  color: #e2e8f0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input {
  padding: 12px 15px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 10px;
  font-size: 1rem;
  background: rgba(10, 14, 26, 0.5);
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #4ade80;
  outline: none;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  color: #6ee7b7;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #0a0e1a;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 10px;
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 25px rgba(74, 222, 128, 0.5);
  transform: translateY(-3px);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #e2e8f0;
}

.login-link a {
  color: #4ade80;
  text-decoration: none;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
  transition: all 0.3s ease;
}

.login-link a:hover {
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.6);
  color: #22c55e;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
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