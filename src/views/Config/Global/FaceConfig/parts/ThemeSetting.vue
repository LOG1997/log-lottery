<script setup lang='ts'>
import type { IImage } from '@/types/storeType'
import { reactive } from 'vue'
import { ColorPicker } from 'vue3-colorpicker'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { daisyuiThemes } from '@/constant/theme'
import 'vue3-colorpicker/style.css'

interface Props {
    imageList: Array<IImage>
}
defineProps<Props>()
const themeList = reactive(daisyuiThemes)
const router = useRouter()
const { t } = useI18n()

const themeValue = defineModel<string>('themeValue')
const backgroundImageValue = defineModel<object>('backgroundImageValue')
const cardColorValue = defineModel<string>('cardColorValue')
const luckyCardColorValue = defineModel<string>('luckyCardColorValue')
const textColorValue = defineModel<string>('textColorValue')
const patternColorValue = defineModel<string>('patternColorValue')
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      {{ t('table.themeSetting') }}
    </legend>

    <div class="w-full max-w-xs form-control">
      <label class="label">
        <span class="label-text">{{ t('table.theme') }}</span>
      </label>
      <select v-model="themeValue" data-choose-theme class="w-full max-w-xs border-solid select border">
        <option disabled selected>
          {{ t('table.theme') }}
        </option>
        <option v-for="(item, index) in themeList" :key="index" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div class="w-full max-w-xs form-control">
      <label class="label">
        <span class="label-text">{{ t('table.backgroundImage') }}</span>
      </label>
      <select
        v-model="backgroundImageValue" data-choose-theme
        class="box-border w-full max-w-xs truncate border-solid select border"
      >
        <option disabled selected class="w-full truncate">
          {{ t('table.backgroundImage') }}
        </option>
        <option
          v-for="(item, index) in [{ name: '❌', url: '', id: '' }, ...imageList]" :key="index"
          :value="item"
          :title="item.name"
          class="box-border w-full truncate"
        >
          <span class="truncate w-option-xs">{{ item.name }}</span>
        </option>
      </select>
      <span class="label">
        {{ t('tooltip.pleaseGoto') }}
        <a class="link link-info" @click="() => { router.push('image') }">
          {{ t('sidebar.imagesManagement') }}
        </a>
        {{ t('tooltip.uploadImage') }}</span>
    </div>
    <div class="grid w-full grid-cols-2 gap-4">
      <div class="flex flex-col items-center max-w-xs gap-1 form-control">
        <label class="label">
          <span class="label-text">{{ t('table.cardColor') }}</span>
        </label>
        <ColorPicker v-model="cardColorValue" v-model:pure-color="cardColorValue" />
      </div>
      <div class="flex flex-col items-center max-w-xs gap-1 form-control">
        <label class="label">
          <span class="label-text">{{ t('table.winnerColor') }}</span>
        </label>
        <ColorPicker v-model="luckyCardColorValue" v-model:pure-color="luckyCardColorValue" />
      </div>
      <div class="flex flex-col items-center max-w-xs gap-1 form-control">
        <label class="label">
          <span class="label-text">{{ t('table.textColor') }}</span>
          <div class="tooltip" data-tip="设置文本颜色会覆盖标题样式">
            <button class="btn btn-circle h-4 hover:bg-base-300">
              ?
            </button>
          </div>
        </label>
        <ColorPicker v-model="textColorValue" v-model:pure-color="textColorValue" />
      </div>
      <div class="flex flex-col items-center max-w-xs gap-1 form-control">
        <label class="label">
          <span class="label-text">{{ t('table.highlightColor') }}</span>
        </label>
        <ColorPicker v-model="patternColorValue" v-model:pure-color="patternColorValue" />
      </div>
    </div>
  </fieldset>
</template>

<style scoped>

</style>
