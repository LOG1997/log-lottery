<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { useI18n } from 'vue-i18n'

import defaultPrizeImage from '@/assets/images/龙.png'

defineProps<{
    temporaryPrize: IPrizeConfig
    addTemporaryPrize: () => void
    deleteTemporaryPrize: () => void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="h-20 w-72" :class="temporaryPrize.isShow ? 'current-prize' : ''">
    <div class="relative flex flex-row items-center justify-between w-full h-full shadow-xl card bg-base-100">
      <div
        v-if="temporaryPrize.isUsed"
        class="absolute z-50 w-full h-full bg-gray-800/70 item-mask rounded-xl"
      />
      <figure class="w-10 h-10 rounded-xl">
        <ImageSync v-if="temporaryPrize.picture.url" :img-item="temporaryPrize.picture" />
        <img v-else :src="defaultPrizeImage" alt="Prize" class="object-cover h-full rounded-xl">
      </figure>
      <div class="items-center p-0 text-center card-body">
        <div class="tooltip tooltip-left" :data-tip="temporaryPrize.name">
          <h2 class="p-0 m-0 overflow-hidden w-28 card-title whitespace-nowrap text-ellipsis">
            {{ temporaryPrize.name }}
          </h2>
        </div>
        <p class="absolute z-40 p-0 m-0 text-gray-300/80 mt-9">
          {{ temporaryPrize.isUsedCount }}/{{ temporaryPrize.count }}
        </p>
        <progress
          class="w-3/4 h-6 progress bg-[#52545b] progress-primary" :value="temporaryPrize.isUsedCount"
          :max="temporaryPrize.count"
        />
      </div>
      <div class="flex flex-col gap-1 mr-2">
        <div class="tooltip tooltip-left" :data-tip="t('tooltip.edit')">
          <div class="cursor-pointer hover:text-blue-400" @click="addTemporaryPrize">
            <svg-icon name="edit" />
          </div>
        </div>
        <div class="tooltip tooltip-left" :data-tip="t('tooltip.delete')">
          <div class="cursor-pointer hover:text-blue-400" @click="deleteTemporaryPrize">
            <svg-icon name="delete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
