<script setup lang='ts'>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UploadJsonModal from '../components/UploadDialog.vue'

interface Props {
    resetData: () => void
    exportAllConfigData: () => void
    importAllConfigData: (data: any) => void
}

defineProps<Props>()

const { t } = useI18n()
const resetDataDialogRef = ref()
const uploadVisible = ref(false)
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      {{ t('table.dataSetting') }}
    </legend>
    <dialog id="my_modal_1" ref="resetDataDialogRef" class="border-none modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          {{ t('dialog.titleTip') }}
        </h3>
        <p class="py-4">
          {{ t('dialog.dialogResetAllData') }}
        </p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-3">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="resetDataDialogRef.close()">
              {{ t(`button.cancel`) }}
            </button>
            <button class="btn" @click="resetData">
              {{ t('button.confirm') }}
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <UploadJsonModal v-model:visible="uploadVisible" :import-all-config-data="importAllConfigData" />
    <label class="flex flex-row items-center form-control">
      <div class="">
        <div class="label flex flex-col justify-start items-start">
          <span class="label-text text-left">{{ t('table.resetAllData') }}</span>
          <div class="help">
            <button class="btn btn-sm btn-primary" @click="resetDataDialogRef.showModal()">
              {{ t('button.resetAllData') }}
            </button>
          </div>
        </div>
      </div>
    </label>
    <!-- <label class="flex flex-row items-center form-control">
      <div class="">
        <div class="label flex flex-col justify-start items-start">
          <span class="label-text text-left">导出数据</span>
          <div class="help">
            <button class="btn btn-sm btn-primary" @click="exportAllConfigData">
              导出全部数据
            </button>
          </div>
        </div>
      </div>
    </label>
    <label class="flex flex-row items-center form-control">
      <div class="">
        <div class="label flex flex-col justify-start items-start">
          <span class="label-text text-left">导入数据</span>
          <div class="help">
            <button class="btn btn-sm btn-primary" @click="uploadVisible = true">
              导入设置
            </button>
          </div>
        </div>
      </div>
    </label> -->
  </fieldset>
</template>

<style scoped>

</style>
