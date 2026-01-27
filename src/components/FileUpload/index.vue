<script setup lang='ts'>
import type { IFileData, IFileProps } from './type'
import { Upload } from 'lucide-vue-next'
import { FILE_TYPE } from '@/constant/config'
import FilePreview from './parts/FilePreview.vue'
import { useUploadFile } from './useUploadFile'

const props = withDefaults(defineProps<IFileProps>(), {
    mode: '',
    limitType: '',
    innerLimitType: '',
})
const emits = defineEmits<{
    uploadFile: [fileData: IFileData[] | null]
}>()
const { fileData, handleFileChange, removeFile, resetUpload } = useUploadFile(props, emits)
</script>

<template>
  <div class="w-full h-full flex flex-col items-center mt-6">
    <input
      id="file-upload"
      :disabled="fileData.length > 0"
      type="file"
      :webkitdirectory="limitType === 'folder'"
      class="w-full bg-red-400/50 max-h-52 cursor-pointer absolute"
      style="display: none;"
      :accept="FILE_TYPE[limitType]"
      @change="handleFileChange"
    >
    <label for="file-upload" :class="fileData ? 'cursor-not-allowed' : null" class="w-full h-52 cursor-pointer border-2 border-dashed flex items-center justify-center overflow-hidden">
      <FilePreview v-if="fileData && fileData.length" :title="fileData[0].fileName" :limit-type="limitType" :file-data="fileData[0]" :remove="removeFile" :reset="resetUpload" />
      <div v-else class="w-full h-full flex justify-between py-3 items-center flex-col text-gray-500/50 hover:text-gray-300/60">
        <Upload class="w-2/3 h-2/3 stroke-1 " />
        <span>点击上传</span>
        <span class="text-xs">文件类型：{{ FILE_TYPE[limitType] }}</span>
      </div>
    </label>
  </div>
</template>

<style scoped>

</style>
