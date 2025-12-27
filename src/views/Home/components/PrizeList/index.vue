<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EditSeparateDialog from '@/components/NumberSeparate/EditSeparateDialog.vue'
import OfficialPrizeList from './parts/OfficialPrizeList.vue'
import TemporaryDialog from './parts/TemporaryDialog.vue'
import TemporaryList from './parts/TemporaryList.vue'
import { usePrizeList } from './usePrizeList'

const temporaryPrizeRef = ref()
const {
  temporaryPrize,
  changePersonCount,
  selectPrize,
  localImageList,
  addTemporaryPrize,
  submitTemporaryPrize,
  submitData,
  deleteTemporaryPrize,
  prizeShow,
  currentPrize,
  localPrizeList,
  isMobile,
} = usePrizeList(temporaryPrizeRef)
const { t } = useI18n()

const selectedPrize = ref<IPrizeConfig | null>()
</script>

<template>
  <div class="flex items-center max-h-2/3 overflow-hidden">
    <TemporaryDialog
      ref="temporaryPrizeRef"
      v-model:temporary-prize="temporaryPrize"
      :change-person-count="changePersonCount"
      :select-prize="selectPrize"
      :local-image-list="localImageList"
      :add-temporary-prize="addTemporaryPrize"
      :submit-temporary-prize="submitTemporaryPrize"
    />
    <EditSeparateDialog
      :total-number="selectedPrize?.count" :separated-number="selectedPrize?.separateCount.countList"
      @submit-data="submitData"
    />
    <div class="h-full">
      <TemporaryList
        v-if="temporaryPrize.isShow"
        :temporary-prize="temporaryPrize"
        :add-temporary-prize="addTemporaryPrize"
        :delete-temporary-prize="deleteTemporaryPrize"
      />
      <OfficialPrizeList
        v-model:prize-show="prizeShow"
        :local-prize-list="localPrizeList"
        :current-prize="currentPrize"
        :temporary-prize="temporaryPrize"
        :is-mobile="isMobile"
        :add-temporary-prize="addTemporaryPrize"
        :select-prize="selectPrize"
      />
    </div>

    <transition name="prize-operate" :appear="true">
      <div v-show="!prizeShow" class="tooltip tooltip-right" :data-tip="t('tooltip.prizeList')">
        <div
          class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
          @click="prizeShow = !prizeShow"
        >
          <svg-icon name="arrow_right" class="w-full h-full" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang='scss' scoped>
@use "./index.scss";
</style>
