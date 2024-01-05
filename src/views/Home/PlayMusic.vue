<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue'
import useStore from '@/store';
import localforage from 'localforage'

const audioDbStore = localforage.createInstance({
    name: 'audioStore'
})

const audio = ref(new Audio())
const currentMusic = ref<any>()
const globalConfig = useStore().globalConfig
const { getMusicList: localMusicList } = globalConfig;
const localMusicListValue = ref(localMusicList)

const play = async (item: any,skip=false) => {
    if (!audio.value.paused&&!skip) {
        audio.value.pause()

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
    audio.value.pause()
    audio.value.src = audioUrl

    audio.value.currentTime = 0
    audio.value.play()
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
        play(currentMusic.value,true)
    }
}
// 监听播放成后开始下一首
const onPlayEnd = () => {
    audio.value.addEventListener('ended', nextPlay)
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
    <div class="flex gap-3">
        <div class="bg-red-300 cursor-pointer" @click="play(currentMusic)">
            播放/暂停
        </div>
        <div class="bg-blue-300 cursor-pointer" @click="nextPlay">下一首</div>
    </div>
</template>

<style lang='scss' scoped></style>
