import { useGlobalConfig } from './globalConfig'
import { usePersonConfig } from './personConfig'
import { usePrizeConfig } from './prizeConfig'
import { useSystem } from './system'
import { useThemeStore } from './theme'

export default function useStore() {
  return {
    personConfig: usePersonConfig(),
    prizeConfig: usePrizeConfig(),
    globalConfig: useGlobalConfig(),
    system: useSystem(),
    themeStore: useThemeStore(),
  }
}

// 获取当前主题ID的工具函数
export function getCurrentThemeId(): string {
  const themeStore = useThemeStore()
  return themeStore.getCurrentThemeId || 'default'
}

// 生成带主题前缀的存储key
export function getStorageKey(baseKey: string): string {
  const themeId = getCurrentThemeId()
  return `${baseKey}_${themeId}`
}
