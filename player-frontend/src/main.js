import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 1. 导入插件：Lottie 和 Element Plus
import Vue3Lottie from 'vue3-lottie'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 2. 导入 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 3. 创建 Vue 应用实例和 Pinia 实例（全局各只需一次）
const app = createApp(App)
const pinia = createPinia()

// 4. 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 5. 统一安装所有插件 (注意顺序：通常先 Pinia 再 Router)
app.use(pinia)       // 使用状态管理
app.use(router)      // 使用路由
app.use(Vue3Lottie)  // 使用 Lottie 动画插件
app.use(ElementPlus) // 使用 Element Plus UI 库

// 6. 最后：挂载到 DOM 节点（全局只需一次）
app.mount('#app')