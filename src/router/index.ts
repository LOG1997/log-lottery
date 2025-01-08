import Layout from '@/layout/index.vue'
import i18n from '@/locales/i18n'
import Home from '@/views/Home/index.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

export const configRoutes = {
  path: '/log-lottery/config',
  name: 'Config',
  component: () => import('@/views/Config/index.vue'),
  children: [
    {
      path: '',
      redirect: '/log-lottery/config/person',
    },
    {
      path: '/log-lottery/config/person',
      name: 'PersonConfig',
      component: () => import('@/views/Config/Person/PersonConfig.vue'),
      meta: {
        title: i18n.global.t('sidebar.personConfiguration'),
        icon: 'person',
      },
      children: [
        {
          path: '',
          redirect: '/log-lottery/config/person/all',
        },
        {
          path: '/log-lottery/config/person/all',
          name: 'AllPersonConfig',
          component: () => import('@/views/Config/Person/PersonAll.vue'),
          meta: {
            title: i18n.global.t('sidebar.personList'),
            icon: 'all',
          },
        },
        {
          path: '/log-lottery/config/person/already',
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
      path: '/log-lottery/config/prize',
      name: 'PrizeConfig',
      component: () => import('@/views/Config/Prize/PrizeConfig.vue'),
      meta: {
        title: i18n.global.t('sidebar.prizeConfiguration'),
        icon: 'prize',
      },
    },
    {
      path: '/log-lottery/config/global',
      name: 'GlobalConfig',
      redirect: '/log-lottery/config/global/face',
      meta: {
        title: i18n.global.t('sidebar.globalSetting'),
        icon: 'global',
      },
      children: [
        {
          path: '/log-lottery/config/global/face',
          name: 'FaceConfig',
          component: () => import('@/views/Config/Global/FaceConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.viewSetting'),
            icon: 'face',
          },
        },
        {
          path: '/log-lottery/config/global/ability',
          name: 'AbilityConfig',
          component: () => import('@/views/Config/Global/AbilityConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.AbilityConfig'),
            icon: 'face',
          },
        },
      ],
    },
    {
      path: '/log-lottery/config/resource',
      name: 'ResourceConfig',
      redirect: '/log-lottery/config/resource/images',
      meta: {
        title: i18n.global.t('sidebar.resourceManagement'),
        icon: 'global',
      },
      children: [
        {
          path: '/log-lottery/config/resource/images',
          name: 'ImageConfig',
          component: () => import('@/views/Config/Resource/ImageConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.imagesManagement'),
            icon: 'image',
          },
        },
        {
          path: '/log-lottery/config/resource/musics',
          name: 'MusicConfig',
          component: () => import('@/views/Config/Resource/MusicConfig.vue'),
          meta: {
            title: i18n.global.t('sidebar.musicManagement'),
            icon: 'music',
          },
        },
      ],
    },
    {
      path: '/log-lottery/config/readme',
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
    path: '/log-lottery',
    component: Layout,
    redirect: '/log-lottery/home',
    children: [
      {
        path: '/log-lottery/home',
        name: 'Home',
        component: Home,
      },
      {
        path: '/log-lottery/demo',
        name: 'Demo',
        component: () => import('@/views/Demo/index.vue'),
      },
      {
        path: '/log-lottery/interaction',
        name: 'Demo',
        component: () => import('@/views/UserInteraction/index.vue'),
      },
      configRoutes,
    ],
  },
]
const envMode = import.meta.env.MODE
const router = createRouter({
  // 读取环境变量
  history: envMode === 'file' ? createWebHashHistory() : createWebHistory(),
  routes,
})

export default router
