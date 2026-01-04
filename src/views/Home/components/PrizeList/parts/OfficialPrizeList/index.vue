<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import { ref, watch } from 'vue'
import defaultPrizeImage from '@/assets/images/龙.png'
import { useGsap } from './useGsap'

const props = defineProps<{
    isMobile: boolean
    localPrizeList: IPrizeConfig[]
    currentPrize: IPrizeConfig
    temporaryPrizeShow: boolean
    addTemporaryPrize: () => void
}>()

const prizeShow = defineModel<boolean>('prizeShow')
const scrollContainerRef = ref<any>(null)
const ulContainerRef = ref<any>(null)
const isScroll = ref(false)
const liRefs = ref([])

const {
    showUpButton,
    showDownButton,
    handleScroll,
} = useGsap(scrollContainerRef, liRefs, isScroll, prizeShow, props.temporaryPrizeShow)

// 获取ulContainerRef的高度
function getUlContainerHeight() {
    if (ulContainerRef.value) {
        return ulContainerRef.value.offsetHeight
    }
    return 0
}
// 获取scrollContainerRef的高度
function getScrollContainerHeight() {
    if (scrollContainerRef.value) {
        return scrollContainerRef.value.offsetHeight
    }
    return 0
}

function getIsScroll() {
    const ulHeight = getUlContainerHeight()
    const scrollHeight = getScrollContainerHeight()
    if (ulHeight > scrollHeight + 20) {
        isScroll.value = true
    }
    else {
        isScroll.value = false
        scrollContainerRef.value.style.height = `${ulHeight}px`
    }
}

watch ([prizeShow, () => props.temporaryPrizeShow], (val) => {
    if (!val[0]) {
        return
    }
    setTimeout (() => {
        getIsScroll()
    }, 0)
}, { immediate: true })
</script>

<template>
  <transition name="prize-list" class="h-full" :appear="true">
    <div v-show="prizeShow && !isMobile && !temporaryPrizeShow" class="flex items-center h-full relative ">
      <div v-if="isScroll" class="w-full h-16 flex justify-center scroll-button scroll-button-up absolute top-0 z-50">
        <SvgIcon v-show="showUpButton" name="chevron-up" size="64px" class="text-gray-200/80 cursor-pointer" @click="handleScroll(-150)" />
      </div>
      <div ref="scrollContainerRef" :class="isScroll ? (showDownButton ? 'scroll-container' : 'scroll-container-end') : 'no-scroll bg-slate-500/50'" class="h-full no-before overflow-y-auto overflow-x-hidden  scroll-smooth hide-scrollbar before:bg-slate-500/50 z-20 rounded-xl">
        <ul ref="ulContainerRef" class="flex flex-col gap-1 p-2">
          <li
            v-for="item in localPrizeList"
            ref="liRefs" :key="item.id"
            :class="currentPrize.id === item.id ? 'current-prize' : ''"
          >
            <div
              v-if="item.isShow"
              class="relative flex flex-row items-center justify-between w-64 h-20 px-3 gap-6 shadow-xl card bg-base-100"
            >
              <div
                v-if="item.isUsed"
                class="absolute z-50 w-full left-0 h-full bg-gray-800/70 item-mask rounded-xl"
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
        <div v-if="isScroll" class="h-24" />
      </div>
      <div v-if="isScroll" class="w-full h-16 flex justify-center scroll-button scroll-button-down absolute bottom-0 z-50">
        <SvgIcon v-show="showDownButton" name="chevron-down" size="64px" class="text-gray-200/80 cursor-pointer" @click="handleScroll(150)" />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@use "./index.scss";
</style>
