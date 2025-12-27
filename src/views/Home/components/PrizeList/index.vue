<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import EditSeparateDialog from '@/components/NumberSeparate/EditSeparateDialog.vue'
import OfficialPrizeList from './parts/OfficialPrizeList/index.vue'
import OperationButton from './parts/OperationButton.vue'
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
const selectedPrize = ref<IPrizeConfig | null>()
</script>

<template>
  <div v-if="localPrizeList.length" class="flex h-2/3 items-center overflow-hidden">
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
        v-show="!temporaryPrize.isShow"
        v-model:prize-show="prizeShow"
        :temporary-prize-show="temporaryPrize.isShow"
        :local-prize-list="localPrizeList"
        :current-prize="currentPrize"
        :is-mobile="isMobile"
        :add-temporary-prize="addTemporaryPrize"
      />
    </div>
    <OperationButton v-if="!temporaryPrize.isShow" v-model:prize-show="prizeShow" :add-temporary-prize="addTemporaryPrize" />
  </div>
</template>

<style lang='scss' scoped>
@use "./index.scss";
</style>
