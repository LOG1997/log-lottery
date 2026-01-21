<script setup lang='ts'>
import type { IFileData, IFileProps } from './type'
import { ListMusic, Upload, X } from 'lucide-vue-next'
import StreamlineColorMusicFolderSong from '~icons/streamline-color/music-folder-song'
import StreamlineColorUploadFileFlat from '~icons/streamline-color/upload-file-flat'
import StreamlineUltimateColorCommonFileUpload from '~icons/streamline-ultimate-color/common-file-upload'
import { getBlobObjectUrl } from '@/utils/file'
import { useUploadFile } from './useUploadFile'

const props = withDefaults(defineProps<IFileProps>(), {
    mode: 'file',
    limitType: '',
})
const emits = defineEmits<{
    uploadFile: [fileData: IFileData | null]
}>()
const { originFileName, fileData, handleFileChange, removeFile } = useUploadFile(props, emits)
</script>

<template>
  <div class="w-full h-full flex flex-col items-center mt-6">
    <input
      id="file-upload"
      :disabled="fileData !== null"
      type="file" class="w-full bg-red-400/50 max-h-52 cursor-pointer absolute" style="display: none;" :accept="limitType"
      @change="handleFileChange"
    >
    <label for="file-upload" :class="fileData ? 'cursor-not-allowed' : null" class="w-full h-52 cursor-pointer border-2 border-dashed flex items-center justify-center overflow-hidden">
      <img v-if="fileData && fileData.type.includes('image')" class="w-full object-cover stroke-0" :src="getBlobObjectUrl(fileData.data as Blob)" alt="">
      <ListMusic v-else-if="fileData && fileData.type.includes('audio')" class="w-2/3 h-2/3 stroke-1 text-gray-500/50" />
      <div v-else class="w-full h-full flex justify-center items-center flex-col gap-4">
        <StreamlineUltimateColorCommonFileUpload class="w-2/3 h-2/3 stroke-1 text-gray-500/50" />
        <span class="btn btn-neutral">点击上传</span>
      </div>
    </label>
    <div v-if="fileData" class="w-full flex items-center justify-between mt-2">
      <p class="max-w-[3/4] truncate text-sm">
        {{ originFileName }}
      </p>
      <button class="btn btn-xs btn-square btn-ghost" @click="removeFile">
        <X />
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
