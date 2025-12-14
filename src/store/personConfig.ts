import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'

import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { watch } from 'vue'
import { defaultPersonList } from './data'
import { usePrizeConfig } from './prizeConfig'
import { useThemeStore, isServerStorageEnabled } from './theme'
import * as api from '@/api/lottery'

// 获取存储key
function getStorageKey() {
  const themeStore = useThemeStore()
  const themeId = themeStore.getCurrentThemeId || 'default'
  return `personConfig_${themeId}`
}

// 获取当前主题ID
function getCurrentThemeId(): string | null {
  const themeStore = useThemeStore()
  const id = themeStore.getCurrentThemeId
  // 返回有效的主题ID，否则返回null
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
      return JSON.parse(data).personConfig
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
  localStorage.setItem(key, JSON.stringify({ personConfig: data }))
}

// 保存到服务器
async function saveToServer(data: any) {
  if (!isServerStorageEnabled()) return
  const themeId = getCurrentThemeId()
  if (!themeId) return // 没有有效的主题ID，不保存到服务器
  try {
    await api.savePersonConfig(themeId, data)
  }
  catch (error) {
    console.error('[PersonConfig] Failed to save to server:', error)
  }
}

// 从服务器加载
async function loadFromServer(): Promise<any> {
  if (!isServerStorageEnabled()) return null
  const themeId = getCurrentThemeId()
  if (!themeId) return null // 没有有效的主题ID，不从服务器加载
  try {
    return await api.fetchPersonConfig(themeId)
  }
  catch (error) {
    console.error('[PersonConfig] Failed to load from server:', error)
    return null
  }
}

export const usePersonConfig = defineStore('person', {
  state() {
    return {
      personConfig: {
        allPersonList: [] as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
      },
    }
  },
  getters: {
    // 获取全部配置
    getPersonConfig(state) {
      return state.personConfig
    },
    // 获取全部人员名单
    getAllPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return item
      })
    },
    // 获取未获此奖的人员名单
    getNotThisPrizePersonList(state: any) {
      const currentPrize = usePrizeConfig().prizeConfig.currentPrize
      const data = state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return !item.prizeId.includes(currentPrize.id as string)
      })

      return data
    },
    // 获取已中奖人员名单
    getAlreadyPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return item.isWin === true
      })
    },
    // 获取中奖人员详情
    getAlreadyPersonDetail(state) {
      return state.personConfig.alreadyPersonList
    },
    // 获取未中奖人员名单
    getNotPersonList(state) {
      return state.personConfig.allPersonList.filter((item: IPersonConfig) => {
        return item.isWin === false
      })
    },
  },
  actions: {
    // 添加未中奖人员
    addNotPersonList(personList: IPersonConfig[]) {
      if (personList.length <= 0) {
        return
      }
      personList.forEach((item: IPersonConfig) => {
        this.personConfig.allPersonList.push(item)
      })
    },
    // 添加已中奖人员
    addAlreadyPersonList(personList: IPersonConfig[], prize: IPrizeConfig | null) {
      if (personList.length <= 0) {
        return
      }
      personList.forEach((person: IPersonConfig) => {
        this.personConfig.allPersonList.map((item: IPersonConfig) => {
          if (item.id === person.id && prize != null) {
            item.isWin = true
            // person.isWin = true
            item.prizeName.push(prize.name)
            // person.prizeName += prize.name
            item.prizeTime.push(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            // person.prizeTime = new Date().toString()
            item.prizeId.push(prize.id as string)
          }

          return item
        })
        this.personConfig.alreadyPersonList.push(person)
      })
    },
    // 从已中奖移动到未中奖
    moveAlreadyToNot(person: IPersonConfig) {
      if (person.id === undefined || person.id == null) {
        return
      }
      const alreadyPersonListLength = this.personConfig.alreadyPersonList.length
      for (let i = 0; i < this.personConfig.allPersonList.length; i++) {
        if (person.id === this.personConfig.allPersonList[i].id) {
          this.personConfig.allPersonList[i].isWin = false
          this.personConfig.allPersonList[i].prizeName = []
          this.personConfig.allPersonList[i].prizeTime = []
          this.personConfig.allPersonList[i].prizeId = []

          break
        }
      }
      for (let i = 0; i < alreadyPersonListLength; i++) {
        this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) =>
          item.id !== person.id,
        )
      }
    },
    // 删除指定人员
    deletePerson(person: IPersonConfig) {
      if (person.id !== undefined || person.id != null) {
        this.personConfig.allPersonList = this.personConfig.allPersonList.filter((item: IPersonConfig) => item.id !== person.id)
        this.personConfig.alreadyPersonList = this.personConfig.alreadyPersonList.filter((item: IPersonConfig) => item.id !== person.id)
      }
    },
    // 删除所有人员
    deleteAllPerson() {
      this.personConfig.allPersonList = []
      this.personConfig.alreadyPersonList = []
    },

    // 删除所有人员
    resetPerson() {
      this.personConfig.allPersonList = []
      this.personConfig.alreadyPersonList = []
    },
    // 重置已中奖人员
    resetAlreadyPerson() {
      // 把已中奖人员合并到未中奖人员，要验证是否已存在
      this.personConfig.allPersonList.forEach((item: IPersonConfig) => {
        item.isWin = false
        item.prizeName = []
        item.prizeTime = []
        item.prizeId = []
      })
      this.personConfig.alreadyPersonList = []
    },
    setDefaultPersonList() {
      this.personConfig.allPersonList = defaultPersonList
      this.personConfig.alreadyPersonList = []
      saveToLocalStorage(this.personConfig)
      saveToServer(this.personConfig)
    },
    // 重置所有配置
    reset() {
      this.personConfig = {
        allPersonList: [] as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
      }
      saveToLocalStorage(this.personConfig)
      saveToServer(this.personConfig)
    },
    // 从存储加载数据（切换主题时调用）
    async loadFromTheme(enableAutoSaveAfter = true) {
      // 暂停自动保存
      const prevAutoSave = allowAutoSave
      allowAutoSave = false
      
      // 优先从服务器加载
      let data = await loadFromServer()
      
      // 服务器没有数据则从本地加载
      if (!data) {
        data = loadFromLocalStorage()
      }
      
      if (data) {
        // 只有数据真正变化时才更新
        const newDataStr = JSON.stringify(data)
        const oldDataStr = JSON.stringify(this.personConfig)
        if (newDataStr !== oldDataStr) {
          this.personConfig = data
        }
      }
      else {
        this.personConfig = {
          allPersonList: [] as IPersonConfig[],
          alreadyPersonList: [] as IPersonConfig[],
        }
      }
      
      // 数据加载完成，恢复自动保存状态
      allowAutoSave = enableAutoSaveAfter ? true : prevAutoSave
    },
    // 保存当前数据
    async saveToTheme() {
      saveToLocalStorage(this.personConfig)
      await saveToServer(this.personConfig)
    },
  },
})

// 是否允许自动保存（只有数据加载完成后才允许）
let allowAutoSave = false

export function setPersonConfigAutoSave(allow: boolean) {
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
export function setupPersonConfigWatcher() {
  const store = usePersonConfig()
  watch(
    () => store.personConfig,
    (newData) => {
      debouncedSave(newData)
    },
    { deep: true },
  )
}
