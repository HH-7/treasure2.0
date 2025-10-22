import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [], // 存储所有用户
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null, // 当前登录用户
    token: localStorage.getItem('token') || null // 登录令牌
  }),

  getters: {
    isLoggedIn: (state) => !!state.token, // 判断是否登录
    getUserById: (state) => (id) => state.users.find(u => u.id === id) // 根据ID获取用户
  },

  actions: {
    // 注册新用户
    register(username, password, email) {
      // 检查用户名是否已存在
      const existingUser = this.users.find(u => u.username === username)
      if (existingUser) {
        throw new Error('用户名已存在')
      }

      // 创建新用户
      const newUser = {
        id: Date.now(), // 用时间戳作为唯一ID
        username,
        password, // 注意：实际项目需加密存储
        email,
        totalScore: 0,
        completedRegions: [],
        createdAt: new Date().toISOString()
      }

      // 保存用户数据
      this.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(this.users))
      return newUser
    },

    // 用户登录
    login(username, password) {
      // 查找用户（精确匹配用户名）
      const user = this.users.find(u => u.username === username)
      if (!user) {
        throw new Error('用户名不存在')
      }

      // 验证密码
      if (user.password !== password) {
        throw new Error('密码错误')
      }

      // 登录成功：更新状态并持久化
      this.currentUser = user
      this.token = `token_${Date.now()}_${user.id}` // 生成临时令牌
      localStorage.setItem('token', this.token)
      localStorage.setItem('currentUser', JSON.stringify(user))
    },

    // 用户登出
    logout() {
      this.currentUser = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    },

    // 更新用户分数和完成区域
    updateUserScore(score) {
      if (this.currentUser) {
        this.currentUser.totalScore += score
        
        // 标记图书馆为已完成区域（示例）
        if (!this.currentUser.completedRegions.includes('library')) {
          this.currentUser.completedRegions.push('library')
        }

        // 同步更新用户列表
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id)
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.currentUser }
        }

        // 持久化数据
        this.saveUsers()
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
    },

    // 保存用户列表到本地存储
    saveUsers() {
      localStorage.setItem('users', JSON.stringify(this.users))
    }
  }
})