<script setup lang='ts'>
import i18n, { languageList } from '@/locales/i18n'

import useStore from '@/store'
import { themeChange } from '@/utils'
import { isHex, isRgbOrRgba } from '@/utils/color'
import daisyuiThemes from 'daisyui/src/theming/themes'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { ColorPicker } from 'vue3-colorpicker'
import { useI18n } from 'vue-i18n'
import zod from 'zod'
import PatternSetting from './components/PatternSetting.vue'
import 'vue3-colorpicker/style.css'

const { t } = useI18n()
const globalConfig = useStore().globalConfig
const personConfig = useStore().personConfig
const prizeConfig = useStore().prizeConfig
const { getTopTitle: topTitle, getTheme: localTheme, getPatterColor: patternColor, getPatternList: patternList, getCardColor: cardColor, getLuckyColor: luckyCardColor, getTextColor: textColor, getCardSize: cardSize, getTextSize: textSize, getRowCount: rowCount, getIsShowPrizeList: isShowPrizeList, getLanguage: userLanguage, getBackground: backgroundImage, getImageList: imageList, getIsShowAvatar: isShowAvatar
} = storeToRefs(globalConfig)
const { getAlreadyPersonList: alreadyPersonList, getNotPersonList: notPersonList } = storeToRefs(personConfig)
const colorPickerRef = ref()
const resetDataDialogRef = ref()
interface ThemeDaType {
  [key: string]: any
}
const isRowCountChange = ref(0) // 0未改变，1改变,2加载中
const themeValue = ref(localTheme.value.name)
const topTitleValue = ref(JSON.parse(JSON.stringify(topTitle.value)))
const cardColorValue = ref(JSON.parse(JSON.stringify(cardColor.value)))
const luckyCardColorValue = ref(JSON.parse(JSON.stringify(luckyCardColor.value)))
const textColorValue = ref(JSON.parse(JSON.stringify(textColor.value)))
const cardSizeValue = ref(JSON.parse(JSON.stringify(cardSize.value)))
const textSizeValue = ref(JSON.parse(JSON.stringify(textSize.value)))
const rowCountValue = ref(JSON.parse(JSON.stringify(rowCount.value)))
const languageValue = ref(JSON.parse(JSON.stringify(userLanguage.value)))
const isShowPrizeListValue = ref(JSON.parse(JSON.stringify(isShowPrizeList.value)))
const isShowAvatarValue = ref(JSON.parse(JSON.stringify(isShowAvatar.value)))
const patternColorValue = ref(JSON.parse(JSON.stringify(patternColor.value)))
const themeList = ref(Object.keys(daisyuiThemes))
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
    required_error: i18n.global.t('error.require'),
    invalid_type_error: i18n.global.t('error.requireNumber'),
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
  // 刷新页面
  window.location.reload()
}

