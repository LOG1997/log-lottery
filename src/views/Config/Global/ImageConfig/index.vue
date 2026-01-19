<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { useViewModel } from './useViewModel'

const { t } = useI18n()
const {
    localImageList,
    uploadVisible,
    handleChangeTab,
    activeTabKey,
    removeImage,
} = useViewModel()
</script>

<template>
  <UploadDialog v-model:visible="uploadVisible" />

  <div>
    <PageHeader :title="t('sidebar.imagesManagement')">
      <template #buttons>
        <div role="tablist" class="tabs tabs-lift">
          <a role="tab" class="tab" :class="{ 'tab-active': activeTabKey === 'prize' }" @click="handleChangeTab('prize')">奖品</a>
          <a role="tab" class="tab" :class="{ 'tab-active': activeTabKey === 'avatar' }" @click="handleChangeTab('avatar')">头像</a>
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
