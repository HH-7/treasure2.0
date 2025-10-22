import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [], // 存储所有用户
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null, // 当前登录用户
    token: localStorage.getItem('token') || null // 登录令牌
  }),

  getters: {
    isLoggedIn: (state) => !!state.token, // 判断是否登录
    getUserById: (state) => (id) => state.users.find({insert\_element\_0\_}以下是针对登录功能及相关核心模块的完整修正代码，整合了登录跳转、密码验证及状态管理的关键逻辑：


### 1. 登录页面（`src/views/LoginView.vue`）
```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="username" 
            required 
            placeholder="请输入用户名"
          >
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="请输入密码"
          >
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
        <p class="error-message" v-if="error">{{ error }}</p>
        <div class="register-link">
          还没有账号？<a @click="$router.push('/register')">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// 登录处理
const handleLogin = async () => {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  try {
    loading.value = true
    // 调用登录方法
    await userStore.login(username.value, password.value)
    // 登录成功跳转至主页面
    router.push('/main')
  } catch (err) {
    error.value = err.message || '登录失败，请检查账号密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-dark);
  padding: 20px;
}

.login-card {
  background: var(--bg-card);
  border-radius: 15px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

h2 {
  color: var(--text-light);
  text-align: center;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: var(--text-dark);
  margin-bottom: 8px;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-light);
  color: var(--text-light);
  font-size: 1rem;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: var(--bg-dark);
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: var(--danger-color);
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: var(--text-dark);
}

.register-link a {
  color: #4ade80;
  cursor: pointer;
  text-decoration: underline;
}
</style>