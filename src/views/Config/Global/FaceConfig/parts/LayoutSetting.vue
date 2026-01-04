<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

interface Props {
    resetPersonLayout: () => void
    isRowCountChange: number
}
defineProps<Props>()

const { t } = useI18n()
const formErr = defineModel<{ rowCount: string }>('formErr', { required: true })
const formData = defineModel<{ rowCount: number }>('formData', { required: true })
const cardSizeValue = defineModel<{ width: number, height: number }>('cardSizeValue', { required: true })
const isShowPrizeListValue = defineModel<boolean>('isShowPrizeListValue', { required: true })
const isShowAvatarValue = defineModel<boolean>('isShowAvatarValue', { required: false })
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      {{ t('table.layoutSetting') }}
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
        <button class="btn btn-neutral w-30 join-item" :disabled="isRowCountChange !== 1" @click="resetPersonLayout">
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
    <div class="flex items-center justify-between w-full max-w-xs gap-2 mb-3 form-control">
      <div class="label">
        <span class="label-text">{{ t('table.alwaysDisplay') }}</span>
      </div>
      <input
        type="checkbox" :checked="isShowPrizeListValue" class="border-solid checkbox checkbox-secondary border"
        @change="isShowPrizeListValue = !isShowPrizeListValue"
      >
    </div>
    <div class="flex items-center justify-between w-full max-w-xs gap-2 mb-3 form-control">
      <div class="label">
        <span class="label-text">{{ t('table.avatarDisplay') }}</span>
      </div>
      <input
        type="checkbox" :checked="isShowAvatarValue" class="border-solid checkbox checkbox-secondary border"
        @change="isShowAvatarValue = !isShowAvatarValue"
      >
    </div>
  </fieldset>
</template>

<style scoped>

</style>
