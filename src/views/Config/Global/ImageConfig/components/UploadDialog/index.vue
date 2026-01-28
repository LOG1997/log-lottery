<script setup lang='ts'>
import type { IImageType } from '@/types/storeType'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import { useViewModel } from './useViewModel'

const props = withDefaults(defineProps<{ activeTabKey?: IImageType }>(), {
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
    innerLimitType,
    imageData,
    fileName,
} = useViewModel(props, visible, uploadDialogRef)
const { t } = useI18n()
</script>

<template>
  <CustomDialog
    ref="uploadDialogRef"
    v-model:visible="visible"
    :title="t('dialog.uploadImageTitle')"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <FileUpload v-if="visible" :limit-type="limitType" :inner-limit-type="innerLimitType" @upload-file="uploadFile" />
        <input v-if="limitType === 'image'" v-model="fileName" :disabled="imageData === null" type="text" :placeholder="t('placeHolder.imageName')" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
