import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onMounted, provide, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { loadingKey, loadingState } from '@/components/Loading'
import { useWebsocket } from '@/hooks/useWebsocket'
import useStore from '@/store'
import { themeChange } from '@/utils'
import { IndexDb } from '@/utils/dexie'

export function useMounted(tipDialog: Ref<any>) {
    provide(loadingKey, loadingState)
    const globalConfig = useStore().globalConfig
    const prizeConfig = useStore().prizeConfig
    const system = useStore().system
    const { getTheme: localTheme } = storeToRefs(globalConfig)
    const { getPrizeConfig: prizeList, getTemporaryPrize: temporaryPrize } = storeToRefs(prizeConfig)
    const tipDesc = ref('')
    const { t } = useI18n()
    const route = useRoute()
    const msgListDb = new IndexDb('msgList', ['msgList'], 1, ['createTime'])
    const enableWebsocket = import.meta.env.VITE_ENABLE_WEBSOCKET
    const websocketData = enableWebsocket === 'true' ? useWebsocket() : { data: ref(null) }
    const { data } = websocketData
    // 设置当前奖列表
    function setCurrentPrize() {
        if (prizeList.value.length <= 0) {
            return
        }
        if (temporaryPrize.value && temporaryPrize.value.isShow) {
            prizeConfig.setCurrentPrize(temporaryPrize.value)
            return
        }
        for (let i = 0; i < prizeList.value.length; i++) {
            if (!prizeList.value[i].isUsed) {
                prizeConfig.setCurrentPrize(prizeList.value[i])

                break
            }
        }
    }
    // 判断是否手机端访问
    function judgeMobile() {
        const ua = navigator.userAgent
        const isAndroid = ua.includes('Android') || ua.includes('Adr')
        const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

        system.setIsMobile(isAndroid || isIOS)

        return isAndroid || isIOS
    }
    // 判断是否chrome或者edge访问
    function judgeChromeOrEdge() {
        const ua = navigator.userAgent
        const isChrome = ua.includes('Chrome')
        const isEdge = ua.includes('Edg')

        system.setIsChrome(isChrome)

        return isChrome || isEdge
    }
    const isShowMobileWarn = () => {
        const isMobilePage = judgeMobile()
        const { meta } = route
        let allowMobile = false
        if (meta && meta.isMobile) {
            allowMobile = true
        }
        return !allowMobile && isMobilePage
    }

    watch(() => data.value, (newValue) => {
        if (!newValue) {
            return
        }
        msgListDb.setData('msgList', toRaw(newValue))
    }, { immediate: true, deep: true })
    onMounted(() => {
        themeChange(localTheme.value.name)
        setCurrentPrize()
        if (isShowMobileWarn()) {
            tipDialog.value.showDialog()
            tipDesc.value = t('dialog.dialogPCWeb')
        }
        else if (!judgeChromeOrEdge()) {
            tipDialog.value.showDialog()
            tipDesc.value = t('dialog.dialogLatestBrowser')
        }
    })

    return { tipDesc }
}
