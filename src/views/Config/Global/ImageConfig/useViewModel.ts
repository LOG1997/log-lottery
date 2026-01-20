import type { IImage, IImageType } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import useStore from '@/store'

export function useViewModel() {
    const sourceConfig = useStore().sourceConfig
    const {
        getPrizeImageSource: prizeImageList,
        getAvatarImageSource: avatarImageList,
        getOtherImageSource: otherImageList,
    } = storeToRefs(sourceConfig)
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

    const localImageList = ref<IImage[]>([])

    const activeTabKey = ref<IImageType>('prize')

    const uploadVisible = ref(true)

    function removeImage(item: IImage) {
        sourceConfig.removeImageSource(item, activeTabKey.value)
    }

    function handleUpload() {

    }

    function handleChangeTab(key: IImageType) {
        activeTabKey.value = key
    }
    watch(() => activeTabKey.value, (val) => {
        if (val === 'prize') {
            localImageList.value = prizeImageList.value
        }
        else if (val === 'avatar') {
            localImageList.value = avatarImageList.value
        }
        else {
            localImageList.value = otherImageList.value
        }
    }, { immediate: true })
    return {
        tabsList,
        localImageList,
        uploadVisible,
        removeImage,
        handleChangeTab,
        activeTabKey,
    }
}
