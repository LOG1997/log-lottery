<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import PatternEdit from '../components/PatternEdit.vue'

interface Props {
    rowCount: number
    cardColor: string
    patternColor: string
    patternList: number[]
    clearPattern: () => void
    resetPattern: () => void
}
defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      {{ t('table.patternSetting') }}
    </legend>
    <div class="items-center gap-24 mb-0 form-control">
      <div>
        <label class="label">
          <span class="label-text">{{ t('table.patternSetting') }}</span>
        </label>
        <div class="h-auto">
          <PatternEdit
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
</template>

<style scoped>

</style>
