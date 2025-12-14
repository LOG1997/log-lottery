import { defineStore } from 'pinia'
import * as api from '@/api/lottery'

export interface ITheme {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

// 是否使用服务器存储
let useServerStorage = false

// 检查并设置服务器可用性
export async function initServerStorage(): Promise<boolean> {
  useServerStorage = await api.checkServerAvailable()
  console.log(`[Theme] Server storage: ${useServerStorage ? 'enabled' : 'disabled (using localStorage)'}`)
  return useServerStorage
}

export function isServerStorageEnabled(): boolean {
  return useServerStorage
}

export const useThemeStore = defineStore('theme', {
  state() {
    return {
      themes: [] as ITheme[],
      currentThemeId: '' as string,
      isLoading: false,
    }
  },
  getters: {
    // 获取所有主题
    getAllThemes(state) {
      return state.themes
    },
    // 获取当前主题
    getCurrentTheme(state) {
      return state.themes.find(t => t.id === state.currentThemeId) || null
    },
    // 获取当前主题ID
    getCurrentThemeId(state) {
      return state.currentThemeId
    },
    // 是否已选择主题
    hasSelectedTheme(state) {
      return !!state.currentThemeId
    },
  },
  actions: {
    // 从服务器加载主题列表
    async loadThemesFromServer() {
      if (!useServerStorage) return
      
      this.isLoading = true
      try {
        const serverThemes = await api.fetchThemes()
        this.themes = serverThemes.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }))
      } catch (error) {
        console.error('[Theme] Failed to load themes from server:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // 创建新主题（带密码）
    async createTheme(name: string, description: string = '', password: string = '') {
      const id = `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date().toISOString()
      const newTheme: ITheme = {
        id,
        name,
        description,
        createdAt: now,
        updatedAt: now,
      }
      
      // 保存到服务器
      if (useServerStorage) {
        try {
          await api.createTheme({ id, name, description, password })
        } catch (error) {
          console.error('[Theme] Failed to create theme on server:', error)
        }
      }
      
      this.themes.push(newTheme)
      return newTheme
    },
    // 选择主题
    selectTheme(themeId: string) {
      // 直接设置 currentThemeId，即使主题不在本地列表中
      // （可能是从其他浏览器通过链接访问的）
      this.currentThemeId = themeId
      return true
    },
    // 更新主题信息
    updateTheme(themeId: string, updates: Partial<Pick<ITheme, 'name' | 'description'>>) {
      const theme = this.themes.find(t => t.id === themeId)
      if (theme) {
        if (updates.name) theme.name = updates.name
        if (updates.description !== undefined) theme.description = updates.description
        theme.updatedAt = new Date().toISOString()
        return true
      }
      return false
    },
    // 删除主题（需要密码）
    async deleteTheme(themeId: string, password?: string): Promise<{ success: boolean, error?: string }> {
      const index = this.themes.findIndex(t => t.id === themeId)
      if (index > -1) {
        // 从服务器删除（需要密码验证）
        if (useServerStorage) {
          const result = await api.deleteTheme(themeId, password)
          if (!result.success) {
            return result
          }
        }
        
        this.themes.splice(index, 1)
        // 如果删除的是当前主题，清空当前主题
        if (this.currentThemeId === themeId) {
          this.currentThemeId = ''
        }
        // 同时删除该主题的所有数据
        this.clearThemeData(themeId)
        return { success: true }
      }
      return { success: false, error: 'Theme not found' }
    },
    // 清空主题数据
    clearThemeData(themeId: string) {
      // 清除 localStorage 中该主题的数据（作为备份）
      const keysToRemove = [
        `personConfig_${themeId}`,
        `prizeConfig_${themeId}`,
        `globalConfig_${themeId}`,
      ]
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })
    },
    
    // 检查主题是否存在（支持服务器查询）
    async checkThemeExists(themeId: string): Promise<boolean> {
      // 先检查本地
      if (this.themes.some(t => t.id === themeId)) {
        return true
      }
      
      // 再检查服务器
      if (useServerStorage) {
        const theme = await api.fetchTheme(themeId)
        if (theme) {
          // 添加到本地缓存
          this.themes.push({
            id: theme.id,
            name: theme.name,
            description: theme.description,
            createdAt: theme.created_at,
            updatedAt: theme.updated_at,
          })
          return true
        }
      }
      
      return false
    },
    // 退出当前主题
    exitTheme() {
      this.currentThemeId = ''
    },
    // 重置
    reset() {
      this.themes = []
      this.currentThemeId = ''
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        key: 'themeStore',
      },
    ],
  },
})
