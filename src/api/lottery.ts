import axios from 'axios'

const API_BASE = 'http://localhost:3456/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// ==================== 主题 API ====================

export interface IThemeData {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

// 获取所有主题
export async function fetchThemes(): Promise<IThemeData[]> {
  const res = await api.get('/themes')
  return res.data.data || []
}

// 获取单个主题
export async function fetchTheme(id: string): Promise<IThemeData | null> {
  try {
    const res = await api.get(`/themes/${id}`)
    return res.data.data || null
  }
  catch {
    return null
  }
}

// 创建主题
export async function createTheme(data: { id: string, name: string, description?: string }): Promise<IThemeData> {
  const res = await api.post('/themes', data)
  return res.data.data
}

// 更新主题
export async function updateTheme(id: string, data: { name: string, description?: string }): Promise<IThemeData> {
  const res = await api.put(`/themes/${id}`, data)
  return res.data.data
}

// 删除主题
export async function deleteTheme(id: string): Promise<void> {
  await api.delete(`/themes/${id}`)
}

// ==================== 人员配置 API ====================

// 获取人员配置
export async function fetchPersonConfig(themeId: string): Promise<any> {
  const res = await api.get(`/themes/${themeId}/person`)
  return res.data.data
}

// 保存人员配置
export async function savePersonConfig(themeId: string, data: any): Promise<void> {
  await api.post(`/themes/${themeId}/person`, data)
}

// ==================== 奖品配置 API ====================

// 获取奖品配置
export async function fetchPrizeConfig(themeId: string): Promise<any> {
  const res = await api.get(`/themes/${themeId}/prize`)
  return res.data.data
}

// 保存奖品配置
export async function savePrizeConfig(themeId: string, data: any): Promise<void> {
  await api.post(`/themes/${themeId}/prize`, data)
}

// ==================== 全局配置 API ====================

// 获取全局配置
export async function fetchGlobalConfig(themeId: string): Promise<any> {
  const res = await api.get(`/themes/${themeId}/global`)
  return res.data.data
}

// 保存全局配置
export async function saveGlobalConfig(themeId: string, data: any): Promise<void> {
  await api.post(`/themes/${themeId}/global`, data)
}

// 检查服务器是否可用
export async function checkServerAvailable(): Promise<boolean> {
  try {
    await api.get('/themes', { timeout: 2000 })
    return true
  }
  catch {
    return false
  }
}
