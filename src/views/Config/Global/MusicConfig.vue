<script setup lang='ts'>
import type { IMusic } from '@/types/storeType'
import useStore from '@/store'
import { readFileData } from '@/utils/file'
import localforage from 'localforage'
import { storeToRefs } from 'pinia'

import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const audioUploadToast = ref(0) // 0是不显示，1是成功，2是失败,3是不是图片
const audioDbStore = localforage.createInstance({
  name: 'audioStore',
})
const globalConfig = useStore().globalConfig

const { getMusicList: localMusicList } = storeToRefs(globalConfig)
const limitType = ref('audio/*')
const localMusicListValue = ref(localMusicList)
async function play(item: IMusic) {
  globalConfig.setCurrentMusic(item, false)
}

function deleteMusic(item: IMusic) {
  globalConfig.removeMusic(item.id)
  audioDbStore.removeItem(item.name)
  // setTimeout(()=>{
  //     localMusicListValue.value=localMusicList
  // },100)
}
function resetMusic() {
  globalConfig.resetMusicList()
  audioDbStore.clear()
}
function deleteAll() {
  globalConfig.clearMusicList()
  audioDbStore.clear()
}
async function getMusicDbStore() {
  const keys = await audioDbStore.keys()
  if (keys.length > 0) {
    audioDbStore.iterate((value: string, key: string) => {
      globalConfig.addMusic({
        id: key + new Date().getTime().toString(),
        name: key,
        url: 'Storage',
      })
    })
  }
}
async function handleFileChange(e: Event) {
  const isAudio = /audio*/.test(((e.target as HTMLInputElement).files as FileList)[0].type)
  if (!isAudio) {
    audioUploadToast.value = 3

    return
  }
  const { dataUrl, fileName } = await readFileData(((e.target as HTMLInputElement).files as FileList)[0])
  audioDbStore.setItem(`${new Date().getTime().toString()}+${fileName}`, dataUrl)
    .then(() => {
      audioUploadToast.value = 1
      getMusicDbStore()
    })
    .catch(() => {
      audioUploadToast.value = 2
    })
}

onMounted(() => {
  getMusicDbStore()
})
</script>

<template>
  <div>
    <div class="flex gap-3">
      <button class="btn btn-primary btn-sm" @click="resetMusic">
        {{ t('button.reset') }}
      </button>
      <label for="explore">
        <input
          id="explore" type="file" class="" style="display: none" :accept="limitType"
          @change="handleFileChange"
        >
        <span class="btn btn-primary btn-sm">{{ t('button.upload') }}</span>
      </label>
      <button class="btn btn-error btn-sm" @click="deleteAll">
        {{ t('button.allDelete') }}
      </button>
    </div>
    <div>
      <ul class="p-0">
        <li v-for="item in localMusicListValue" :key="item.id" class="flex items-center gap-6 pb-2 mb-3 divide-y">
          <div class="mr-12 overflow-hidden w-72 whitespace-nowrap text-ellipsis">
            <span>
              {{ item.name }}</span>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-primary btn-xs" @click="play(item)">
              {{ t('button.play') }}
            </button>
            <button class="btn btn-error btn-xs" @click="deleteMusic(item)">
              {{ t('button.delete') }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
