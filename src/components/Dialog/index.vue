<script setup lang='ts'>
import { ref, toRefs } from 'vue'
import i18n from '@/locales/i18n'

interface Props {
  title: string
  desc: string
  cancelText?: string
  submitText?: string
  submitFunc: () => void
  cancelFunc?: () => void
}
const props = withDefaults(defineProps<Props>(), {
  cancelText: i18n.global.t('button.cancel'),
  submitText: i18n.global.t('button.confirm'),
  cancelFunc: () => {},
})

const dialogRef = ref <HTMLDialogElement | null> (null)
function defaultCancelFunc() {
  dialogRef.value?.close()
}

function showDialog() {
  dialogRef.value?.showModal()
}
defineExpose({
  showDialog,
})
const { title, desc, cancelText, submitText, submitFunc, cancelFunc = defaultCancelFunc } = toRefs(props)
</script>

<template>
  <dialog id="my_modal" ref="dialogRef" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ title }}
      </h3>
      <p class="py-4">
        {{ desc }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="cancelFunc">
            {{ cancelText }}
          </button>
          <button class="btn" @click="submitFunc">
            {{ submitText }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>
