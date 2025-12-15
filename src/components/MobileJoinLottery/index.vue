<script setup lang="ts">
import type { IPersonConfig } from '@/types/storeType'
import useStore from '@/store'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import confetti from 'canvas-confetti'
import { checkFingerprint, recordFingerprint } from '@/api/lottery'

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const themeStore = useStore().themeStore

const isLoading = ref(true)
const hasJoined = ref(false)
const joinedName = ref('')
const isSubmitting = ref(false)
const showSuccess = ref(false)
const fingerprint = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('')

// 表单数据
const formData = ref({
  name: '',
  department: '',
  identity: '',
  avatar: '',
})

// 获取主题名称
const themeName = computed(() => {
  return globalConfig.getTopTitle || t('entry.title')
})

// 简单哈希函数（用于非 HTTPS 环境的备用方案）
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // 生成更长的哈希值
  const hash1 = Math.abs(hash).toString(16)
  const hash2 = Math.abs(hash * 31).toString(16)
  const hash3 = Math.abs(hash * 37).toString(16)
  const hash4 = Math.abs(hash * 41).toString(16)
  return (hash1 + hash2 + hash3 + hash4).padStart(32, '0')
}

// 生成浏览器指纹
async function generateFingerprint(): Promise<string> {
  const components = []
  
  // 屏幕信息
  components.push(screen.width, screen.height, screen.colorDepth)
  
  // 时区
  components.push(new Date().getTimezoneOffset())
  
  // 语言
  components.push(navigator.language)
  
  // 平台 (使用 userAgentData 作为备选)
  try {
    // @ts-ignore - userAgentData 是较新的 API
    const platform = navigator.userAgentData?.platform || navigator.platform || 'unknown'
    components.push(platform)
  } catch {
    components.push('unknown')
  }
  
  // User Agent
  components.push(navigator.userAgent)
  
  // Canvas 指纹
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('Lottery Fingerprint', 2, 15)
      components.push(canvas.toDataURL())
    }
  } catch (e) {
    // ignore
  }
  
  // WebGL 信息
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        components.push((gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL))
        components.push((gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      }
    }
  } catch (e) {
    // ignore
  }
  
  // 生成哈希
  const str = components.join('|')
  
  // 检查 crypto.subtle 是否可用（仅在 HTTPS 或 localhost 下可用）
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(str)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (e) {
      console.warn('crypto.subtle failed, using fallback hash:', e)
    }
  }
  
  // 备用方案：使用简单哈希
  console.warn('crypto.subtle not available (non-HTTPS?), using fallback hash')
  return simpleHash(str)
}

// 检查是否已加入
async function checkIfJoined() {
  isLoading.value = true
  try {
    fingerprint.value = await generateFingerprint()
    const themeId = themeStore.currentThemeId || (route.params.themeId as string)
    
    if (themeId) {
      const result = await checkFingerprint(themeId, fingerprint.value)
      if (result.exists) {
        hasJoined.value = true
        joinedName.value = result.data?.person_name || ''
      }
    }
  } catch (error) {
    console.error('Failed to check fingerprint:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理头像上传
const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.open({ message: t('error.notImage'), type: 'warning', position: 'top' })
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.open({ message: t('joinLottery.avatarTooLarge'), type: 'warning', position: 'top' })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    avatarPreview.value = result
    formData.value.avatar = result
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => fileInputRef.value?.click()

const removeAvatar = () => {
  avatarPreview.value = ''
  formData.value.avatar = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// 默认头像
const defaultAvatar = 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'

// 生成唯一ID
const generateUid = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `M${timestamp}${random}`
}

// 获取下一个位置
const getNextPosition = () => {
  const allPersonList = personConfig.getAllPersonList
  const maxId = allPersonList.length > 0 
    ? Math.max(...allPersonList.map((p: IPersonConfig) => p.id)) 
    : -1
  const nextId = maxId + 1
  const rowCount = 17
  return { id: nextId, x: (nextId % rowCount) + 1, y: Math.floor(nextId / rowCount) + 1 }
}

// 表单验证
const isFormValid = computed(() => formData.value.name.trim() !== '')

// 触发庆祝动画
const triggerCelebration = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9']
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors })
  setTimeout(() => {
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors })
  }, 200)
}

