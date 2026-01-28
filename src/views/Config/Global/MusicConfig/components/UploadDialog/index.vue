<script setup lang='ts'>
import type { IFileData } from '@/components/FileUpload/type'
import type { IMusicType } from '@/types/storeType'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import { useViewModel } from './useViewModel'

const props = withDefaults(defineProps<{ activeTabKey?: IMusicType }>(), {
    activeTabKey: 'other',
})
const visible = defineModel('visible', {
    type: Boolean,
    required: true,
})

const uploadDialogRef = ref()
const {
    uploadFile,
    submitUpload,
    limitType,
    // innerLimitType,
    musicData,
    fileName,
} = useViewModel(props, visible, uploadDialogRef)
const { t } = useI18n()
const audioData = ref<IFileData | null>(null)
</script>

<template>
  <CustomDialog
    ref="uploadDialogRef"
    v-model:visible="visible"
    :title="t('dialog.uploadAudioTitle')"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <FileUpload v-if="visible" :limit-type="limitType" @upload-file="uploadFile" />
        <input v-model="fileName" :disabled="audioData === null" type="text" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
