<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue'
import useStore from '@/store';
import localforage from 'localforage'
import { useRouter, useRoute } from 'vue-router';
import { useAudio } from '@/hooks/useAudio'
const router = useRouter()
const route = useRoute()
const audioDbStore = localforage.createInstance({
    name: 'audioStore'
})

const audioHook = useAudio()
const { audio, audioPaused } = audioHook
const settingRef = ref()
// const audio = ref(new Audio())
const currentMusic = ref<any>()
const globalConfig = useStore().globalConfig
const { getMusicList: localMusicList } = globalConfig;
const localMusicListValue = ref(localMusicList)

const play = async (item: any, skip = false) => {
    if (!audio.value.paused && !skip) {
        audioHook.pause()

        return
    }
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
    audioHook.pause()
    audioHook.setAudioSrc(audioUrl)
    audioHook.play()
}

const nextPlay = () => {
    // 播放下一首
    if (localMusicListValue.value.length > 1) {
        let index = localMusicListValue.value.findIndex((item: any) => item.name == currentMusic.value.name)
        index++
        if (index >= localMusicListValue.value.length) {
            index = 0
        }
        currentMusic.value = localMusicListValue.value[index]
        play(currentMusic.value, true)
    }
}
// 监听播放成后开始下一首
const onPlayEnd = () => {
    audio.value.addEventListener('ended', nextPlay)
}

const enterConfig = () => {
    router.push('/config')
}
const enterHome = () => {
    router.push('/')
}

onMounted(() => {
    currentMusic.value = localMusicListValue.value[0]
    onPlayEnd()
})
onUnmounted(() => {
    audio.value.removeEventListener('ended', nextPlay)
})

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

        <div class="tooltip tooltip-left" :data-tip="currentMusic ? currentMusic.name+'\n\r &nbsp; 右键下一曲' : '播放/暂停'">
            <div class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
                @click="play(currentMusic)" @click.right.prevent="nextPlay">
                <svg-icon :name="audioPaused ? 'play' : 'pause'"></svg-icon>
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
