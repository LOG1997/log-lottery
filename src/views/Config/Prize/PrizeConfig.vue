<script setup lang='ts'>
import { ref, onMounted,watch } from 'vue'
import useStore from '@/store'

import localforage from 'localforage'
import { IPrizeConfig } from '@/types/prizeConfig';

const imageDbStore = localforage.createInstance({
    name: 'imgStore'
})
const prizeConfig = useStore().prizeConfig
const { getPrizeConfig } = prizeConfig
const prizeList = ref(getPrizeConfig)
const imgList = ref<any[]>([])
const addPrize = () => {
    const defaultPrizeCOnfig: IPrizeConfig = {
        id: new Date().getTime().toString(),
        name: '奖项',
        sort: 0,
        isAll: false,
        count: 1,
        picture: [''],
        desc: '',
        isShow: true
    }
    prizeConfig.addPrizeConfig(defaultPrizeCOnfig)
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

const sort = (item:any,isUp:number) => {
    const itemIndex=prizeList.value.indexOf(item)
    if(isUp==1){
        prizeList.value.splice(itemIndex,1)
        prizeList.value.splice(itemIndex-1,0,item)
    }else{
        prizeList.value.splice(itemIndex,1)
        prizeList.value.splice(itemIndex+1,0,item)
    }
}
onMounted(() => {
    getImageDbStore()
})
watch(()=>prizeList,()=>{
    prizeConfig.setPrizeConfig(prizeList.value)
},{deep:true})
</script>

<template>
    <div>
        <h2>奖项配置</h2>
        <ul>
            <li v-for="item in prizeList" :key="item.id" class="flex gap-10">
                <label class="w-full max-w-xs mb-10 form-control">
                    <!-- 向上向下 -->
                    <div class="flex flex-col items-center gap-2 pt-5">
                        <svg-icon class="cursor-pointer hover:text-blue-400" :class="prizeList.indexOf(item)==0?'opacity-0 cursor-default':''" name="up" @click="sort(item,1)"></svg-icon>
                        <svg-icon class="cursor-pointer hover:text-blue-400" name="down" @click="sort(item,0)" :class="prizeList.indexOf(item)==prizeList.length-1?'opacity-0 cursor-default':''"></svg-icon>
                    </div>
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">名称</span>
                    </div>
                    <input type="text" v-model="item.name" placeholder="名称" class="w-full max-w-xs input-sm input input-bordered" />
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">是否全员参加</span>
                    </div>
                    <input type="checkbox" :checked="item.isAll" @change="item.isAll =!item.isAll"
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
                        <span class="label-text">图片</span>
                    </div>
                    <select class="w-full max-w-xs select select-warning select-sm" v-model="item.picture">
                        <option disabled selected>选择一张图片</option>
                        <option v-for="picItem in imgList" :key="picItem.key">{{ picItem.key.split('+')[1] }}</option>
                    </select>
                </label>
                <label class="w-full max-w-xs mb-10 form-control">
                    <div class="label">
                        <span class="label-text">是否显示</span>
                    </div>
                    <input type="checkbox" :checked="item.isShow" @change="item.isShow =!item.isShow"
                        class="mt-2 border-solid checkbox checkbox-secondary border-1" />
                </label>
            </li>
        </ul>
        <button class="btn btn-info" @click="addPrize">添加</button>
    </div>
</template>

<style lang='scss' scoped></style>
