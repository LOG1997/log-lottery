<script setup lang='ts'>
import { ref, onMounted, watch } from 'vue'
import useStore from '@/store'
import { IPrizeConfig } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import localforage from 'localforage'

const imageDbStore = localforage.createInstance({
    name: 'imgStore'
})
const prizeConfig = useStore().prizeConfig
const globalConfig = useStore().globalConfig
const { getPrizeConfig: localPrizeList, getCurrentPrize: currentPrize } = storeToRefs(prizeConfig)

const { getImageList: localImageList } = storeToRefs(globalConfig)
const prizeList = ref(localPrizeList)
const imgList = ref<any[]>([])
const addPrize = () => {
    const defaultPrizeCOnfig: IPrizeConfig = {
        id: new Date().getTime().toString(),
        name: '奖项',
        sort: 0,
        isAll: true,
        count: 1,
        isUsedCount:0,
        picture: {
            id: '',
            name: '',
            url: ''
        },
        desc: '',
        isUsed: false,
        isShow: true,
        frequency: 1,
    }
    prizeConfig.addPrizeConfig(defaultPrizeCOnfig)
}
const resetDefault = () => {
    prizeConfig.resetDefault()
}

const getImageDbStore = async () => {
    const keys = await imageDbStore.keys()
    if (keys.length > 0) {
        imageDbStore.iterate((value, key) => {
            imgList.value.push({
                key,
                value
            })
        })
    }
}

const sort = (item: IPrizeConfig, isUp: number) => {
    const itemIndex = prizeList.value.indexOf(item)
    if (isUp == 1) {
        prizeList.value.splice(itemIndex, 1)
        prizeList.value.splice(itemIndex - 1, 0, item)
    } else {
        prizeList.value.splice(itemIndex, 1)
        prizeList.value.splice(itemIndex + 1, 0, item)
    }
}
const delItem = (item: IPrizeConfig) => {
    prizeConfig.deletePrizeConfig(item.id)
}
const delAll = async () => {
    await prizeConfig.deleteAllPrizeConfig()
}
onMounted(() => {
    getImageDbStore()
})
watch(() => prizeList.value, (val:IPrizeConfig[]) => {
    prizeConfig.setPrizeConfig(val)
}, { deep: true })
</script>

<template>
    <div>
        <h2>奖项配置</h2>
        <div class="flex w-full gap-3">
            <button class="btn btn-info btn-sm" @click="addPrize">添加</button>
            <button class="btn btn-info btn-sm" @click="resetDefault">默认列表</button>
            <button class="btn btn-error btn-sm" @click="delAll">全部删除</button>

        </div>
        <ul>
            <li v-for="item in prizeList" :key="item.id" class="flex gap-10"
                :class="currentPrize.id == item.id ? 'border-1 border-solid rounded-xl' : null">
                <label class="max-w-xs mb-10 form-control">
                    <!-- 向上向下 -->
                    <div class="flex flex-col items-center gap-2 pt-5">
                        <svg-icon class="cursor-pointer hover:text-blue-400"
                            :class="prizeList.indexOf(item) == 0 ? 'opacity-0 cursor-default' : ''" name="up"
                            @click="sort(item, 1)"></svg-icon>
                        <svg-icon class="cursor-pointer hover:text-blue-400" name="down" @click="sort(item, 0)"
                            :class="prizeList.indexOf(item) == prizeList.length - 1 ? 'opacity-0 cursor-default' : ''"></svg-icon>
                    </div>
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">名称</span>
                    </div>
                    <input type="text" v-model="item.name" placeholder="名称"
                        class="w-full max-w-xs input-sm input input-bordered" />
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">是否全员参加</span>
                    </div>
                    <input type="checkbox" :checked="item.isAll" @change="item.isAll = !item.isAll"
                        class="mt-2 border-solid checkbox checkbox-secondary border-1" />
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">获奖人数</span>
                    </div>
                    <input type="number" v-model="item.count" placeholder="获奖人数"
                        class="w-full max-w-xs input-sm input input-bordered" />
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">已获奖人数</span>
                    </div>
                    <input disabled type="number" v-model="item.isUsedCount" placeholder="获奖人数" class="w-full max-w-xs input-sm input input-bordered" />
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">已抽取</span>
                    </div>
                    <input type="checkbox" :checked="item.isUsed"  @change="item.isUsed?(()=>{item.isUsed=false;item.isUsedCount=0})():(()=>{item.isUsed=true;item.isUsedCount=item.count})()"
                        class="mt-2 border-solid checkbox checkbox-secondary border-1" />
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">图片</span>
                    </div>
                    <select class="w-full max-w-xs select select-warning select-sm" v-model="item.picture">
                      
                        
                        <option v-if="item.picture.id" :value="{id:'',name:'',url:''}"><span>❌</span></option>
                        <option disabled selected>选择一张图片</option>
                        <option v-for="picItem in localImageList" :key="picItem.id" :value="picItem">{{ picItem.name }}
                        </option>
                    </select>
                </label>
                <!-- <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">展示在主界面</span>
                    </div>
                    <input type="checkbox" :checked="item.isShow" @change="item.isShow = !item.isShow"
                        class="mt-2 border-solid checkbox checkbox-secondary border-1" />
                </label> -->
                <!-- <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">抽取次数</span>
                    </div>
                    <input type="text" v-model="item.frequency" placeholder="抽取次数"
                        class="w-full max-w-xs input-sm input input-bordered" />
                </label> -->
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">操作</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-error btn-sm" @click="delItem(item)">删除</button>
                    </div>
                </label>
            </li>
        </ul>
</div></template>

<style lang='scss' scoped></style>
