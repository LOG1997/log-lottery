import {ref} from 'vue'

export const useAudio = () => {
    const audio = ref(new Audio)
    const audioPaused=ref(true)
    const setAudioSrc = (src: string) => {
        audio.value.src = src
    }
    const play = () => {
        audio.value.play()
        setPaused(false)
    }
    const pause = () => {
        audio.value.pause()
        setPaused(true)
    }
    const setPaused=(paused:boolean)=>{
        audioPaused.value=paused
    }
    const stop = () => {
        audio.value.pause()
        audio.value.currentTime = 0
    }
    const nextPlay = (src:string) => {
        pause()
        setAudioSrc(src)
        play()
    }

    return {
        audio,
        audioPaused,
        play,
        nextPlay,
        setPaused,
        pause,
        stop,
        setAudioSrc
    }
}
