<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { useI18n } from 'vue-i18n'
import defaultPrizeImage from '@/assets/images/龙.png'

defineProps<{
  prizeShow: boolean
  isMobile: boolean
  localPrizeList: IPrizeConfig[]
  currentPrize: IPrizeConfig
  temporaryPrize: IPrizeConfig
  addTemporaryPrize: () => void
}>()

const { t } = useI18n()
const prizeShow = defineModel<boolean>('prizeShow')
</script>

<template>
  <transition name="prize-list" :appear="true">
    <div v-if="prizeShow && !isMobile && !temporaryPrize.isShow" class="flex items-center h-full">
      <ul class="flex flex-col gap-1 p-2 rounded-xl bg-slate-500/50 h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
        <li
          v-for="item in localPrizeList" :key="item.id"
          :class="currentPrize.id === item.id ? 'current-prize' : ''"
        >
          <div
            v-if="item.isShow"
            class="relative flex flex-row items-center justify-between w-64 h-20 px-3 gap-6 shadow-xl card bg-base-100"
          >
            <div
              v-if="item.isUsed"
              class="absolute z-50 w-full h-full bg-gray-800/70 item-mask rounded-xl"
            />
            <figure class="w-10 h-10 rounded-xl">
              <ImageSync v-if="item.picture.url" :img-item="item.picture" />
              <img
                v-else :src="defaultPrizeImage" alt="Prize"
                class="object-cover h-full rounded-xl"
              >
            </figure>
            <div class="items-center p-0 card-body">
              <div class="tooltip tooltip-left w-full pl-1" :data-tip="item.name">
                <h2
                  class="w-24 p-0 m-0 overflow-hidden card-title whitespace-nowrap text-ellipsis"
                >
                  {{ item.name }}
                </h2>
              </div>
              <p class="absolute z-40 p-0 m-0 text-gray-300/80 mt-9">
                {{ item.isUsedCount }}/{{
                  item.count }}
              </p>
              <progress
                class="w-full h-6 progress bg-[#52545b] progress-primary" :value="item.isUsedCount"
                :max="item.count"
              />
            </div>
          </div>
        </li>
      </ul>
      <div class="flex flex-col gap-3">
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
    </div>
  </transition>
</template>

<style scoped>

</style>
