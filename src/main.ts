import { createApp } from 'vue';
import './style.css';
import './style/markdown.css'
import './style/style.scss'
import * as THREE from 'three';
import App from './App.vue';
import VueDOMPurifyHTML from 'vue-dompurify-html'

const app = createApp(App);
// 全局svg组件
import 'virtual:svg-icons-register';
import svgIcon from '@/components/SvgIcon/index.vue';
// svg全局组件// 路由
import router from '@/router';
// pinia
import { createPinia } from 'pinia';
// pinia持久化
import piniaPluginPersist from 'pinia-plugin-persist';
const pinia = createPinia();
pinia.use(piniaPluginPersist);

app.config.globalProperties.$THREE = THREE; //挂载到原型
app.component('svg-icon', svgIcon);
app.use(router).use(VueDOMPurifyHTML).use(pinia).mount('#app');
