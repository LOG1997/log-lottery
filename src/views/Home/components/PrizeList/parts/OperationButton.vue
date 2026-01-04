<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

defineProps<{
    addTemporaryPrize: () => void
}>()
const { t } = useI18n()
const prizeShow = defineModel('prizeShow', {
    type: Boolean,
    default: false,
})
</script>

<template>
  <transition name="prize-operate" :appear="true">
    <div>
      <div v-show="prizeShow" class="tooltip tooltip-right flex flex-col gap-3" :data-tip="t('tooltip.prizeList')">
        <div class="tooltip tooltip-right" :data-tip="t('tooltip.prizeList')">
          <div
            class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
            @click="prizeShow = !prizeShow"
          >
            <svg-icon name="arrow_left" class="w-full h-full" />
          </div>
        </div>
        <div class="tooltip tooltip-right" :data-tip="t('tooltip.addActivity')">
          <div
            class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
            @click="addTemporaryPrize"
          >
            <svg-icon name="add" class="w-full h-full" />
          </div>
        </div>
      </div>
      <div v-show="!prizeShow" class="tooltip tooltip-right" :data-tip="t('tooltip.prizeList')">
        <div
          class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
          @click="prizeShow = !prizeShow"
        >
          <svg-icon name="arrow_right" class="w-full h-full" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>

</style>
