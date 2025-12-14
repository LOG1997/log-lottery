<script setup lang='ts'>
import useStore from '@/store'
import localforage from 'localforage'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const audioDbStore = localforage.createInstance({
  name: 'audioStore',
})
const audio = ref(new Audio())
const settingRef = ref()
// const audio = ref(new Audio())
const globalConfig = useStore().globalConfig
const themeStore = useStore().themeStore
const { getMusicList: localMusicList, getCurrentMusic: currentMusic } = storeToRefs(globalConfig)
// const localMusicListValue = ref(localMusicList)

async function play(item: any) {
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
    audioUrl = await audioDbStore.getItem(item.name) as string
  }
  else {
    audioUrl = item.url
  }
  audio.value.pause()
  audio.value.src = audioUrl
  audio.value.play()
}
function playMusic(item: any, skip = false) {
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
    let index = localMusicList.value.findIndex((item: any) => item.name === currentMusic.value.item.name)
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

function enterConfig() {
  // 跳转到当前主题的配置页面
  const themeId = themeStore.currentThemeId
  if (themeId) {
    router.push(`/log-lottery/t/${themeId}/config`)
  }
  else {
    router.push('/log-lottery/config')
  }
}
function enterHome() {
  // 跳转到当前主题的抽奖页面
  const themeId = themeStore.currentThemeId
  if (themeId) {
    router.push(`/log-lottery/t/${themeId}`)
  }
  else {
    router.push('/log-lottery/entry')
  }
}

onMounted(() => {
  globalConfig.setCurrentMusic(localMusicList.value[0], true)
  onPlayEnd()
  // 不使用空格控制audio
})
onUnmounted(() => {
  audio.value.removeEventListener('ended', nextPlay)
})
watch(currentMusic, (val: any) => {
  if (!val.paused && audio.value) {
    play(val.item)
  }
  else {
    audio.value.pause()
  }
}, { deep: true })
</script>

<template>
  <div ref="settingRef" class="flex flex-col gap-3">
    <div v-if="route.path.includes('/config')" class="tooltip tooltip-left" :data-tip="t('tooltip.toHome')">
      <div
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
        @click="enterHome"
      >
        <svg-icon name="home" />
      </div>
    </div>
    <div v-else class="tooltip tooltip-left" :data-tip="t('tooltip.settingConfiguration')">
      <div
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
        @click="enterConfig"
      >
        <svg-icon name="setting" />
      </div>
    </div>

    <div class="tooltip tooltip-left" :data-tip="currentMusic.item ? `${currentMusic.item.name}\n\r ${t('tooltip.nextSong')}` : t('tooltip.noSongPlay')">
      <div
        class="flex items-center justify-center w-10 h-10 p-0 m-0 cursor-pointer setting-container bg-slate-500/50 rounded-l-xl hover:bg-slate-500/80 hover:text-blue-400/90"
        @click="playMusic(currentMusic.item)" @click.right.prevent="nextPlay"
      >
        <svg-icon :name="currentMusic.paused ? 'play' : 'pause'" />
      </div>
    </div>
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
