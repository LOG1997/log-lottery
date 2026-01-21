<script setup lang='ts'>
import type { IFileData } from '../type'
import { useMediaControls } from '@vueuse/core'
import { Pause, Play, RefreshCw, Trash2 } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { getBlobObjectUrl } from '@/utils/file'

type FileType = 'image' | 'audio' | 'video' | 'json' | 'zip' | 'file' | ''
interface Props {
    fileData: IFileData
    remove?: (e: Event) => void
    reset?: () => void
}
const props = withDefaults(defineProps<Props>(), {
})

const audioSource = shallowRef<any>(null)
const audioRef = useTemplateRef('audioRef')
const fileType = ref<FileType>('')
watch(() => props.fileData, (val) => {
    const fileDataType = val.type.split('/')[0]
    switch (fileDataType) {
        case 'image':
            fileType.value = fileDataType as FileType
            break
        case 'audio':
            fileType.value = fileDataType as FileType
            audioSource.value = getBlobObjectUrl(props.fileData.data as Blob)
            break
        case 'video':
            fileType.value = fileDataType as FileType
            break
        default:
            fileType.value = 'file' as FileType
            break
    }
}, {
    immediate: true,
})

const { playing, currentTime, duration, volume } = useMediaControls(audioRef, {
    src: audioSource,
})
</script>

<template>
  <div class="size-full relative group user-select-none">
    <audio controls :src="getBlobObjectUrl(fileData.data as Blob)" />
    <div class="user-select-none size-full z-100 opacity-0 absolute top-0 left-0 group-hover:opacity-100 bg-gray-600/40 flex gap-4 justify-center items-center">
      <button class="text-white/80 hover:text-white cursor-pointer " @click="remove">
        <Trash2 class="size-8" />
      </button>
      <button class="text-white/80 hover:text-white cursor-pointer " @click="reset">
        <RefreshCw class="size-8" />
      </button>
      <button v-if="audioRef && !playing" class="text-white/80 hover:text-white cursor-pointer " @click="playing = true">
        <Play class="size-8" />
      </button>
      <button v-if="audioRef && playing" class="text-white/80 hover:text-white cursor-pointer " @click="playing = false">
        <Pause class="size-8" />
      </button>
    </div>
    <div v-if="fileType === 'image'" class="size-full overflow-hidden">
      <img :src="getBlobObjectUrl(fileData.data as Blob)" class="z-90 size-full object-contain stroke-0" alt="">
    </div>
    <div v-else-if="fileType === 'audio'" class="size-full overflow-hidden">
      <audio ref="audioRef" controls :src="getBlobObjectUrl(fileData.data as Blob)" />
    </div>
    <img src="" alt="">
  </div>
</template>

<style scoped>

</style>
