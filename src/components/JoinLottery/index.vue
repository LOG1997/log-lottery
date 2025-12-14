<script setup lang="ts">
import type { IPersonConfig } from '@/types/storeType'
import useStore from '@/store'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import confetti from 'canvas-confetti'

const { t } = useI18n()
const toast = useToast()
const personConfig = useStore().personConfig

const isOpen = ref(false)
const isAnimating = ref(false)
const showSuccess = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('')

// 表单数据
const formData = ref({
  name: '',
  department: '',
  identity: '',
  avatar: '',
})

// 处理头像上传
const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toast.open({
      message: t('error.notImage'),
      type: 'warning',
      position: 'top-right',
    })
    return
  }

  // 验证文件大小 (最大 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.open({
      message: t('joinLottery.avatarTooLarge'),
      type: 'warning',
      position: 'top-right',
    })
    return
  }

  // 转换为 base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    avatarPreview.value = result
    formData.value.avatar = result
  }
  reader.readAsDataURL(file)
}

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 移除头像
const removeAvatar = () => {
  avatarPreview.value = ''
  formData.value.avatar = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 默认头像
const defaultAvatar = 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'

// 生成唯一ID
const generateUid = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `U${timestamp}${random}`
}

// 获取下一个可用的id和位置
const getNextPosition = () => {
  const allPersonList = personConfig.getAllPersonList
  const maxId = allPersonList.length > 0 
    ? Math.max(...allPersonList.map((p: IPersonConfig) => p.id)) 
    : -1
  const nextId = maxId + 1
  
  // 计算位置 (假设每行17个)
  const rowCount = 17
  const x = (nextId % rowCount) + 1
  const y = Math.floor(nextId / rowCount) + 1
  
  return { id: nextId, x, y }
}

// 表单验证
const isFormValid = computed(() => {
  return formData.value.name.trim() !== ''
})

// 打开弹窗
const openModal = () => {
  isOpen.value = true
  resetForm()
}

// 关闭弹窗
const closeModal = () => {
  if (isAnimating.value) return
  isOpen.value = false
  showSuccess.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    department: '',
    identity: '',
    avatar: '',
  }
  avatarPreview.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 触发加入动画
const triggerJoinAnimation = () => {
  // 发射彩带
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9']
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
  })
  
  // 从四周发射
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    })
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    })
  }, 200)
}

// 提交加入
const handleJoin = async () => {
  if (!isFormValid.value) {
    toast.open({
      message: t('error.completeInformation'),
      type: 'warning',
      position: 'top-right',
    })
    return
  }
  
  isAnimating.value = true
  
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
    x,
    y,
    createTime: now,
    updateTime: now,
    prizeName: [],
    prizeId: [],
    prizeTime: [],
  }
  
  // 显示成功动画
  showSuccess.value = true
  triggerJoinAnimation()
  
  // 延迟添加到列表，让动画播放
  setTimeout(() => {
    personConfig.addNotPersonList([newPerson])
    
    toast.open({
      message: t('joinLottery.joinSuccess', { name: newPerson.name }),
      type: 'success',
      position: 'top-right',
      duration: 3000,
    })
    
    setTimeout(() => {
      isAnimating.value = false
      // 刷新页面以显示新加入的人员
      window.location.reload()
    }, 800)
  }, 1000)
}
</script>

