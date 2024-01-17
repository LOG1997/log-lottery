<script setup lang='ts'>
import { ref, onMounted, onUnmounted,watch } from 'vue'
import useStore from '@/store';
import { storeToRefs } from 'pinia';
import localforage from 'localforage'
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const audioDbStore = localforage.createInstance({
    name: 'audioStore'
})
const audio=ref(new Audio())
const settingRef = ref()
// const audio = ref(new Audio())
const globalConfig = useStore().globalConfig
const { getMusicList: localMusicList,getCurrentMusic:currentMusic } = storeToRefs(globalConfig);
// const localMusicListValue = ref(localMusicList)

const play = async (item: any) => {
    if(!item){
        return
    }
    // if (!audio.value.paused && !skip) {
    //     audio.value.pause()

    //     return
    // }
    let audioUrl = ''
    if (!item.url) {
        return
    }
    if (item.url == 'Storage') {
        audioUrl = await audioDbStore.getItem(item.name) as string
    }
    else {
        audioUrl = item.url
    }
    audio.value.pause()
    audio.value.src = audioUrl
    audio.value.play()
}
const playMusic=(item:any,skip = false)=>{
    if(!item){
        return
    }
    if(!currentMusic.value.paused&&!skip){
        globalConfig.setCurrentMusic(item,true)
        
return
    }
    globalConfig.setCurrentMusic(item,false)
}
const nextPlay = () => {
    // 播放下一首
    if (localMusicList.value.length >= 1) {
        let index = localMusicList.value.findIndex((item: any) => item.name == currentMusic.value.item.name)
        index++
        if (index >= localMusicList.value.length) {
            index = 0
        }
        globalConfig.setCurrentMusic(localMusicList.value[index],false)
    }
}
// 监听播放成后开始下一首
const onPlayEnd = () => {
    audio.value.addEventListener('ended', nextPlay)
}

const enterConfig = () => {
    router.push('/log-lottery/config')
}
const enterHome = () => {
    router.push('/log-lottery')
}

onMounted(() => {
    globalConfig.setCurrentMusic(localMusicList.value[0],true)
    onPlayEnd()
    // 不使用空格控制audio
})
onUnmounted(() => {
    audio.value.removeEventListener('ended', nextPlay)
})
watch(currentMusic, (val: any) => {
    if(!val.paused&&audio.value){
        play(val.item)
    }
    else{
        audio.value.pause()
    }
},{deep:true})

</script>

<template>
    <div class="flex flex-col gap-3" ref="settingRef">
        <div v-if="route.path.includes('/config')" class="tooltip tooltip-left" data-tip="主页">
            <div class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
                @click="enterHome">
                <svg-icon name="home"></svg-icon>
            </div>
        </div>
        <div v-else class="tooltip tooltip-left" data-tip="设置/配置">
            <div class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
                @click="enterConfig">
                <svg-icon name="setting"></svg-icon>
            </div>
        </div>

        <div class="tooltip tooltip-left" :data-tip="currentMusic.item ? currentMusic.item.name+'\n\r &nbsp; 右键下一曲' : '没有音乐可以播放'">
            <div class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
                @click="playMusic(currentMusic.item)" @click.right.prevent="nextPlay">
                <svg-icon :name="currentMusic.paused ? 'play' : 'pause'"></svg-icon>
            </div>
        </div>
        <!-- <div class="bg-blue-300 cursor-pointer" @click="nextPlay">下一首</div> -->
    </div>
</template>

<style lang='scss' scoped>
details {

    // display: none;
    summary {
        display: none;
    }
}
</style>
