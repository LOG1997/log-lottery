<script setup lang='ts'>
import type { IFileData } from '../type'
import { getBlobObjectUrl } from '@/utils/file'

interface Props {
    fileType?: 'img' | 'audio' | 'video' | 'json' | 'file'
    fileData: IFileData
    remove?: () => void
}
withDefaults(defineProps<Props>(), {
    fileType: 'img',
})
</script>

<template>
  <div>
    <div v-if="fileType === 'img'" class="relative w-full h-full overflow-hidden">
      <div class="w-full h-full hidden absolute top-full left-0 bg-gray-600/80" />
      <img :src="getBlobObjectUrl(fileData.data as Blob)" alt="">
    </div>
    <img src="" alt="">
  </div>
</template>

<style scoped>

</style>
