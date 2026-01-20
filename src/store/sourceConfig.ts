import type { IImage, IImageType, IMusic, IMusicType } from '@/types/storeType'
import { ImagesIcon } from 'lucide-vue-next'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { IndexDb } from '@/utils/dexie'
import { defaultBackMusicList, defaultPrizeImageList } from './data'

export const useSourceConfig = defineStore('source', () => {
    const imageDbStore = new IndexDb('imgStore', ['prize', 'avatar', 'other'], 1, ['createTime'])
    const musicDbStore = new IndexDb('musicStore', ['background', 'process', 'other'], 1, ['createTime'])
    // 默认数据写入indexdb
    // defaultPrizeImageList.forEach((item) => {
    //     item.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')
    // })
    // defaultBackMusicList.forEach((item) => {
    //     item.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')
    // })
    // imageDbStore.setAllData('prize', defaultPrizeImageList)
    // musicDbStore.setAllData('background', defaultBackMusicList)
    // NOTE:state
    const defaultImageList = ref<IImage[]>(defaultPrizeImageList)
    const defaultMusicList = ref<IMusic[]>(defaultBackMusicList)

    const sourceConfig = ref({
        imageSource: {
            prize: [] as IImage[],
            avatar: [] as IImage[],
            other: [] as IImage[],
        },
        musicSource: {
            background: [] as IMusic[],
            process: [] as IMusic[],
            other: [] as IMusic[],
        },
    })
    imageDbStore.getDataSortedByDateTime('prize', 'createTime').then((data) => {
        sourceConfig.value.imageSource.prize = data
    })
    imageDbStore.getDataSortedByDateTime('avatar', 'createTime').then((data) => {
        sourceConfig.value.imageSource.avatar = data
    })
    imageDbStore.getDataSortedByDateTime('other', 'createTime').then((data) => {
        sourceConfig.value.imageSource.other = data
    })
    musicDbStore.getDataSortedByDateTime('background', 'createTime').then((data) => {
        sourceConfig.value.musicSource.background = data
    })
    musicDbStore.getDataSortedByDateTime('process', 'createTime').then((data) => {
        sourceConfig.value.musicSource.process = data
    })
    musicDbStore.getDataSortedByDateTime('other', 'createTime').then((data) => {
        sourceConfig.value.musicSource.other = data
    })
    // NOTE:getter
    const getSourceConfig = computed(() => sourceConfig.value)

    const getPrizeImageSource = computed(() => [...defaultImageList.value, ...sourceConfig.value.imageSource.prize])

    const getAvatarImageSource = computed(() => sourceConfig.value.imageSource.avatar)

    const getOtherImageSource = computed(() => sourceConfig.value.imageSource.other)

    const getBackMusicSource = computed(() => [...defaultMusicList.value, ...sourceConfig.value.musicSource.background])

    const getProcessMusicSource = computed(() => sourceConfig.value.musicSource.process)

    const getOtherMusicSource = computed(() => sourceConfig.value.musicSource.other)

    // NOTE:action
    function addImageSource(imageList: IImage[], type: IImageType) {
        if (imageList.length <= 0) {
            return
        }
        imageList.forEach((item: IImage) => {
            sourceConfig.value.imageSource[type].push(item)
            imageDbStore.setData(type, item)
        })
    }
    function addMusicSource(musicList: IMusic[], type: IMusicType) {
        if (musicList.length <= 0) {
            return
        }
        musicList.forEach((item: IMusic) => {
            sourceConfig.value.musicSource[type].push(item)
            musicDbStore.setData(type, item)
        })
    }
    function removeImageSource(item: IImage, type: IImageType | 'default' = 'default') {
        if (type === 'default') {
            defaultImageList.value = defaultImageList.value.filter(img => img.id !== item.id)
            return
        }
        imageDbStore.deleteData(type, item)
        // 重新获取
        imageDbStore.getDataSortedByDateTime(type, 'createTime').then((data) => {
            sourceConfig.value.imageSource[type] = data
        })
    }
    function removeMusicSource(item: IMusic, type: IMusicType | 'default' = 'default') {
        if (type === 'default') {
            defaultMusicList.value = defaultMusicList.value.filter(music => music.id !== item.id)
            return
        }
        musicDbStore.deleteData(type, item)
        // 重新获取
        musicDbStore.getDataSortedByDateTime(type, 'createTime').then((data) => {
            sourceConfig.value.musicSource[type] = data
        })
    }
    return {
        defaultImageList,
        defaultMusicList,
        sourceConfig,
        getSourceConfig,
        getPrizeImageSource,
        getAvatarImageSource,
        getOtherImageSource,
        getBackMusicSource,
        getProcessMusicSource,
        getOtherMusicSource,
        addImageSource,
        addMusicSource,
        removeImageSource,
        removeMusicSource,
    }
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                // 如果要存储在localStorage中
                storage: localStorage,
                // key: 'defaultSourceConfig',
                paths: ['defaultImageList', 'defaultMusicList'],
            },
        ],
    },
})