// 提交加入
const handleJoin = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const themeId = themeStore.currentThemeId || (route.params.themeId as string)
    
    // 记录指纹
    const result = await recordFingerprint(themeId, fingerprint.value, formData.value.name.trim())
    
    if (!result.success) {
      if (result.error === 'already_joined') {
        hasJoined.value = true
        toast.open({ message: t('joinLottery.alreadyJoined'), type: 'warning', position: 'top' })
        return
      }
      throw new Error(result.error)
    }
    
    const { id, x, y } = getNextPosition()
    const now = new Date().toString()
    
    const newPerson: IPersonConfig = {
      id,
      uid: generateUid(),
      name: formData.value.name.trim(),
      department: formData.value.department.trim() || t('joinLottery.defaultDepartment'),
      identity: formData.value.identity.trim() || t('joinLottery.defaultIdentity'),
      avatar: formData.value.avatar.trim() || defaultAvatar,
      isWin: false,
      x, y,
      createTime: now,
      updateTime: now,
      prizeName: [],
      prizeId: [],
      prizeTime: [],
    }
    
    // 添加到人员列表
    personConfig.addNotPersonList([newPerson])
    
    // 显示成功
    showSuccess.value = true
    hasJoined.value = true
    joinedName.value = newPerson.name
    triggerCelebration()
    
    toast.open({
      message: t('joinLottery.joinSuccess', { name: newPerson.name }),
      type: 'success',
      position: 'top',
      duration: 3000,
    })
  } catch (error) {
    toast.open({ message: t('error.uploadFail'), type: 'error', position: 'top' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  checkIfJoined()
})
</script>

<template>
  <div class="mobile-lottery-page">
    <!-- 背景 -->
    <div class="bg-animation">
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
    </div>
    
    <!-- 内容 -->
    <div class="content">
      <!-- 加载中 -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
      
      <!-- 已加入状态 -->
      <div v-else-if="hasJoined && !showSuccess" class="joined-state">
        <div class="joined-icon">✅</div>
        <h2>{{ t('joinLottery.alreadyJoinedTitle') }}</h2>
        <p class="joined-name">{{ joinedName }}</p>
        <p class="joined-hint">{{ t('joinLottery.waitForLottery') }}</p>
      </div>
      
      <!-- 成功状态 -->
      <div v-else-if="showSuccess" class="success-state">
        <div class="success-icon">🎉</div>
        <h2>{{ t('joinLottery.welcomeMessage') }}</h2>
        <p class="success-name">{{ joinedName }}</p>
        <p class="success-hint">{{ t('joinLottery.waitForLottery') }}</p>
      </div>
      
      <!-- 加入表单 -->
      <div v-else class="join-form">
        <div class="form-header">
          <div class="lottery-icon">🎰</div>
          <h1>{{ themeName }}</h1>
          <p>{{ t('joinLottery.title') }}</p>
        </div>
        
        <div class="form-body">
          <div class="form-group">
            <label>{{ t('joinLottery.name') }} <span class="required">*</span></label>
            <input 
              v-model="formData.name"
              type="text"
              :placeholder="t('joinLottery.namePlaceholder')"
              maxlength="20"
            />
          </div>
          
          <div class="form-group">
            <label>{{ t('joinLottery.department') }}</label>
            <input 
              v-model="formData.department"
              type="text"
              :placeholder="t('joinLottery.departmentPlaceholder')"
              maxlength="30"
            />
          </div>
          
          <div class="form-group">
            <label>{{ t('joinLottery.avatar') }}</label>
            <div class="avatar-upload">
              <input 
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
              <div v-if="!avatarPreview" class="upload-area" @click="triggerFileInput">
                <span class="upload-icon">📷</span>
                <span>{{ t('joinLottery.clickToUpload') }}</span>
              </div>
              <div v-else class="avatar-preview">
                <img :src="avatarPreview" alt="avatar" />
                <button class="remove-btn" @click="removeAvatar">×</button>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          class="join-btn"
          :disabled="!isFormValid || isSubmitting"
          @click="handleJoin"
        >
          <span v-if="isSubmitting" class="btn-spinner"></span>
          <span v-else>{{ t('joinLottery.join') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.mobile-lottery-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

// 背景动画
.bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stars, .stars2, .stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.stars {
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent);
  background-size: 200px 200px;
  animation: twinkle 5s ease-in-out infinite;
}

.stars2 {
  background-image: radial-gradient(1px 1px at 50px 80px, #fff, transparent),
    radial-gradient(1px 1px at 100px 150px, rgba(255,255,255,0.7), transparent);
  background-size: 250px 250px;
  animation: twinkle 7s ease-in-out infinite;
  animation-delay: 1s;
}

.stars3 {
  background-image: radial-gradient(1px 1px at 30px 100px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 120px 20px, #fff, transparent);
  background-size: 300px 300px;
  animation: twinkle 9s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// 内容区域
.content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

// 加载状态
.loading-state {
  text-align: center;
  color: white;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,0.2);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// 已加入状态
.joined-state, .success-state {
  text-align: center;
  color: white;
  padding: 40px 20px;
  
  .joined-icon, .success-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 24px;
    margin: 0 0 16px;
    color: #4ecdc4;
  }
  
  .joined-name, .success-name {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 20px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .joined-hint, .success-hint {
    color: rgba(255,255,255,0.6);
    font-size: 14px;
    margin: 0;
  }
}

// 表单
.join-form {
  width: 100%;
  max-width: 400px;
  background: rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 32px 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
  
  .lottery-icon {
    font-size: 60px;
    margin-bottom: 16px;
  }
  
  h1 {
    font-size: 24px;
    color: white;
    margin: 0 0 8px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: rgba(255,255,255,0.6);
    margin: 0;
    font-size: 14px;
  }
}

.form-body {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    color: rgba(255,255,255,0.8);
    font-size: 14px;
    margin-bottom: 8px;
    
    .required {
      color: #ff6b6b;
    }
  }
  
  input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: white;
    font-size: 16px;
    box-sizing: border-box;
    
    &::placeholder {
      color: rgba(255,255,255,0.3);
    }
    
    &:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(102,126,234,0.1);
    }
  }
}

.avatar-upload {
  .hidden {
    display: none;
  }
  
  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    background: rgba(255,255,255,0.05);
    border: 2px dashed rgba(255,255,255,0.2);
    border-radius: 12px;
    cursor: pointer;
    color: rgba(255,255,255,0.5);
    
    .upload-icon {
      font-size: 32px;
    }
    
    &:active {
      border-color: #667eea;
      background: rgba(102,126,234,0.1);
    }
  }
  
  .avatar-preview {
    position: relative;
    display: inline-block;
    
    img {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid rgba(102,126,234,0.5);
    }
    
    .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ff6b6b;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
  }
}

.join-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:not(:disabled):active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}
</style>
