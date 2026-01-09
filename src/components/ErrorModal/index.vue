<script setup>
import { Dialog, DialogDescription, DialogPanel, DialogTitle } from '@headlessui/vue'
import { CircleAlert } from 'lucide-vue-next'
import { defineEmits, defineProps, ref, watch } from 'vue'
// 定义组件属性
const props = defineProps({
    title: {
        type: String,
        default: '提示',
    },
    desc: {
        type: String,
        required: true,
    },
    // 控制弹窗显隐
    modelValue: {
        type: Boolean,
        default: false,
    },
})

// 定义事件
const emit = defineEmits(['update:modelValue', 'close'])

// 内部显隐状态
const visible = ref(props.modelValue)

// 同步外部 modelValue 变化
watch(() => props.modelValue, (val) => {
    visible.value = val
})

// 关闭弹窗
function handleClose() {
    visible.value = false
    emit('update:modelValue', false)
    emit('close')
}
</script>

<template>
  <teleport to="body">
    <Dialog :open="visible" class="relative z-50" @close="handleClose">
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <!-- Full-screen container to center the panel -->
      <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel class="max-w-sm rounded bg-base-100 w-9/10 p-6 shadow-md">
          <DialogTitle class="font-bold text-lg">
            <p class="w-full flex items-center gap-2">
              <CircleAlert class="text-red-500" />
              <span>
                {{ title || '提示' }}
              </span>
            </p>
          </DialogTitle>
          <DialogDescription class="py-4">
            {{ desc }}
          </DialogDescription>
          <div class="mr-4 mt-4 flex justify-end">
            <button class="btn" @click="handleClose">
              确定
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.modal-header button {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer button:first-child {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
</style>
