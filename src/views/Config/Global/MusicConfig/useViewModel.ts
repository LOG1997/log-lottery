import type { IMusic, IMusicType } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from '@/store'

export function useViewModel() {
    const sourceConfig = useStore().sourceConfig
    const globalConfig = useStore().globalConfig
    const {
        getBackMusicSource: backMusicList,
        getProcessMusicSource: processMusicList,
        getOtherMusicSource: otherMusicList,
    } = storeToRefs(sourceConfig)
    const route = useRoute()
    const router = useRouter()
    const tabsList: { key: IMusicType, label: string }[] = [{
        key: 'background',
        label: '背景音乐',
    }, {
        key: 'process',
        label: '过程音乐',
    }, {
        key: 'other',
        label: '其他',
    }]
    const activeTabKey = ref<IMusicType>('background')
    function playMusic(music: IMusic) {
        globalConfig.setCurrentMusic(music, false)
    }
    const localMusicList = computed(() => {
        if (activeTabKey.value === 'background') {
            return backMusicList.value
        }
        else if (activeTabKey.value === 'process') {
            return processMusicList.value
        }
        else {
            return otherMusicList.value
        }
    })
    function removeMusic(item: IMusic) {
        sourceConfig.removeMusicSource(item, activeTabKey.value)
    }
    function resetMusic() {
        sourceConfig.resetMusicSource(activeTabKey.value)
    }
    function deleteAll() {
        sourceConfig.removeAllMusicSource(activeTabKey.value)
    }
    function handleChangeTab(key: IMusicType = 'background') {
        activeTabKey.value = key
        // router.push({
        //     path: route.path,
        //     query: { tab: key },
        // })
        router.replace({
            path: route.path,
            query: { tab: key },
        })
    }
    onMounted(() => {
        if (route.query.tab) {
            handleChangeTab(route.query.tab as IMusicType)
        }
        else {
            handleChangeTab('background')
        }
    })
    return {
        tabsList,
        localMusicList,
        removeMusic,
        handleChangeTab,
        resetMusic,
        deleteAll,
        playMusic,
        activeTabKey,
    }
}
