<script setup lang='ts'>
import type { IFileData } from '../type'
import { RefreshCw, Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import MaterialIconThemeZip from '~icons/material-icon-theme/zip'
import MaterialSymbolsFileJsonOutline from '~icons/material-symbols/file-json-outline'
import StreamlineColorNewFileFlat from '~icons/streamline-color/new-file-flat'
import VscodeIconsDefaultFolder from '~icons/vscode-icons/default-folder'
import VscodeIconsFileTypeExcel from '~icons/vscode-icons/file-type-excel'
import { FILE_TYPE } from '@/constant/config'
import { getBlobObjectUrl } from '@/utils/file'

interface Props {
    limitType?: keyof typeof FILE_TYPE
    fileData: IFileData
    remove?: (e: Event) => void
    reset?: () => void
}
const props = withDefaults(defineProps<Props>(), {})
const fileIconList: Record<string, any> = {
    zip: MaterialIconThemeZip,
    file: StreamlineColorNewFileFlat,
    excel: VscodeIconsFileTypeExcel,
    json: MaterialSymbolsFileJsonOutline,
    folder: VscodeIconsDefaultFolder,
}

const fileType = ref<string>('')
watch(() => props.fileData, (val) => {
    console.log('FILE_TYPE.image', FILE_TYPE.image, val.type)
    if (props.limitType === 'folder') {
        fileType.value = 'folder'
    }
    else if (FILE_TYPE.image.includes(val.type)) {
        fileType.value = 'image'
    }
    else if (FILE_TYPE.audio.includes(val.type)) {
        fileType.value = 'audio'
    }
    else if (FILE_TYPE.video.includes(val.type)) {
        fileType.value = 'video'
    }
    else if (FILE_TYPE.zip.includes(val.type)) {
        fileType.value = 'zip'
    }
    else if (FILE_TYPE.excel.includes(val.type)) {
        fileType.value = 'excel'
    }
    else if (FILE_TYPE.json.includes(val.type)) {
        fileType.value = 'json'
    }
    else {
        fileType.value = 'file'
    }
}, {
    immediate: true,
})
</script>

<template>
  <div class="size-full relative group user-select-none">
    <div class="user-select-none z-100 opacity-0 absolute top-2 right-0 group-hover:opacity-100  flex gap-4 justify-center items-center">
      <button class="text-white/80 hover:text-white cursor-pointer " @click="remove">
        <Trash2 class="size-8" />
      </button>
      <button class="text-white/80 hover:text-white cursor-pointer " @click="reset">
        <RefreshCw class="size-8" />
      </button>
    </div>
    <div v-if="fileType === 'image'" class="size-full overflow-hidden">
      <img :src="getBlobObjectUrl(fileData.data as Blob)" class="z-90 size-full object-contain stroke-0" alt="">
    </div>
    <div v-else-if="fileType === 'audio'" class="size-full overflow-hidden flex-center">
      <audio controls :src="getBlobObjectUrl(fileData.data as Blob)" />
    </div>
    <div v-else-if="fileType === 'video'" class="size-full overflow-hidden flex-center">
      <video controls :src="getBlobObjectUrl(fileData.data as Blob)" class="size-full object-contain block stroke-0" />
    </div>
    <div v-else class="size-full flex-center p-4">
      <component :is="fileIconList[fileType]" class="size-full object-contain" />
    </div>
  </div>
</template>

<style scoped>

</style>
