import type { IPrizeConfig } from '@/types/storeType'
import { defineStore } from 'pinia'
import { watch } from 'vue'
import { defaultCurrentPrize, defaultPrizeList } from './data'
import { useThemeStore, isServerStorageEnabled } from './theme'
import * as api from '@/api/lottery'

// 获取存储key
function getStorageKey() {
  const themeStore = useThemeStore()
  const themeId = themeStore.getCurrentThemeId || 'default'
  return `prizeConfig_${themeId}`
}

function getCurrentThemeId(): string | null {
  const themeStore = useThemeStore()
  const id = themeStore.getCurrentThemeId
  if (!id || id === 'default' || id === 'undefined') {
    return null
  }
  return id
}

// 从localStorage加载数据
function loadFromLocalStorage() {
  const key = getStorageKey()
  const data = localStorage.getItem(key)
  if (data) {
    try {
      return JSON.parse(data).prizeConfig
    }
    catch {
      return null
    }
  }
  return null
}

// 保存到localStorage
function saveToLocalStorage(data: any) {
  const key = getStorageKey()
  localStorage.setItem(key, JSON.stringify({ prizeConfig: data }))
}

// 保存到服务器
async function saveToServer(data: any) {
  if (!isServerStorageEnabled()) return
  const themeId = getCurrentThemeId()
  if (!themeId) return
  try {
    await api.savePrizeConfig(themeId, data)
  }
  catch (error) {
    console.error('[PrizeConfig] Failed to save to server:', error)
  }
}

// 从服务器加载
async function loadFromServer(): Promise<any> {
  if (!isServerStorageEnabled()) return null
  const themeId = getCurrentThemeId()
  if (!themeId) return null
  try {
    return await api.fetchPrizeConfig(themeId)
  }
  catch (error) {
    console.error('[PrizeConfig] Failed to load from server:', error)
    return null
  }
}

export const usePrizeConfig = defineStore('prize', {
  state() {
    return {
      prizeConfig: {
        prizeList: defaultPrizeList,
        currentPrize: defaultCurrentPrize,
        temporaryPrize: {
          id: '',
          name: '',
          sort: 0,
          isAll: false,
          count: 1,
          isUsedCount: 0,
          picture: {
            id: '-1',
            name: '',
            url: '',
          },
          separateCount: {
            enable: true,
            countList: [],
          },
          desc: '',
          isShow: false,
          isUsed: false,
          frequency: 1,
        } as IPrizeConfig,
      },
    }
  },
  getters: {
    // 获取全部配置
    getPrizeConfigAll(state) {
      return state.prizeConfig
    },
    // 获取奖品列表
    getPrizeConfig(state) {
      return state.prizeConfig.prizeList
    },
    // 根据id获取配置
    getPrizeConfigById(state) {
      return (id: number | string) => {
        return state.prizeConfig.prizeList.find(item => item.id === id)
      }
    },
    // 获取当前奖项
    getCurrentPrize(state) {
      return state.prizeConfig.currentPrize
    },
    // 获取临时的奖项
    getTemporaryPrize(state) {
      return state.prizeConfig.temporaryPrize
    },

  },
  actions: {
    // 设置奖项
    setPrizeConfig(prizeList: IPrizeConfig[]) {
      this.prizeConfig.prizeList = prizeList
    },
    // 添加奖项
    addPrizeConfig(prizeConfigItem: IPrizeConfig) {
      this.prizeConfig.prizeList.push(prizeConfigItem)
    },
    // 删除奖项
    deletePrizeConfig(prizeConfigItemId: number | string) {
      this.prizeConfig.prizeList = this.prizeConfig.prizeList.filter(item => item.id !== prizeConfigItemId)
    },
    // 更新奖项数据
    updatePrizeConfig(prizeConfigItem: IPrizeConfig) {
      const prizeListLength = this.prizeConfig.prizeList.length
      if (prizeConfigItem.isUsed && prizeListLength) {
        for (let i = 0; i < prizeListLength; i++) {
          if (!this.prizeConfig.prizeList[i].isUsed) {
            this.setCurrentPrize(this.prizeConfig.prizeList[i])
            break
          }
        }
      }
      else {
        return
      }
      this.resetTemporaryPrize()
    },
    // 删除全部奖项
    deleteAllPrizeConfig() {
      this.prizeConfig.prizeList = [] as IPrizeConfig[]
    },
    // 设置当前奖项
    setCurrentPrize(prizeConfigItem: IPrizeConfig) {
      this.prizeConfig.currentPrize = prizeConfigItem
    },
    // 设置临时奖项
    setTemporaryPrize(prizeItem: IPrizeConfig) {
      if (prizeItem.isShow === false) {
        for (let i = 0; i < this.prizeConfig.prizeList.length; i++) {
          if (this.prizeConfig.prizeList[i].isUsed === false) {
            this.setCurrentPrize(this.prizeConfig.prizeList[i])

            break
          }
        }
        this.resetTemporaryPrize()

        return
      }

      this.prizeConfig.temporaryPrize = prizeItem
    },
    // 重置临时奖项
    resetTemporaryPrize() {
      this.prizeConfig.temporaryPrize = {
        id: '',
        name: '',
        sort: 0,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
          id: '-1',
          name: '',
          url: '',
        },
        separateCount: {
          enable: true,
          countList: [],
        },
        desc: '',
        isShow: false,
        isUsed: false,
        frequency: 1,
      } as IPrizeConfig
    },
    // 重置所有配置
    resetDefault() {
      this.prizeConfig = {
        prizeList: defaultPrizeList,
        currentPrize: defaultCurrentPrize,
        temporaryPrize: {
          id: '',
          name: '',
          sort: 0,
          isAll: false,
          count: 1,
          isUsedCount: 0,
          picture: {
            id: '-1',
            name: '',
            url: '',
          },
          separateCount: {
            enable: true,
            countList: [],
          },
          desc: '',
          isShow: false,
          isUsed: false,
          frequency: 1,
        } as IPrizeConfig,
      }
      saveToLocalStorage(this.prizeConfig)
      saveToServer(this.prizeConfig)
    },
    // 从存储加载数据（切换主题时调用）
    async loadFromTheme() {
      // 暂停自动保存
      allowAutoSave = false
      
      // 优先从服务器加载
      let data = await loadFromServer()
      
      // 服务器没有数据则从本地加载
      if (!data) {
        data = loadFromLocalStorage()
      }
      
      if (data) {
        this.prizeConfig = data
      }
      else {
        this.resetDefault()
      }
      
      // 数据加载完成，允许自动保存
      allowAutoSave = true
    },
    // 保存当前数据
    async saveToTheme() {
      saveToLocalStorage(this.prizeConfig)
      await saveToServer(this.prizeConfig)
    },
  },
})

// 是否允许自动保存
let allowAutoSave = false

export function setPrizeConfigAutoSave(allow: boolean) {
  allowAutoSave = allow
}

// 防抖保存
let saveTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSave(data: any) {
  if (!allowAutoSave) return // 数据未加载完成，不自动保存
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveToLocalStorage(data)
    saveToServer(data)
  }, 500)
}

// 监听数据变化自动保存
export function setupPrizeConfigWatcher() {
  const store = usePrizeConfig()
  watch(
    () => store.prizeConfig,
    (newData) => {
      debouncedSave(newData)
    },
    { deep: true }
  )
}
