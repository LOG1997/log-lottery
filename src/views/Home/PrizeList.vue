<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useStore from '@/store'

import ImageSync from '@/components/ImageSync/index.vue'
import defaultPrizeImage from '@/assets/images/龙.png'
import { IPrizeConfig } from '../../types/storeType';

import EditSeparateDialog from '@/components/NumberSeparate/EditSeparateDialog.vue'

const prizeConfig = useStore().prizeConfig
const globalConfig = useStore().globalConfig
const system = useStore().system
const { getPrizeConfig: localPrizeList, getCurrentPrize: currentPrize, getTemporaryPrize: temporaryPrize } = storeToRefs(prizeConfig)
const { getIsShowPrizeList: isShowPrizeList, getImageList: localImageList } = storeToRefs(globalConfig)
const { getIsMobile: isMobile } = storeToRefs(system)
const prizeListRef = ref()
const prizeListContainerRef = ref()

const temporaryPrizeRef = ref()
const selectedPrize = ref<IPrizeConfig | null>()
// 获取prizeListRef高度
const getPrizeListHeight = () => {
    let height = 200;
    if (prizeListRef.value) {
        height = (prizeListRef.value as HTMLElement).offsetHeight
    }

    return height
}
const prizeShow = ref(structuredClone(isShowPrizeList.value))

const addTemporaryPrize = () => {
    temporaryPrizeRef.value.showModal()
}

const deleteTemporaryPrize = () => {
    temporaryPrize.value.isShow = false
    prizeConfig.setTemporaryPrize(temporaryPrize.value)
}
const submitTemporaryPrize = () => {
    if (!temporaryPrize.value.name || !temporaryPrize.value.count) {
        alert('请填写完整信息')

        return
    }
    temporaryPrize.value.isShow = true
    temporaryPrize.value.id=new Date().getTime().toString()
    prizeConfig.setCurrentPrize(temporaryPrize.value)
}
const selectPrize = (item: IPrizeConfig) => {
    selectedPrize.value = item
    selectedPrize.value.isUsedCount = 0
    selectedPrize.value.isUsed = false

    if (selectedPrize.value.separateCount.countList.length > 1) {
        return
    }
    selectedPrize.value.separateCount = {
        enable: true,
        countList: [
            {
                id: '0',
                count: item.count,
                isUsedCount: 0,
            }
        ]
    }
}
const submitData = (value: any) => {
    selectedPrize.value!.separateCount.countList = value;
    selectedPrize.value = null
}
const changePersonCount=()=>{
    temporaryPrize.value.separateCount.countList=[]
}
const setCurrentPrize=()=>{
for(let i=0;i<localPrizeList.value.length;i++){
    if(localPrizeList.value[i].isUsedCount<localPrizeList.value[i].count){
        prizeConfig.setCurrentPrize(localPrizeList.value[i])
        
return
    }
}
}
onMounted(() => {
    prizeListContainerRef.value.style.height = getPrizeListHeight() + 'px'
    setCurrentPrize()
})
</script>

