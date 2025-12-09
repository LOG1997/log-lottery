<script setup lang='ts'>
import localforage from 'localforage'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { ColorPicker } from 'vue3-colorpicker'
import { useI18n } from 'vue-i18n'
import { z as zod } from 'zod'
import { daisyuiThemes } from '@/constant/theme'
import i18n, { languageList } from '@/locales/i18n'
import useStore from '@/store'
import { themeChange } from '@/utils'
import { clearAllDbStore } from '@/utils/localforage'
import PatternSetting from './components/PatternSetting.vue'
import 'vue3-colorpicker/style.css'

const { t } = useI18n()
const globalConfig = useStore().globalConfig
const personConfig = useStore().personConfig
const prizeConfig = useStore().prizeConfig
const { getTopTitle: topTitle, getTheme: localTheme, getPatterColor: patternColor, getPatternList: patternList, getCardColor: cardColor, getLuckyColor: luckyCardColor, getTextColor: textColor, getCardSize: cardSize, getTextSize: textSize, getRowCount: rowCount, getIsShowPrizeList: isShowPrizeList, getLanguage: userLanguage, getBackground: backgroundImage, getImageList: imageList, getIsShowAvatar: isShowAvatar,
} = storeToRefs(globalConfig)
const { getAlreadyPersonList: alreadyPersonList, getNotPersonList: notPersonList } = storeToRefs(personConfig)
const colorPickerRef = ref()
const resetDataDialogRef = ref()
interface ThemeDaType {
  [key: string]: any
}
const isRowCountChange = ref(0) // 0未改变，1改变,2加载中
const themeValue = ref(localTheme.value.name)
const topTitleValue = ref(structuredClone(topTitle.value))
const cardColorValue = ref(structuredClone(cardColor.value))
const luckyCardColorValue = ref(structuredClone(luckyCardColor.value))
const textColorValue = ref(structuredClone(textColor.value))
const cardSizeValue = ref(structuredClone(cardSize.value))
const textSizeValue = ref(structuredClone(textSize.value))
const rowCountValue = ref(structuredClone(rowCount.value))
const languageValue = ref(structuredClone(userLanguage.value))
const isShowPrizeListValue = ref(structuredClone(isShowPrizeList.value))
const isShowAvatarValue = ref(structuredClone(isShowAvatar.value))
const patternColorValue = ref(structuredClone(patternColor.value))
const themeList = ref(daisyuiThemes)
const daisyuiThemeList = ref<ThemeDaType>(daisyuiThemes)
const backgroundImageValue = ref(backgroundImage.value)
const formData = ref({
  rowCount: rowCountValue,
})
const formErr = ref({
  rowCount: '',
})
const schema = zod.object({
  rowCount: zod.number({
    error: i18n.global.t('error.require'),
    // required_error: i18n.global.t('error.require'),
    // invalid_type_error: i18n.global.t('error.requireNumber'),
  })
    .min(1, i18n.global.t('error.minNumber1'))
    .max(100, i18n.global.t('error.maxNumber100')),
  // 格式化

})
type ValidatePayload = zod.infer<typeof schema>
const payload: ValidatePayload = {
  rowCount: formData.value.rowCount,
}
function parseSchema(props: ValidatePayload) {
  return schema.parseAsync(props)
}

function resetPersonLayout() {
  isRowCountChange.value = 2
  setTimeout(() => {
    const alreadyLen = alreadyPersonList.value.length
    const notLen = notPersonList.value.length
    if (alreadyLen <= 0 && notLen <= 0) {
      return
    }
    const allPersonList = alreadyPersonList.value.concat(notPersonList.value)
    const newAlreadyPersonList = allPersonList.slice(0, alreadyLen)
    const newNotPersonList = allPersonList.slice(alreadyLen, notLen + alreadyLen)
    personConfig.deleteAllPerson()
    personConfig.addNotPersonList(newNotPersonList)
    personConfig.addAlreadyPersonList(newAlreadyPersonList, null)

    isRowCountChange.value = 0
  }, 1000)
}

function clearPattern() {
  globalConfig.setPatternList([] as number[])
}
function resetPattern() {
  globalConfig.resetPatternList()
}

function resetData() {
  globalConfig.reset()
  personConfig.reset()
  prizeConfig.resetDefault()
  //   删除所有indexDb
  clearAllDbStore()
  // 刷新页面
  window.location.reload()
}

