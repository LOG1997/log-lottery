<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import defaultPrizeImage from '@/assets/images/龙.png'

const props = defineProps<{
    temporaryPrize: IPrizeConfig
    addTemporaryPrize: () => void
    deleteTemporaryPrize: () => void
}>()

const { t } = useI18n()

// 超过 6 个字符就滚动
const shouldScroll = computed(() => {
    const name = props.temporaryPrize?.name || ''
    return name.length > 6
})
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
        <div class="w-28 overflow-hidden" :data-tip="temporaryPrize.name">
          <h2
            class="p-0 m-0 card-title whitespace-nowrap"
            :class="shouldScroll ? 'scroll-text' : 'text-ellipsis overflow-hidden'"
          >
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
.scroll-text {
    display: inline-block;
    animation: scroll-left 3s ease-in-out infinite alternate;
    will-change: transform;
}

@keyframes scroll-left {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(calc(-100% + 7rem));
    }
}
</style>
