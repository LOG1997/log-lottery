<script setup lang='ts'>
import type { IImage } from '@/types/storeType'
import localforage from 'localforage'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageSync from '@/components/ImageSync/index.vue'
import PageHeader from '@/components/PageHeader/index.vue'
import useStore from '@/store'
import UploadDialog from './components/UploadDialog.vue'

const { t } = useI18n()
const globalConfig = useStore().globalConfig
const { getImageList: localImageList } = storeToRefs(globalConfig)
const imgUploadToast = ref(0) // 0是不显示，1是成功，2是失败,3是不是图片
const imageDbStore = localforage.createInstance({
    name: 'imgStore',
})

const uploadVisible = ref(false)

function removeImage(item: IImage) {
    if (item.url === 'Storage') {
        imageDbStore.removeItem(item.id).then(() => {
            globalConfig.removeImage(item.id)
        })
    }
    globalConfig.removeImage(item.id)
}
watch(() => imgUploadToast.value, (val) => {
    if (val !== 0) {
        setTimeout(() => {
            imgUploadToast.value = 0
        }, 2000)
    }
})
</script>

<template>
  <UploadDialog v-model:visible="uploadVisible" />

  <div>
    <PageHeader :title="t('sidebar.imagesManagement')">
      <template #buttons>
        <div class="">
          <label for="explore">
            <span class="btn btn-primary btn-sm" @click="uploadVisible = true">{{ t('button.upload') }}</span>
          </label>
        </div>
      </template>
    </PageHeader>

    <ul class="p-0">
      <li v-for="item in localImageList" :key="item.id" class="mb-3">
        <div class="flex items-center gap-8">
          <div class="avatar h-14">
            <div class="w-12 h-12 mask mask-squircle hover:w-14 hover:h-14">
              <ImageSync :img-item="item" />
            </div>
          </div>
          <div class="w-64">
            <div class="overflow-hidden font-bold whitespace-nowrap text-ellipsis">
              {{ item.name }}
            </div>
          </div>
          <div>
            <button class="btn btn-error btn-xs" @click="removeImage(item)">
              {{ t('button.delete') }}
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang='scss' scoped></style>