<template>
    <div class="flex items-center">
        <dialog id="my_modal_1" ref="temporaryPrizeRef" class="border-none modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">增加临时抽奖</h3>
                <div class="flex flex-col gap-3">
                    <label class="flex w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">名称:</span>
                        </div>
                        <input type="text" v-model="temporaryPrize.name" placeholder="名称"
                            class="max-w-xs input-sm input input-bordered" />
                    </label>
                    <label class="flex w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">是否全员参加</span>
                        </div>
                        <input type="checkbox" :checked="temporaryPrize.isAll"
                            @change="temporaryPrize.isAll = !temporaryPrize.isAll"
                            class="mt-2 border-solid checkbox checkbox-secondary border-1" />
                    </label>
                    <label class="flex w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">获奖人数</span>
                        </div>
                        <input type="number" v-model="temporaryPrize.count" @change="changePersonCount" placeholder="获奖人数"
                            class="max-w-xs input-sm input input-bordered" />
                    </label>
                    <label class="flex w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">已获奖人数</span>
                        </div>
                        <input disabled type="number" v-model="temporaryPrize.isUsedCount" placeholder="获奖人数"
                            class="max-w-xs input-sm input input-bordered" />
                    </label>
                    <label class="flex w-full max-w-xs" v-if="temporaryPrize.separateCount">
                    <div class="label">
                        <span class="label-text">单次抽取个数</span>
                    </div>
                    <div class="flex justify-start h-full" @click="selectPrize(temporaryPrize)">
                        <ul class="flex flex-wrap w-full h-full gap-1 p-0 pt-1 m-0 cursor-pointer"
                            v-if="temporaryPrize.separateCount.countList.length">
                            <li class="relative flex items-center justify-center w-8 h-8 bg-slate-600/60 separated"
                                v-for="se in temporaryPrize.separateCount.countList" :key="se.id">
                                <div class="flex items-center justify-center w-full h-full tooltip"
                                    :data-tip="'已抽取:' + se.isUsedCount + '/' + se.count">
                                    <div class="absolute left-0 z-50 h-full bg-blue-300/80"
                                        :style="`width:${se.isUsedCount * 100 / se.count}%`"></div>
                                    <span>{{ se.count }}</span>
                                </div>
                            </li>
                        </ul>
                        <button v-else class="btn btn-secondary btn-xs">设置</button>
                    </div>
                </label>
                    <label class="flex w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">图片</span>
                        </div>
                        <select class="flex-1 w-12 select select-warning select-sm" v-model="temporaryPrize.picture">
                            <option v-if="temporaryPrize.picture.id" :value="{ id: '', name: '', url: '' }"><span>❌</span>
                            </option>
                            <option disabled selected>选择一张图片</option>
                            <option class="w-auto" v-for="picItem in localImageList" :key="picItem.id" :value="picItem">{{
                                picItem.name }}
                            </option>
                        </select>
                    </label>
                </div>
                <div class="modal-action">
                    <form method="dialog" class="flex gap-3">
                        <button class="btn btn-sm" @click="submitTemporaryPrize">确定</button>
                        <button class="btn btn-sm">取消</button>
                    </form>
                </div>
            </div>
        </dialog>
        <EditSeparateDialog :totalNumber="selectedPrize?.count" :separated-number="selectedPrize?.separateCount.countList"
            @submitData="submitData" />
        <div ref="prizeListContainerRef">
            <div class="h-20 w-72" :class="temporaryPrize.isShow ? 'current-prize' : ''" v-if="temporaryPrize.isShow">
                <div class="relative flex flex-row items-center justify-between w-full h-full shadow-xl card bg-base-100">
                    <div v-if="temporaryPrize.isUsed"
                        class="absolute z-50 w-full h-full bg-gray-800/70 item-mask rounded-xl"></div>
                    <figure class="w-10 h-10 rounded-xl">
                        <ImageSync v-if="temporaryPrize.picture.url" :imgItem="temporaryPrize.picture"></ImageSync>
                        <img v-else :src="defaultPrizeImage" alt="Prize" class="object-cover h-full rounded-xl" />
                    </figure>
                    <div class="items-center p-0 text-center card-body">
                        <div class="tooltip tooltip-left" :data-tip="temporaryPrize.name">
                            <h2 class="p-0 m-0 overflow-hidden w-28 card-title whitespace-nowrap text-ellipsis">{{
                                temporaryPrize.name }}</h2>
                        </div>
                        <p class="absolute z-40 p-0 m-0 text-gray-300/80 mt-9">{{ temporaryPrize.isUsedCount }}/{{
                            temporaryPrize.count }}</p>
                        <progress class="w-3/4 h-6 progress progress-primary" :value="temporaryPrize.isUsedCount"
                            :max="temporaryPrize.count"></progress>
                        <!-- <p class="p-0 m-0">{{ item.isUsedCount }}/{{ item.count }}</p> -->
                    </div>
                    <div class="flex flex-col gap-1 mr-2">
                        <div class="tooltip tooltip-left" data-tip="编辑">
                            <div class="cursor-pointer hover:text-blue-400" @click="addTemporaryPrize">
                                <svg-icon name="edit"></svg-icon>
                            </div>
                        </div>
                        <div class="tooltip tooltip-left" data-tip="删除">
                            <div class="cursor-pointer hover:text-blue-400" @click="deleteTemporaryPrize">
                                <svg-icon name="delete"></svg-icon>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <transition name="prize-list" :appear="true">
                <div v-if="prizeShow && !isMobile && !temporaryPrize.isShow" class="flex items-center">
                    <ul class="flex flex-col gap-1 p-2 rounded-xl bg-slate-500/50" ref="prizeListRef">
                        <li v-for="item in localPrizeList" :key="item.id"
                            :class="currentPrize.id == item.id ? 'current-prize' : ''">
                            <div class="relative flex flex-row items-center justify-between w-64 h-20 shadow-xl card bg-base-100"
                                v-if="item.isShow">
                                <div v-if="item.isUsed"
                                    class="absolute z-50 w-full h-full bg-gray-800/70 item-mask rounded-xl"></div>
                                <figure class="w-10 h-10 rounded-xl">
                                    <ImageSync v-if="item.picture.url" :imgItem="item.picture"></ImageSync>
                                    <img v-else :src="defaultPrizeImage" alt="Prize"
                                        class="object-cover h-full rounded-xl" />
                                </figure>
                                <div class="items-center p-0 text-center card-body">
                                    <div class="tooltip tooltip-left" :data-tip="item.name">
                                        <h2
                                            class="w-24 p-0 m-0 overflow-hidden text-center card-title whitespace-nowrap text-ellipsis">
                                            {{ item.name }}</h2>
                                    </div>
                                    <p class="absolute z-40 p-0 m-0 text-gray-300/80 mt-9">{{ item.isUsedCount }}/{{
                                        item.count }}</p>
                                    <progress class="w-3/4 h-6 progress progress-primary" :value="item.isUsedCount"
                                        :max="item.count"></progress>
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
.label {
    width: 120px;
}

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