<template>
  <!-- 悬浮加入按钮 -->
  <div class="join-lottery-wrapper">
    <button 
      class="join-btn"
      @click="openModal"
      :title="t('joinLottery.joinButton')"
    >
      <span class="join-icon">+</span>
      <span class="join-text">{{ t('joinLottery.joinButton') }}</span>
    </button>
  </div>

  <!-- 弹窗遮罩 -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container" :class="{ 'success-state': showSuccess }">
          <!-- 成功动画 -->
          <div v-if="showSuccess" class="success-animation">
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
            <p class="success-text">{{ t('joinLottery.welcomeMessage') }}</p>
            <p class="success-name">{{ formData.name }}</p>
          </div>

          <!-- 表单内容 -->
          <div v-else class="modal-content">
            <div class="modal-header">
              <h3>{{ t('joinLottery.title') }}</h3>
              <button class="close-btn" @click="closeModal">&times;</button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>{{ t('joinLottery.name') }} <span class="required">*</span></label>
                <input 
                  v-model="formData.name"
                  type="text"
                  :placeholder="t('joinLottery.namePlaceholder')"
                  class="form-input"
                  maxlength="20"
                />
              </div>
              
              <div class="form-group">
                <label>{{ t('joinLottery.department') }}</label>
                <input 
                  v-model="formData.department"
                  type="text"
                  :placeholder="t('joinLottery.departmentPlaceholder')"
                  class="form-input"
                  maxlength="30"
                />
              </div>
              
              <div class="form-group">
                <label>{{ t('joinLottery.identity') }}</label>
                <input 
                  v-model="formData.identity"
                  type="text"
                  :placeholder="t('joinLottery.identityPlaceholder')"
                  class="form-input"
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
                    class="file-input-hidden"
                    @change="handleAvatarUpload"
                  />
                  <div 
                    v-if="!avatarPreview" 
                    class="upload-placeholder"
                    @click="triggerFileInput"
                  >
                    <span class="upload-icon">📷</span>
                    <span class="upload-text">{{ t('joinLottery.clickToUpload') }}</span>
                  </div>
                  <div v-else class="avatar-preview-wrapper">
                    <img :src="avatarPreview" alt="avatar" class="avatar-preview" />
                    <button class="remove-avatar-btn" @click="removeAvatar" type="button">×</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button class="cancel-btn" @click="closeModal">
                {{ t('button.cancel') }}
              </button>
              <button 
                class="submit-btn" 
                @click="handleJoin"
                :disabled="!isFormValid || isAnimating"
              >
                <span v-if="isAnimating" class="loading-spinner"></span>
                <span v-else>{{ t('joinLottery.join') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>


<style scoped lang="scss">
.join-lottery-wrapper {
  position: fixed;
  right: 24px;
  bottom: 130px;
  z-index: 1000;
}

.join-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
}

.join-icon {
  font-size: 20px;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.join-text {
  white-space: nowrap;
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-container {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  
  &.success-state {
    padding: 40px;
    text-align: center;
  }
}

.modal-content {
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    margin: 0;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(90deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s;
  
  &:hover {
    color: #ff6b6b;
    transform: rotate(90deg);
  }
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .required {
    color: #ff6b6b;
  }
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
}

// Avatar upload styles
.avatar-upload {
  width: 100%;
}

.file-input-hidden {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    
    .upload-icon {
      transform: scale(1.2);
    }
  }
}

.upload-icon {
  font-size: 32px;
  transition: transform 0.3s;
}

.upload-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.avatar-preview-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid rgba(102, 126, 234, 0.5);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.remove-avatar-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff6b6b;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #ff5252;
    transform: scale(1.1);
  }
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Success animation
.success-animation {
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-checkmark {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #4ecdc4;
  
  &::before {
    top: 3px;
    left: -2px;
    width: 30px;
    transform-origin: 100% 50%;
    border-radius: 100px 0 0 100px;
  }
  
  &::after {
    top: 0;
    left: 30px;
    width: 60px;
    transform-origin: 0 50%;
    border-radius: 0 100px 100px 0;
    animation: rotate-circle 4.25s ease-in;
  }
  
  &::before,
  &::after {
    content: '';
    height: 100px;
    position: absolute;
    background: transparent;
    transform: rotate(-45deg);
  }
}

.icon-line {
  height: 5px;
  background-color: #4ecdc4;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
  
  &.line-tip {
    top: 46px;
    left: 14px;
    width: 25px;
    transform: rotate(45deg);
    animation: icon-line-tip 0.75s;
  }
  
  &.line-long {
    top: 38px;
    right: 8px;
    width: 47px;
    transform: rotate(-45deg);
    animation: icon-line-long 0.75s;
  }
}

.icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(78, 205, 196, 0.5);
}

.icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: transparent;
}

@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 46px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

.success-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0 0 10px;
}

.success-name {
  color: #4ecdc4;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  animation: bounceIn 0.5s ease 0.3s both;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .modal-container {
    transform: scale(0.9) translateY(20px);
  }
}
</style>
