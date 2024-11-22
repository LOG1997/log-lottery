import svgIcon from '@/components/SvgIcon/index.vue'
import i18n from '@/locales/i18n'
import * as THREE from 'three'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import './style.css'
import './style/markdown.css'
import './style/style.scss'
// 全局svg组件
import 'virtual:svg-icons-register'
// svg全局组件// 路由
import router from '@/router'
// pinia
import { createPinia } from 'pinia'
// pinia持久化
import piniaPluginPersist from 'pinia-plugin-persist'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist)

app.config.globalProperties.$THREE = THREE // 挂载到原型
app.component('svg-icon', svgIcon)
app.use(router).use(VueDOMPurifyHTML).use(pinia).use(i18n).mount('#app')
