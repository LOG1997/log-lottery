import type { IpageImageTab } from '@/types/pageType'
import type { IImage } from '@/types/storeType'
import localforage from 'localforage'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import useStore from '@/store'

export function useViewModel() {
    const globalConfig = useStore().globalConfig
    const { getImageList: localImageList } = storeToRefs(globalConfig)
    const imgUploadToast = ref(0) // 0是不显示，1是成功，2是失败,3是不是图片
    const imageDbStore = localforage.createInstance({
        name: 'imgStore',
    })
    const activeTabKey = ref<IpageImageTab>('prize')

    const uploadVisible = ref(false)

    function removeImage(item: IImage) {
        if (item.url === 'Storage') {
            imageDbStore.removeItem(item.id).then(() => {
                globalConfig.removeImage(item.id)
            })
        }
        globalConfig.removeImage(item.id)
    }

    function handleChangeTab(key: IpageImageTab) {
        activeTabKey.value = key
    }
    watch(() => imgUploadToast.value, (val) => {
        if (val !== 0) {
            setTimeout(() => {
                imgUploadToast.value = 0
            }, 2000)
        }
    })

    return {
        localImageList,
        uploadVisible,
        removeImage,
        handleChangeTab,
        activeTabKey,
    }
}
