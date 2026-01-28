<script setup lang='ts'>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageSync from '@/components/ImageSync/index.vue'
import PageHeader from '@/components/PageHeader/index.vue'
import UploadDialog from './components/UploadDialog/index.vue'
import { useViewModel } from './useViewModel'

const { t } = useI18n()
const {
    tabsList,
    localImageList,
    handleChangeTab,
    activeTabKey,
    removeImage,
} = useViewModel()
const uploadVisible = ref(false)
</script>

<template>
  <UploadDialog v-model:visible="uploadVisible" :active-tab-key="activeTabKey" />

  <div>
    <PageHeader :title="t('sidebar.imagesManagement')">
      <template #buttons>
        <div role="tablist" class="tabs tabs-lift">
          <a v-for="item in tabsList" :key="item.key" role="tab" class="tab" :class="{ 'tab-active': activeTabKey === item.key }" @click="handleChangeTab(item.key)">{{ item.label }}</a>
        </div>
      </template>
    </PageHeader>
    <div class="">
      <label for="explore">
        <span class="btn btn-primary btn-sm" @click="uploadVisible = true">{{ t('button.upload') }}</span>
      </label>
    </div>
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
