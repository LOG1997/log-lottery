import type { IImage, IImageType } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from '@/store'

export function useViewModel() {
    const sourceConfig = useStore().sourceConfig
    const {
        getPrizeImageSource: prizeImageList,
        getAvatarImageSource: avatarImageList,
        getOtherImageSource: otherImageList,
    } = storeToRefs(sourceConfig)
    const route = useRoute()
    const router = useRouter()
    const tabsList: { key: IImageType, label: string }[] = [{
        key: 'prize',
        label: '奖品',
    }, {
        key: 'avatar',
        label: '头像',
    }, {
        key: 'other',
        label: '其他',
    }]
    const activeTabKey = ref<IImageType>('prize')

    const uploadVisible = ref(true)
    const localImageList = computed(() => {
        if (activeTabKey.value === 'prize') {
            return prizeImageList.value
        }
        else if (activeTabKey.value === 'avatar') {
            return avatarImageList.value
        }
        else {
            return otherImageList.value
        }
    })
    function removeImage(item: IImage) {
        sourceConfig.removeImageSource(item, activeTabKey.value)
    }
    function handleUpload() {

    }

    function handleChangeTab(key: IImageType = 'prize') {
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
            handleChangeTab(route.query.tab as IImageType)
        }
        else {
            handleChangeTab('prize')
        }
    })
    return {
        tabsList,
        localImageList,
        uploadVisible,
        removeImage,
        handleChangeTab,
        activeTabKey,
    }
}
