<script setup lang='ts'>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader/index.vue'
import UploadDialog from './components/UploadDialog/index.vue'
import { useViewModel } from './useViewModel'

const { t } = useI18n()

const uploadVisible = ref(false)
const {
    tabsList,
    localMusicList,
    removeMusic,
    handleChangeTab,
    resetMusic,
    deleteAll,
    activeTabKey,
    playMusic,
} = useViewModel()
// const globalConfig = useStore().globalConfig
const localMusicListValue = ref(localMusicList)
// async function play(item: IMusic) {
//     globalConfig.setCurrentMusic(item, false)
// }
</script>

<template>
  <UploadDialog v-model:visible="uploadVisible" :active-tab-key="activeTabKey" />
  <div>
    <PageHeader :title="t('sidebar.musicManagement')">
      <template #buttons>
        <div role="tablist" class="tabs tabs-lift">
          <a v-for="item in tabsList" :key="item.key" role="tab" class="tab" :class="{ 'tab-active': activeTabKey === item.key }" @click="handleChangeTab(item.key)">{{ item.label }}</a>
        </div>
      </template>
    </PageHeader>
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
    <div>
      <ul class="p-0">
        <li v-for="item in localMusicListValue" :key="item.id" class="flex items-center gap-6 pb-2 mb-3">
          <div class="mr-12 overflow-hidden w-72 whitespace-nowrap text-ellipsis" :title="item.name">
            <a class="link hover:text-primary">{{ item.name }}</a>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-primary btn-xs" @click="playMusic(item)">
              {{ t('button.play') }}
            </button>
            <button class="btn btn-error btn-xs" @click="removeMusic(item)">
              {{ t('button.delete') }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