watch(() => formData.value.rowCount, () => {
  payload.rowCount = formData.value.rowCount
  parseSchema(payload).then((res) => {
    if (res.rowCount) {
      isRowCountChange.value = 1
      globalConfig.setRowCount(res.rowCount)
    }
  }).catch((err) => {
    formErr.value.rowCount = err.issues[0].message
  })
})

watch(topTitleValue, (val) => {
  globalConfig.setTopTitle(val)
})
watch(themeValue, (val: any) => {
  const selectedThemeDetail = daisyuiThemeList.value[val]
  globalConfig.setTheme({ name: val, detail: selectedThemeDetail })
  themeChange(val)
//   if (selectedThemeDetail.primary && (isHex(selectedThemeDetail.primary) || isRgbOrRgba(selectedThemeDetail.primary))) {
//     globalConfig.setCardColor(selectedThemeDetail.primary)
//   }
}, { deep: true })

watch(cardColorValue, (val: string) => {
  globalConfig.setCardColor(val)
}, { deep: true })
watch(luckyCardColorValue, (val: string) => {
  globalConfig.setLuckyCardColor(val)
}, { deep: true })
watch(patternColorValue, (val: string) => {
  globalConfig.setPatterColor(val)
})
watch(textColorValue, (val: string) => {
  globalConfig.setTextColor(val)
}, { deep: true })

watch(cardSizeValue, (val: { width: number, height: number }) => {
  globalConfig.setCardSize(val)
}, { deep: true })

watch(isShowPrizeListValue, () => {
  globalConfig.setIsShowPrizeList(isShowPrizeListValue.value)
})
watch(backgroundImageValue, (val) => {
  globalConfig.setBackground(val)
})
watch(languageValue, (val: string) => {
  globalConfig.setLanguage(val)
})
watch(isShowAvatarValue, () => {
  globalConfig.setIsShowAvatar(isShowAvatarValue.value)
})
onMounted(() => {
})
</script>

