<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'

import ImageSync from '@/components/ImageSync/index.vue'
import defaultPrizeImage from '@/assets/images/龙.png'

const prizeConfig = useStore().prizeConfig
const globalConfig = useStore().globalConfig
const system= useStore().system
const { getPrizeConfig: localPrizeList, getCurrentPrize: currentPrize } = storeToRefs(prizeConfig)
const {getIsShowPrizeList:isShowPrizeList}= storeToRefs(globalConfig)
const {getIsMobile:isMobile} = storeToRefs(system)
const prizeListRef = ref()
const prizeListContainerRef = ref()
// 获取prizeListRef高度
const getPrizeListHeight = () => {
    let height=200;
    if(prizeListRef.value){
     height = (prizeListRef.value as HTMLElement).offsetHeight}

    return height
}
const prizeShow = ref(structuredClone(isShowPrizeList.value))

const addTemporaryPrize = () => {
    console.log('addTemporaryPrize')
}
onMounted(() => {
    prizeListContainerRef.value.style.height = getPrizeListHeight() + 'px'
})
</script>

<template>
    <div class="flex items-center">
        <div ref="prizeListContainerRef">
            <transition name="prize-list" :appear="true">
                <div v-if="prizeShow&&!isMobile" class="flex items-center">
                    <ul class="flex flex-col gap-1 p-2 rounded-xl bg-slate-500/50" ref="prizeListRef">
                        <li v-for="item in localPrizeList" :key="item.id"
                            :class="currentPrize.id == item.id ? 'current-prize' : ''">
                            <div
                                class="relative flex flex-row items-center justify-between w-64 h-20 shadow-xl card bg-base-100" v-if="item.isShow">
                                <div v-if="item.isUsed" class="absolute z-50 w-full h-full bg-gray-800/70 item-mask rounded-xl"></div>
                                <figure class="w-10 h-10 rounded-xl">
                                    <ImageSync v-if="item.picture.url" :imgItem="item.picture"></ImageSync>
                                    <img v-else :src="defaultPrizeImage" alt="Prize" class="object-cover h-full rounded-xl" />
                                </figure>
                                <div class="items-center p-0 text-center card-body">
                                    <h2 class="p-0 m-0 card-title">{{ item.name }}</h2>
                                    <p class="absolute z-40 p-0 m-0 text-gray-300/80 pt-9">{{ item.isUsedCount }}/{{ item.count }}</p>
                                    <progress class="w-3/4 h-6 progress progress-primary" :value="item.isUsedCount" :max="item.count"></progress>
                                    <!-- <p class="p-0 m-0">{{ item.isUsedCount }}/{{ item.count }}</p> -->
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="flex flex-col gap-3">
                        <div class="tooltip tooltip-right" data-tip="奖项列表">
                            <div class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
                                @click="prizeShow = !prizeShow">
                                <svg-icon name="arrow_left" class="w-full h-full"></svg-icon>
                            </div>
                        </div>
                        <div class="tooltip tooltip-right" data-tip="添加抽奖">
                            <div class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
                                @click="addTemporaryPrize">
                                <svg-icon name="add" class="w-full h-full"></svg-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <transition name="prize-operate" :appear="true">
            <div class="tooltip tooltip-right" data-tip="奖项列表" v-show="!prizeShow">
                <div class="flex items-center w-6 h-8 rounded-r-lg cursor-pointer prize-option bg-slate-500/50"
                    @click="prizeShow = !prizeShow">
                    <svg-icon name="arrow_right" class="w-full h-full"></svg-icon>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang='scss' scoped>
.prize-list-enter-active {
    -webkit-animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.prize-list-leave-active {
    -webkit-animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.prize-operate-enter-active {
    // 延时显示
    animation: show-operate 0.6s;
    -webkit-animation: show-operate 0.6s;
}

// .prize-operate-leave-active {
//     -webkit-animation-delay: 0.5s;
//     -webkit-animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
//     animation-delay: 0.5s;
//     animation: slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
// }
.current-prize {
    position: relative;
    display: block;
    overflow: hidden;
    isolation: isolate;

    border-radius: 20px;
    padding: 3px;
}

.current-prize::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 400%;
    height: 100%;
    background: linear-gradient(115deg, #4fcf70, #fad648, #a767e5, #12bcfe, #44ce7b);
    background-size: 25% 100%;
    animation: an-at-keyframe-css-at-rule-that-translates-via-the-transform-property-the-background-by-negative-25-percent-of-its-width-so-that-it-gives-a-nice-border-animation_-We-use-the-translate-property-to-have-a-nice-transition-so-it_s-not-a-jerk-of-a-start-or-stop .75s linear infinite;
    // animation-play-state: paused;
    translate: -5% 0%;
    transition: translate 0.25s ease-out;

    animation-play-state: running;
    transition-duration: 0.75s;
    translate: 0% 0%;
}


.current-prize::after {
    content: "";
    position: absolute;
    inset: 4px;
    border-top-left-radius: 20px;
    border-bottom-right-radius: 20px;
    z-index: -1;
}

@keyframes an-at-keyframe-css-at-rule-that-translates-via-the-transform-property-the-background-by-negative-25-percent-of-its-width-so-that-it-gives-a-nice-border-animation_-We-use-the-translate-property-to-have-a-nice-transition-so-it_s-not-a-jerk-of-a-start-or-stop {
    to {
        transform: translateX(-25%);
    }
}

@-webkit-keyframes slide-right {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }

    100% {
        -webkit-transform: translateX(30px);
        transform: translateX(30px);
    }
}

@keyframes slide-right {
    0% {
        -webkit-transform: translateX(-200px);
        transform: translateX(-200px);
    }

    100% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
}

@-webkit-keyframes slide-left {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }

    100% {
        -webkit-transform: translateX(-100px);
        transform: translateX(-100px);
    }
}

@keyframes slide-left {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }

    100% {
        -webkit-transform: translateX(-400px);
        transform: translateX(-400px);
    }
}

@-webkit-keyframes show-operate {
    0% {
        opacity: 0;
    }

    99% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes show-operate {
    0% {
        opacity: 0;
    }

    99% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}</style>
