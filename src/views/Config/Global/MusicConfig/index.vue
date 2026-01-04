<script setup lang='ts'>
import type { IMusic } from '@/types/storeType'
import localforage from 'localforage'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader/index.vue'
import useStore from '@/store'
import UploadDialog from './components/UploadDialog.vue'

const { t } = useI18n()
const audioDbStore = localforage.createInstance({
    name: 'audioStore',
})
const globalConfig = useStore().globalConfig

const { getMusicList: localMusicList } = storeToRefs(globalConfig)
const localMusicListValue = ref(localMusicList)
const uploadVisible = ref(false)
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
</script>

<template>
  <UploadDialog v-model:visible="uploadVisible" />
  <div>
    <PageHeader :title="t('sidebar.musicManagement')">
      <template #buttons>
        <div class="flex gap-3">
          <button class="btn btn-primary btn-sm" @click="resetMusic">
            {{ t('button.reset') }}
          </button>
          <label for="explore">
            <span class="btn btn-primary btn-sm" @click="uploadVisible = true">{{ t('button.upload') }}</span>
          </label>
          <button class="btn btn-error btn-sm" @click="deleteAll">
            {{ t('button.allDelete') }}
          </button>
        </div>
      </template>
    </PageHeader>

    <div>
      <ul class="p-0">
        <li v-for="item in localMusicListValue" :key="item.id" class="flex items-center gap-6 pb-2 mb-3">
          <div class="mr-12 overflow-hidden w-72 whitespace-nowrap text-ellipsis" :title="item.name">
            <a class="link hover:text-primary">{{ item.name }}</a>
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