<template>
  <dialog id="my_modal_1" ref="resetDataDialogRef" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="py-4">
        {{ t('dialog.dialogResetAllData') }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="resetDataDialogRef.close()">
            {{ t(`button.cancel`) }}
          </button>
          <button class="btn" @click="resetData">
            {{ t('button.confirm') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="flex flex-col gap-4">
    <h2>{{ t('viewTitle.globalSetting') }}</h2>
    <div class="mb-8">
      <button class="btn btn-sm btn-primary" @click="resetDataDialogRef.showModal()">
        {{ t('button.resetAllData') }}
      </button>
    </div>
    <div class="flex flex-wrap w-full gap-6">
      <!-- 文本设置（主标题、语言、文字大小） -->
      <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs">
        <legend class="fieldset-legend">
          文本设置
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
          <select v-model="languageValue" data-choose-theme class="w-full max-w-xs border-solid select border-1">
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
      </fieldset>
      <!-- 布局设置（列数、卡片宽度、卡片高度 -->
      <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs">
        <legend class="fieldset-legend">
          布局设置
        </legend>
        <label class="flex flex-row items-center form-control">
          <div class="">
            <div class="label">
              <span class="label-text">{{ t('table.columnNumber') }}</span>
              <div class="help">
                <span v-if="formErr.rowCount" class="text-xs text-red-400 help-text">
                  {{ formErr.rowCount }}
                </span>
              </div>
            </div>
          </div>
        </label>
        <div class="join">
          <input
            v-model="formData.rowCount" type="number" placeholder="Type here"
            class="w-full input input-bordered join-item"
          >
          <div class="tooltip join-item" :data-tip="t('tooltip.resetLayout')">
            <button class="btn btn-neutral w-[120px] join-item" :disabled="isRowCountChange !== 1" @click="resetPersonLayout">
              <span>{{ t('button.setLayout') }}</span>
              <span v-show="isRowCountChange === 2" class="loading loading-ring loading-md" />
            </button>
          </div>
        </div>

        <label class="flex flex-row w-full max-w-xs gap-10 form-control">
          <div>
            <div class="label">
              <span class="label-text">{{ t('table.cardWidth') }}</span>
            </div>
            <input
              v-model="cardSizeValue.width" type="number" placeholder="Type here"
              class="w-full max-w-xs input input-bordered"
            >
          </div>
          <div>
            <div class="label">
              <span class="label-text">{{ t('table.cardHeight') }}</span>
            </div>
            <input
              v-model="cardSizeValue.height" type="number" placeholder="Type here"
              class="w-full max-w-xs input input-bordered"
            >
          </div>
        </label>
      </fieldset>
      <!-- 主题设置（主题、背景图片） -->
      <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs">
        <legend class="fieldset-legend">
          主题设置
        </legend>

        <div class="w-full max-w-xs form-control">
          <label class="label">
            <span class="label-text">{{ t('table.theme') }}</span>
          </label>
          <select v-model="themeValue" data-choose-theme class="w-full max-w-xs border-solid select border-1">
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
            class="box-border w-full max-w-xs truncate border-solid select border-1"
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
          <span class="label">请先前往图片管理上传图片</span>
        </div>
        <div class="grid w-full grid-cols-2 gap-4">
          <div class="flex flex-col items-center max-w-xs gap-1 form-control">
            <label class="label">
              <span class="label-text">{{ t('table.cardColor') }}</span>
            </label>
            <ColorPicker ref="colorPickerRef" v-model="cardColorValue" v-model:pure-color="cardColorValue" />
          </div>
          <div class="flex flex-col items-center max-w-xs gap-1 form-control">
            <label class="label">
              <span class="label-text">{{ t('table.winnerColor') }}</span>
            </label>
            <ColorPicker ref="colorPickerRef" v-model="luckyCardColorValue" v-model:pure-color="luckyCardColorValue" />
          </div>
          <div class="flex flex-col items-center max-w-xs gap-1 form-control">
            <label class="label">
              <span class="label-text">{{ t('table.textColor') }}</span>
            </label>
            <ColorPicker ref="colorPickerRef" v-model="textColorValue" v-model:pure-color="textColorValue" />
          </div>
          <div class="flex flex-col items-center max-w-xs gap-1 form-control">
            <label class="label">
              <span class="label-text">{{ t('table.highlightColor') }}</span>
            </label>
            <ColorPicker ref="colorPickerRef" v-model="patternColorValue" v-model:pure-color="patternColorValue" />
          </div>
        </div>
      </fieldset>
      <!-- 图案设置 -->
      <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs">
        <legend class="fieldset-legend">
          图案设置
        </legend>
        <div class="items-center gap-24 mb-0 form-control">
          <div>
            <label class="label">
              <span class="label-text">{{ t('table.patternSetting') }}</span>
            </label>
            <div class="h-auto">
              <PatternSetting
                :row-count="rowCount" :card-color="cardColor" :pattern-color="patternColor"
                :pattern-list="patternList"
              />
            </div>
          </div>
          <div class="flex w-full gap-3 m-0">
            <button class="mt-5 btn btn-info btn-sm" @click.stop="clearPattern">
              <span>{{ t('button.clearPattern') }}</span>
            </button>
            <div class="tooltip" :data-tip="t('tooltip.defaultLayout')">
              <button class="mt-5 btn btn-info btn-sm" @click="resetPattern">
                <span>{{ t('button.DefaultPattern') }}</span>
              </button>
            </div>
          </div>
        </div>
      </fieldset>
      <!-- 其他设置（是否常显奖项列表、是否显示头像） -->
      <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs">
        <legend class="fieldset-legend">
          其他设置
        </legend>

        <div class="flex items-center justify-between w-full max-w-xs gap-2 mb-3 form-control">
          <div class="label">
            <span class="label-text">{{ t('table.alwaysDisplay') }}</span>
          </div>
          <input
            type="checkbox" :checked="isShowPrizeListValue" class="border-solid checkbox checkbox-secondary border-1"
            @change="isShowPrizeListValue = !isShowPrizeListValue"
          >
        </div>
        <div class="flex items-center justify-between w-full max-w-xs gap-2 mb-3 form-control">
          <div class="label">
            <span class="label-text">{{ t('table.avatarDisplay') }}</span>
          </div>
          <input
            type="checkbox" :checked="isShowAvatarValue" class="border-solid checkbox checkbox-secondary border-1"
            @change="isShowAvatarValue = !isShowAvatarValue"
          >
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
