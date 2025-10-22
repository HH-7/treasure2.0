import { createApp } from 'vue'
import { createPinia } from 'pinia' // 导入 Pinia
import App from './App.vue'
import router from './router'

// 1. 创建 Pinia 实例
const pinia = createPinia()

// 2. 创建 Vue 应用
const app = createApp(App)

// 3. 先安装 Pinia（关键！必须在使用 store 和挂载应用前）
app.use(pinia)
// 再安装路由
app.use(router)

// 4. 最后挂载应用
app.mount('#app')