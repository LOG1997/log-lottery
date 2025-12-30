<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import SelectFont from '../components/SelectFont.vue'

const { t } = useI18n()
const languageList = defineModel<any[]>('languageList')
const topTitleValue = defineModel<string>('topTitleValue', { default: '' })
const languageValue = defineModel<string>('languageValue', { default: 'zh-CN' })
const textSizeValue = defineModel<number>('textSizeValue')
const currentFontValue = defineModel<string>('currentFontValue', { default: '', type: String })
const currentTitleFontValue = defineModel<string>('currentTitleFontValue', { default: '', type: String })
const titleFontSyncGlobalValue = defineModel<boolean>('titleFontSyncGlobalValue')
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      {{ t('table.textSetting') }}
    </legend>
    <label class="label">
      <div class="label">
        <span class="label-text">{{ t('table.title') }}</span>
      </div>
    </label>
    <input
      v-model="topTitleValue" type="text" :placeholder="t('placeHolder.enterTitle')"
      class="w-full max-w-xs input input-bordered"
    >
    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.language') }}</span>
      </div>
      <select v-model="languageValue" data-choose-theme class="w-full max-w-xs border-solid select border">
        <option disabled selected>{{ t('table.language') }}</option>
        <option v-for="item in languageList" :key="item.key" :value="item.key">{{ item.name }}</option>
      </select>
    </label>
    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.textSize') }}</span>
      </div>
      <input
        v-model="textSizeValue" type="number" placeholder="Type here"
        class="w-full max-w-xs input input-bordered"
      >
    </label>
    <label class="w-full max-w-xs form-control mt-3">
      <div class="label">
        <span class="label-text">{{ t('table.globalFont') }}</span>
      </div>
      <SelectFont v-model:selected-font="currentFontValue" />
    </label>
    <label class="flex flex-row w-full max-w-xs mt-5 gap-10 form-control">
      <div class="w-3/4">
        <div class="label">
          <span class="label-text">{{ t('table.titleFont') }}</span>
        </div>
        <SelectFont v-model:selected-font="currentTitleFontValue" :disabled="titleFontSyncGlobalValue" />
      </div>
      <div class="flex flex-col gap-4">
        <div class="label">
          <span class="label-text">{{ t('table.syncGlobalFont') }}</span>
        </div>
        <input type="checkbox" :checked="titleFontSyncGlobalValue" class="border-solid checkbox checkbox-secondary border" @change="titleFontSyncGlobalValue = !titleFontSyncGlobalValue">
      </div>
    </label>
  </fieldset>
</template>

<style scoped>

</style>
