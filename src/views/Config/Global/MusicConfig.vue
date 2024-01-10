<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import {storeToRefs } from 'pinia'
import { IMusic } from '@/types/storeType';
import { readFileData } from '@/utils/file'
import useStore from '@/store';

import localforage from 'localforage'

const audioUploadToast = ref(0) //0是不显示，1是成功，2是失败,3是不是图片
const audioDbStore = localforage.createInstance({
    name: 'audioStore'
})
const globalConfig = useStore().globalConfig

const { getMusicList: localMusicList } = storeToRefs(globalConfig);
const limitType = ref('audio/*')
const localMusicListValue = ref(localMusicList)
const play = async (item: IMusic) => {
    globalConfig.setCurrentMusic(item,false)
}

const deleteMusic = (item: IMusic) => {
    globalConfig.removeMusic(item.id)
    audioDbStore.removeItem(item.name)
    // setTimeout(()=>{
    //     localMusicListValue.value=localMusicList
    // },100)
}
const resetMusic = () => {
    globalConfig.resetMusicList()
    audioDbStore.clear()
}
const deleteAll = () => {
    globalConfig.clearMusicList()
    audioDbStore.clear()
}
const getMusicDbStore = async () => {
    const keys = await audioDbStore.keys()
    if (keys.length > 0) {
        audioDbStore.iterate((value: string, key: string) => {
            globalConfig.addMusic({
                id: key + new Date().getTime().toString(),
                name: key,
                url: 'Storage',
            })
        })
    }
}
const handleFileChange = async (e: Event) => {
    const isAudio = /audio*/.test(((e.target as HTMLInputElement).files as FileList)[0].type)
    if (!isAudio) {
        audioUploadToast.value = 3

        return
    }
    let { dataUrl, fileName } = await readFileData(((e.target as HTMLInputElement).files as FileList)[0])
    audioDbStore.setItem(new Date().getTime().toString() + '+' + fileName, dataUrl)
        .then(() => {
            audioUploadToast.value = 1
            getMusicDbStore()
        })
        .catch(() => {
            audioUploadToast.value = 2
        })
}


onMounted(() => {
    getMusicDbStore()
})
</script>

<template>
    <div>
        <div class="flex gap-3">
            <button class="btn btn-primary btn-sm" @click="resetMusic">重置音乐列表</button>
            <label for="explore">
                <input type="file" class="" id="explore" style="display: none" @change="handleFileChange"
                    :accept="limitType" />
                <span class="btn btn-primary btn-sm">上传音乐</span>
            </label>
            <button class="btn btn-error btn-sm" @click="deleteAll">删除所有</button>
        </div>
        <div>
            <ul class="p-0">
                <li v-for="item in localMusicListValue" :key="item.id" class="flex items-center gap-6 pb-2 mb-3 divide-y">
                    <div class="mr-12 overflow-hidden w-72 whitespace-nowrap text-ellipsis">
                        <span>
                            {{ item.name }}</span>
                    </div>
                    <div class="flex gap-3">
                        <button class="btn btn-primary btn-xs" @click="play(item)">播放</button>
                        <button class="btn btn-error btn-xs" @click="deleteMusic(item)">删除</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
