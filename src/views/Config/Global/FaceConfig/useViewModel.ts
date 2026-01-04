import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { z as zod } from 'zod'
import i18n, { languageList } from '@/locales/i18n'
import useStore from '@/store'
import { themeChange } from '@/utils'
import { clearAllDbStore } from '@/utils/localforage'

export function useViewModel() {
    type ValidatePayload = zod.infer<typeof schema>
    const globalConfig = useStore().globalConfig
    const personConfig = useStore().personConfig
    const prizeConfig = useStore().prizeConfig
    const {
        getGlobalConfig: globalConfigData,
        getTopTitle: topTitle,
        getTheme: localTheme,
        getPatterColor: patternColor,
        getPatternList: patternList,
        getCardColor: cardColor,
        getLuckyColor: luckyCardColor,
        getTextColor: textColor,
        getCardSize: cardSize,
        getTextSize: textSize,
        getRowCount: rowCount,
        getIsShowPrizeList: isShowPrizeList,
        getLanguage: userLanguage,
        getBackground: backgroundImage,
        getFont: currentFont,
        getTitleFont: currentTitleFont,
        getTitleFontSyncGlobal: titleFontSyncGlobal,
        getImageList: imageList,
        getIsShowAvatar: isShowAvatar,
        getDefiniteTime: definiteTime,
        getWinMusic: isWinMusic,
    } = storeToRefs(globalConfig)
    const { getAlreadyPersonList: alreadyPersonList, getNotPersonList: notPersonList } = storeToRefs(personConfig)

    const isRowCountChange = ref(0) // 0未改变，1改变,2加载中
    const themeValue = ref(localTheme.value.name)
    const topTitleValue = ref(structuredClone(topTitle.value))
    const cardColorValue = ref(structuredClone(cardColor.value))
    const luckyCardColorValue = ref(structuredClone(luckyCardColor.value))
    const textColorValue = ref(structuredClone(textColor.value))
    const cardSizeValue = ref(structuredClone(cardSize.value))
    const textSizeValue = ref(structuredClone(textSize.value))
    const rowCountValue = ref(structuredClone(rowCount.value))
    const languageValue = ref(structuredClone(userLanguage.value))
    const isShowPrizeListValue = ref(structuredClone(isShowPrizeList.value))
    const isShowAvatarValue = ref(structuredClone(isShowAvatar.value))
    const patternColorValue = ref(structuredClone(patternColor.value))
    const backgroundImageValue = ref(backgroundImage.value)
    const currentFontValue = ref(structuredClone(currentFont.value))
    const currentTitleFontValue = ref(structuredClone(currentTitleFont.value))
    const titleFontSyncGlobalValue = ref(structuredClone(titleFontSyncGlobal.value))
    const definiteTimeValue = ref(structuredClone(definiteTime.value))
    const isWinMusicValue = ref(structuredClone(isWinMusic.value))
    const formData = ref({
        rowCount: rowCountValue,
    })
    const formErr = ref({
        rowCount: '',
    })
    const schema = zod.object({
        rowCount: zod.number({
            error: i18n.global.t('error.require'),
            // required_error: i18n.global.t('error.require'),
            // invalid_type_error: i18n.global.t('error.requireNumber'),
        })
            .min(1, i18n.global.t('error.minNumber1'))
            .max(100, i18n.global.t('error.maxNumber100')),
        // 格式化

    })
    const payload: ValidatePayload = {
        rowCount: formData.value.rowCount,
    }
    function parseSchema(props: ValidatePayload) {
        return schema.parseAsync(props)
    }

    function resetPersonLayout() {
        isRowCountChange.value = 2
        setTimeout(() => {
            const alreadyLen = alreadyPersonList.value.length
            const notLen = notPersonList.value.length
            if (alreadyLen <= 0 && notLen <= 0) {
                return
            }
            const allPersonList = alreadyPersonList.value.concat(notPersonList.value)
            const newAlreadyPersonList = allPersonList.slice(0, alreadyLen)
            const newNotPersonList = allPersonList.slice(alreadyLen, notLen + alreadyLen)
            personConfig.deleteAllPerson()
            personConfig.addNotPersonList(newNotPersonList)
            personConfig.addAlreadyPersonList(newAlreadyPersonList, null)

            isRowCountChange.value = 0
        }, 1000)
    }

    function clearPattern() {
        globalConfig.setPatternList([] as number[])
    }
    function resetPattern() {
        globalConfig.resetPatternList()
    }

    function resetData() {
        globalConfig.reset()
        personConfig.reset()
        prizeConfig.resetDefault()
        //   删除所有indexDb
        clearAllDbStore()
        // 刷新页面
        window.location.reload()
    }

    function exportAllConfigData() {
        // const globalConfigData = globalConfig.getGlobalConfig()
        // console.log(globalConfigData.value)
        // const globalConfigData = globalConfig.getGlobalConfig()
        const dataStr = JSON.stringify(globalConfigData.value, null, 2)
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

        const exportFileDefaultName = 'global-config.json'

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }
    function importAllConfigData(data: any) {
        globalConfig.setGlobalConfig(data)
        window.location.reload()
    }

    watch(() => formData.value.rowCount, () => {
        payload.rowCount = formData.value.rowCount
        parseSchema(payload).then((res) => {
            if (res.rowCount) {
                isRowCountChange.value = 1
                globalConfig.setRowCount(res.rowCount)
            }
        }).catch((err) => {
            formErr.value.rowCount = err.issues[0].message
        })
    })

    watch(topTitleValue, (val) => {
        globalConfig.setTopTitle(val)
    })
    watch(themeValue, (val: any) => {
        globalConfig.setTheme({ name: val })
        themeChange(val)
    }, { deep: true })

    watch(cardColorValue, (val: string) => {
        globalConfig.setCardColor(val)
    }, { deep: true })
    watch(luckyCardColorValue, (val: string) => {
        globalConfig.setLuckyCardColor(val)
    }, { deep: true })
    watch(patternColorValue, (val: string) => {
        globalConfig.setPatterColor(val)
    })
    watch(textColorValue, (val: string) => {
        globalConfig.setTextColor(val)
    }, { deep: true })

    watch(cardSizeValue, (val: { width: number, height: number }) => {
        globalConfig.setCardSize(val)
    }, { deep: true })

    watch(isShowPrizeListValue, () => {
        globalConfig.setIsShowPrizeList(isShowPrizeListValue.value)
    })
    watch(backgroundImageValue, (val) => {
        globalConfig.setBackground(val)
    })
    watch(currentFontValue, (val) => {
        globalConfig.setFont(val)
        document.documentElement.style.setProperty('--app-font-family', `"${val}", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
    })
    watch(currentTitleFontValue, (val) => {
        globalConfig.setTitleFont(val)
    })
    watch(titleFontSyncGlobalValue, (val) => {
        globalConfig.setTitleFontSyncGlobal(val)
    })
    watch(languageValue, (val: string) => {
        globalConfig.setLanguage(val)
    })
    watch(isShowAvatarValue, () => {
        globalConfig.setIsShowAvatar(isShowAvatarValue.value)
    })
    watch(definiteTimeValue, () => {
        globalConfig.setDefiniteTime(definiteTimeValue.value)
    })
    watch(isWinMusicValue, () => {
        globalConfig.setIsPlayWinMusic(isWinMusicValue.value)
    })
    watch(textSizeValue, (val: number) => {
        globalConfig.setTextSize(val)
    })
    onMounted(() => {
    })
    return {
        resetData,
        topTitleValue,
        languageValue,
        textSizeValue,
        currentFontValue,
        currentTitleFontValue,
        titleFontSyncGlobalValue,
        languageList,
        formErr,
        formData,
        cardSizeValue,
        isShowPrizeListValue,
        isShowAvatarValue,
        resetPersonLayout,
        isRowCountChange,
        themeValue,
        backgroundImageValue,
        cardColorValue,
        luckyCardColorValue,
        textColorValue,
        patternColorValue,
        imageList,
        rowCount,
        cardColor,
        patternColor,
        patternList,
        clearPattern,
        resetPattern,
        exportAllConfigData,
        importAllConfigData,
        definiteTimeValue,
        isWinMusicValue,
    }
}
