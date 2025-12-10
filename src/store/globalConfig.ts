import type { IImage, IMusic } from '@/types/storeType'
import { defineStore } from 'pinia'
import i18n, { browserLanguage } from '@/locales/i18n'
import { defaultImageList, defaultMusicList, defaultPatternList } from './data'
// import { IPrizeConfig } from '@/types/storeType';
export const useGlobalConfig = defineStore('global', {
    state() {
        return {
            globalConfig: {
                rowCount: 17,
                isSHowPrizeList: true,
                isShowAvatar: false,
                topTitle: i18n.global.t('data.defaultTitle'),
                language: browserLanguage,
                theme: {
                    name: 'dracula',
                    detail: { primary: '#0f5fd3' },
                    cardColor: '#ff79c6',
                    cardWidth: 140,
                    cardHeight: 200,
                    textColor: '#ffffff',
                    luckyCardColor: '#ECB1AC',
                    textSize: 30,
                    patternColor: '#1b66c9',
                    patternList: defaultPatternList as number[],
                    background: {}, // 背景颜色或图片
                    font: '微软雅黑',
                    titleFont: '微软雅黑',
                    titleFontSyncGlobal: true,
                },
                musicList: defaultMusicList as IMusic[],
                imageList: defaultImageList as IImage[],
            },
            currentMusic: {
                item: defaultMusicList[0],
                paused: true,
            },
        }
    },
    getters: {
        // 获取全部配置
        getGlobalConfig(state) {
            return state.globalConfig
        },
        // 获取标题
        getTopTitle(state) {
            return state.globalConfig.topTitle
        },
        // 获取行数
        getRowCount(state) {
            return state.globalConfig.rowCount
        },
        // 获取主题
        getTheme(state) {
            return state.globalConfig.theme
        },
        // 获取卡片颜色
        getCardColor(state) {
            return state.globalConfig.theme.cardColor
        },
        // 获取中奖颜色
        getLuckyColor(state) {
            return state.globalConfig.theme.luckyCardColor
        },
        // 获取文字颜色
        getTextColor(state) {
            return state.globalConfig.theme.textColor
        },
        // 获取卡片宽高
        getCardSize(state) {
            return {
                width: state.globalConfig.theme.cardWidth,
                height: state.globalConfig.theme.cardHeight,
            }
        },
        // 获取文字大小
        getTextSize(state) {
            return state.globalConfig.theme.textSize
        },
        // 获取图案颜色
        getPatterColor(state) {
            return state.globalConfig.theme.patternColor
        },
        // 获取图案列表
        getPatternList(state) {
            return state.globalConfig.theme.patternList
        },
        // 获取音乐列表
        getMusicList(state) {
            return state.globalConfig.musicList
        },
        // 获取当前音乐
        getCurrentMusic(state) {
            return state.currentMusic
        },
        // 获取图片列表
        getImageList(state) {
            return state.globalConfig.imageList
        },
        // 获取是否显示奖品列表
        getIsShowPrizeList(state) {
            return state.globalConfig.isSHowPrizeList
        },
        // 获取当前语言
        getLanguage(state) {
            return state.globalConfig.language
        },
        // 获取背景图片设置
        getBackground(state) {
            return state.globalConfig.theme.background
        },
        // 获取字体
        getFont(state) {
            return state.globalConfig.theme.font
        },
        // 获取标题字体
        getTitleFont(state) {
            return state.globalConfig.theme.titleFont
        },
        // 获取标题字体同步全局
        getTitleFontSyncGlobal(state) {
            return state.globalConfig.theme.titleFontSyncGlobal
        },
        // 获取是否显示头像
        getIsShowAvatar(state) {
            return state.globalConfig.isShowAvatar
        },
    },
    actions: {
        // 设置rowCount
        setRowCount(rowCount: number) {
            this.globalConfig.rowCount = rowCount
        },
        // 设置标题
        setTopTitle(topTitle: string) {
            this.globalConfig.topTitle = topTitle
        },
        // 设置主题
        setTheme(theme: any) {
            const { name, detail } = theme
            this.globalConfig.theme.name = name
            this.globalConfig.theme.detail = detail
        },
        // 设置卡片颜色
        setCardColor(cardColor: string) {
            this.globalConfig.theme.cardColor = cardColor
        },
        // 设置中奖颜色
        setLuckyCardColor(luckyCardColor: string) {
            this.globalConfig.theme.luckyCardColor = luckyCardColor
        },
        // 设置文字颜色
        setTextColor(textColor: string) {
            this.globalConfig.theme.textColor = textColor
        },
        // 设置卡片宽高
        setCardSize(cardSize: { width: number, height: number }) {
            this.globalConfig.theme.cardWidth = cardSize.width
            this.globalConfig.theme.cardHeight = cardSize.height
        },
        // 设置文字大小
        setTextSize(textSize: number) {
            this.globalConfig.theme.textSize = textSize
        },
        // 设置图案颜色
        setPatterColor(patterColor: string) {
            this.globalConfig.theme.patternColor = patterColor
        },
        // 设置图案列表
        setPatternList(patternList: number[]) {
            this.globalConfig.theme.patternList = patternList
        },
        // 重置图案列表
        resetPatternList() {
            this.globalConfig.theme.patternList = defaultPatternList
        },
        // 添加音乐
        addMusic(music: IMusic) {
            // 验证音乐是否已存在，看name字段
            for (let i = 0; i < this.globalConfig.musicList.length; i++) {
                if (this.globalConfig.musicList[i].name === music.name) {
                    return
                }
            }
            this.globalConfig.musicList.push(music)
        },
        // 删除音乐
        removeMusic(musicId: string) {
            for (let i = 0; i < this.globalConfig.musicList.length; i++) {
                if (this.globalConfig.musicList[i].id === musicId) {
                    this.globalConfig.musicList.splice(i, 1)
                    break
                }
            }
        },
        // 设置当前播放音乐
        setCurrentMusic(musicItem: IMusic, paused: boolean = true) {
            this.currentMusic = {
                item: musicItem,
                paused,
            }
        },
        // 重置音乐列表
        resetMusicList() {
            this.globalConfig.musicList = JSON.parse(JSON.stringify(defaultMusicList)) as IMusic[]
        },
        // 清空音乐列表
        clearMusicList() {
            this.globalConfig.musicList = [] as IMusic[]
        },
        // 添加图片
        addImage(image: IImage) {
            for (let i = 0; i < this.globalConfig.imageList.length; i++) {
                if (this.globalConfig.imageList[i].name === image.name) {
                    return
                }
            }
            this.globalConfig.imageList.push(image)
        },
        // 删除图片
        removeImage(imageId: string) {
            for (let i = 0; i < this.globalConfig.imageList.length; i++) {
                if (this.globalConfig.imageList[i].id === imageId) {
                    this.globalConfig.imageList.splice(i, 1)
                    break
                }
            }
        },
        // 重置图片列表
        resetImageList() {
            this.globalConfig.imageList = defaultImageList as IImage[]
        },
        // 清空图片列表
        clearImageList() {
            this.globalConfig.imageList = [] as IImage[]
        },
        // 设置是否显示奖品列表
        setIsShowPrizeList(isShowPrizeList: boolean) {
            this.globalConfig.isSHowPrizeList = isShowPrizeList
        },
        // 设置
        setLanguage(language: string) {
            this.globalConfig.language = language
            i18n.global.locale.value = language
        },
        // 设置背景图片
        setBackground(background: any) {
            this.globalConfig.theme.background = background
        },
        // 设置字体
        setFont(font: any) {
            this.globalConfig.theme.font = font
        },
        // 设置标题字体
        setTitleFont(titleFont: any) {
            this.globalConfig.theme.titleFont = titleFont
        },
        // 设置同步全局字体
        setTitleFontSyncGlobal(titleFontSyncGlobal: boolean) {
            this.globalConfig.theme.titleFontSyncGlobal = titleFontSyncGlobal
        },
        // 设置是否显示头像
        setIsShowAvatar(isShowAvatar: boolean) {
            this.globalConfig.isShowAvatar = isShowAvatar
        },
        // 重置所有配置
        reset() {
            this.globalConfig = {
                rowCount: 17,
                isSHowPrizeList: true,
                isShowAvatar: false,
                topTitle: i18n.global.t('data.defaultTitle'),
                language: browserLanguage,
                theme: {
                    name: 'dracula',
                    detail: { primary: '#0f5fd3' },
                    cardColor: '#ff79c6',
                    cardWidth: 140,
                    cardHeight: 200,
                    textColor: '#ffffff',
                    luckyCardColor: '#ECB1AC',
                    textSize: 30,
                    patternColor: '#1b66c9',
                    patternList: defaultPatternList as number[],
                    background: {}, // 背景颜色或图片
                    font: '微软雅黑',
                    titleFont: '微软雅黑',
                    titleFontSyncGlobal: true,
                },
                musicList: defaultMusicList as IMusic[],
                imageList: defaultImageList as IImage[],
            }
            this.currentMusic = {
                item: defaultMusicList[0],
                paused: true,
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                // 如果要存储在localStorage中
                storage: localStorage,
                key: 'globalConfig',
                paths: ['globalConfig'],
            },
        ],
    },
})
