import Layout from '@/layout/index.vue'
import i18n from '@/locales/i18n'
import Home from '@/views/Home/index.vue'
import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

export const configRoutes = {
  path: '/config',
  name: 'Config',
  component: () => import('@/views/Config/index.vue'),
  children: [
    {
      path: '',
      redirect: '/config/person',
    },
    {
      path: '/config/person',
      name: 'PersonConfig',
      component: () => import('@/views/Config/Person/PersonConfig.vue'),
      meta: {
        title: i18n.global.t('sidebar.personConfiguration'),
        icon: 'person',
      },
      children: [
        {
          path: '',
          redirect: '/config/person/all',
        },
        {
          path: '/config/person/all',
          name: 'AllPersonConfig',
          component: () => import('@/views/Config/Person/PersonAll.vue'),
          meta: {
            title: i18n.global.t('sidebar.personList'),
            icon: 'all',
          },
        },
        {
          path: '/config/person/already',
          name: 'AlreadyPerson',
          component: () => import('@/views/Config/Person/PersonAlready.vue'),
          meta: {
            title: i18n.global.t('sidebar.winnerList'),
            icon: 'already',
          },
        },
      ],
    },
    {
      path: '/config/prize',
      name: 'PrizeConfig',
      component: () => import('@/views/Config/Prize/PrizeConfig.vue'),
      meta: {
        title: i18n.global.t('sidebar.prizeConfiguration'),
        icon: 'prize',
      },
    },
    {
      path: '/config/global',
      name: 'GlobalConfig',
      redirect: '/config/global/all',
      meta: {
        title: i18n.global.t('sidebar.globalSetting'),
        icon: 'global',
      },
      children: [
        {
          path: '/config/global/face',
          name: 'FaceConfig',
          component: () => import('@/views/Config/Global/FaceConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.viewSetting'),
            icon: 'face',
          },
        },
        {
          path: '/config/global/image',
          name: 'ImageConfig',
          component: () => import('@/views/Config/Global/ImageConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.imagesManagement'),
            icon: 'image',
          },
        },
        {
          path: '/config/global/music',
          name: 'MusicConfig',
          component: () => import('@/views/Config/Global/MusicConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.musicManagement'),
            icon: 'music',
          },
        },
      ],
    },
    {
      path: '/config/readme',
      name: 'Readme',
      component: () => import('@/views/Config/Readme/index.vue'),
      meta: {
        title: i18n.global.t('sidebar.operatingInstructions'),
        icon: 'readme',
      },
    },
  ],
}
const routes = [
  {
    path: '/',
    redirect: '/entry',
  },
  {
    path: '/entry',
    name: 'Entry',
    component: () => import('@/views/Entry/index.vue'),
  },
  {
    path: '/t/:themeId',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ThemeHome',
        component: Home,
      },
      {
        path: 'config',
        name: 'ThemeConfig',
        component: () => import('@/views/Config/index.vue'),
        children: configRoutes.children,
      },
      {
        path: 'demo',
        name: 'ThemeDemo',
        component: () => import('@/views/Demo/index.vue'),
      },
    ],
  },
  // 保留旧路由兼容
  {
    path: '/home',
    component: Layout,
    redirect: '/entry',
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: '/demo',
        name: 'Demo',
        component: () => import('@/views/Demo/index.vue'),
      },
      configRoutes,
    ],
  },
];
const envMode=import.meta.env.MODE;
const router = createRouter({
    // 读取环境变量
  history: envMode==='file'?createWebHashHistory():createWebHistory(),
  routes,
})

// 路由守卫：检查是否已选择主题
router.beforeEach((to, _from, next) => {
  // 入口页面不需要检查
  if (to.name === 'Entry') {
    next()
    return
  }
  
  // 旧路由重定向到入口页面（强制用户选择主题）
  if (to.path === '/home' || to.name === 'Home') {
    next({ name: 'Entry' })
    return
  }
  
  // 如果URL中有主题ID参数，设置当前主题ID（实际验证在页面加载时进行）
  const themeIdFromUrl = to.params.themeId as string
  if (themeIdFromUrl) {
    // 设置当前主题ID到localStorage
    const themeData = localStorage.getItem('themeStore')
    try {
      const parsed = themeData ? JSON.parse(themeData) : { themes: [], currentThemeId: '' }
      parsed.currentThemeId = themeIdFromUrl
      localStorage.setItem('themeStore', JSON.stringify(parsed))
    } catch {
      localStorage.setItem('themeStore', JSON.stringify({ themes: [], currentThemeId: themeIdFromUrl }))
    }
    next()
    return
  }
  
  // 检查是否已选择主题
  const themeData = localStorage.getItem('themeStore')
  if (themeData) {
    try {
      const parsed = JSON.parse(themeData)
      if (parsed.currentThemeId) {
        next()
        return
      }
    } catch {
      // 解析失败，跳转到入口页
    }
  }
  
  // 未选择主题，跳转到入口页
  next({ name: 'Entry' })
})

export default router