// const handleChangeShowFields = (fieldItem: any) => {
//     formData.value.showField.map((item) => {
//         if (item.label === fieldItem.label) {
//             item.value = !item.value
//         }
//     })
// }

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
  if (selectedThemeDetail.primary && (isHex(selectedThemeDetail.primary) || isRgbOrRgba(selectedThemeDetail.primary))) {
    globalConfig.setCardColor(selectedThemeDetail.primary)
  }
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
  <div>
    <h2>{{ t('viewTitle.globalSetting') }}</h2>
    <div class="mb-8">
      <button class="btn btn-sm btn-primary" @click="resetDataDialogRef.showModal()">
        {{ t('button.resetAllData') }}
      </button>
    </div>
    <label class="flex flex-row items-center w-full gap-24 mb-10 form-control">
      <div class="">
        <div class="label">
          <span class="label-text">{{ t('table.title') }}</span>
        </div>
        <input
          v-model="topTitleValue" type="text" :placeholder="t('placeHolder.enterTitle')"
          class="w-full max-w-xs input input-bordered"
        >
      </div>
    </label>
    <label class="flex flex-row items-center w-full gap-24 mb-10 form-control">
      <div class="">
        <div class="label">
          <span class="label-text">{{ t('table.columnNumber') }}</span>
        </div>
        <input
          v-model="formData.rowCount" type="number" placeholder="Type here"
          class="w-full max-w-xs input input-bordered"
        >
        <div class="help">
          <span v-if="formErr.rowCount" class="text-sm text-red-400 help-text">
            {{ formErr.rowCount }}
          </span>
        </div>
      </div>
      <div>
        <div class="tooltip" :data-tip="t('tooltip.resetLayout')">
          <button class="mt-5 btn btn-info btn-sm" :disabled="isRowCountChange !== 1" @click="resetPersonLayout">
            <span>{{ t('button.setLayout') }}</span>
            <span v-show="isRowCountChange === 2" class="loading loading-ring loading-md" />
          </button>
        </div>
      </div>
    </label>
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
        <span class="label-text">{{ t('table.theme') }}</span>
      </div>
      <select v-model="themeValue" data-choose-theme class="w-full max-w-xs border-solid select border-1">
        <option disabled selected>{{ t('table.theme') }}</option>
        <option v-for="(item, index) in themeList" :key="index" :value="item">{{ item }}</option>
      </select>
    </label>
    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.backgroundImage') }}</span>
      </div>
      <select
        v-model="backgroundImageValue" data-choose-theme
        class="w-full max-w-xs border-solid select border-1"
      >
        <option disabled selected>{{ t('table.backgroundImage') }}</option>
        <option
          v-for="(item, index) in [{ name: '❌', url: '', id: '' }, ...imageList]" :key="index"
          :value="item"
        >{{ item.name }}</option>
      </select>
    </label>
    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.cardColor') }}</span>
      </div>
      <ColorPicker ref="colorPickerRef" v-model="cardColorValue" v-model:pure-color="cardColorValue" />
    </label>
    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.winnerColor') }}</span>
      </div>
      <ColorPicker ref="colorPickerRef" v-model="luckyCardColorValue" v-model:pure-color="luckyCardColorValue" />
    </label>

    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.textColor') }}</span>
      </div>
      <ColorPicker ref="colorPickerRef" v-model="textColorValue" v-model:pure-color="textColorValue" />
    </label>
    <label class="flex flex-row w-full max-w-xs gap-10 mb-10 form-control">
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
    <label class="w-full max-w-xs mb-10 form-control">
      <div class="label">
        <span class="label-text">{{ t('table.textSize') }}</span>
      </div>
      <input
        v-model="textSizeValue" type="number" placeholder="Type here"
        class="w-full max-w-xs input input-bordered"
      >
    </label>
    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">{{ t('table.highlightColor') }}</span>
      </div>
      <ColorPicker ref="colorPickerRef" v-model="patternColorValue" v-model:pure-color="patternColorValue" />
    </label>
    <label class="flex flex-row items-center w-full gap-24 mb-0 form-control">
      <div>
        <div class="label">
          <span class="label-text">{{ t('table.patternSetting') }}</span>
        </div>
        <div class="h-auto">
          <PatternSetting
            :row-count="rowCount" :card-color="cardColor" :pattern-color="patternColor"
            :pattern-list="patternList"
          />
        </div>
      </div>
    </label>
    <div class="flex w-full h-24 gap-3 m-0">
      <button class="mt-5 btn btn-info btn-sm" @click.stop="clearPattern">
        <span>{{ t('button.clearPattern') }}</span>
      </button>
      <div class="tooltip" :data-tip="t('tooltip.defaultLayout')">
        <button class="mt-5 btn btn-info btn-sm" @click="resetPattern">
          <span>{{ t('button.DefaultPattern') }}</span>
        </button>
      </div>
    </div>

    <label class="w-full max-w-xs mb-10 form-control">
      <div class="label">
        <span class="label-text">{{ t('table.alwaysDisplay') }}</span>
      </div>
      <input
        type="checkbox" :checked="isShowPrizeListValue" class="mt-2 border-solid checkbox checkbox-secondary border-1"
        @change="isShowPrizeListValue = !isShowPrizeListValue"
      >
    </label>

    <label class="w-full max-w-xs mb-10 form-control">
        <div class="label">
            <span class="label-text">{{ t('table.avatarDisplay') }}</span>
        </div>
        <input type="checkbox" :checked="isShowAvatarValue" @change="isShowAvatarValue = !isShowAvatarValue"
          class="mt-2 border-solid checkbox checkbox-secondary border-1" />
    </label>
  </div>
</template>

<style lang='scss' scoped></style>
