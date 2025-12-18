import type { IFileData } from '@/components/FileUpload/type'
import type { IMusic } from '@/types/storeType'
import localforage from 'localforage'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import useStore from '@/store'

export function usePlayMusic() {
    const audioDbStore = localforage.createInstance({
        name: 'audioStore',
    })

    const globalConfig = useStore().globalConfig
    const { getMusicList: localMusicList, getCurrentMusic: currentMusic } = storeToRefs(globalConfig)
    const audio = ref(new Audio())

    async function play(item: IMusic) {
        if (!item) {
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
        if (item.url === 'Storage') {
            const key = item.id
            const audioData = await audioDbStore.getItem<IFileData>(key)
            audioUrl = URL.createObjectURL(audioData?.data as Blob)
        }
        else {
            audioUrl = item.url as string
        }
        audio.value.pause()
        audio.value.src = audioUrl
        audio.value.play()
    }
    function playMusic(item: IMusic, skip = false) {
        if (!item) {
            return
        }
        if (!currentMusic.value.paused && !skip) {
            globalConfig.setCurrentMusic(item, true)

            return
        }
        globalConfig.setCurrentMusic(item, false)
    }
    function nextPlay() {
        // 播放下一首
        if (localMusicList.value.length >= 1) {
            let index = localMusicList.value.findIndex((item: IMusic) => item.name === currentMusic.value.item.name)
            index++
            if (index >= localMusicList.value.length) {
                index = 0
            }
            globalConfig.setCurrentMusic(localMusicList.value[index], false)
        }
    }
    // 监听播放成后开始下一首
    function onPlayEnd() {
        audio.value.addEventListener('ended', nextPlay)
    }
    onMounted(() => {
        globalConfig.setCurrentMusic(localMusicList.value[0], true)
        onPlayEnd()
        // 不使用空格控制audio
    })
    onUnmounted(() => {
        audio.value.removeEventListener('ended', nextPlay)
    })
    watch(currentMusic, (val: { item: IMusic, paused: boolean }) => {
        if (!val.paused && audio.value) {
            play(val.item)
        }
        else {
            audio.value.pause()
        }
    }, { deep: true })
    return {
        currentMusic,
        playMusic,
        nextPlay,
    }
}
