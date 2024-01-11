import { defineStore } from 'pinia';
import { defaultMusicList,defaultImageList,defaultPatternList } from './data'
import {IMusic,IImage} from '@/types/storeType';
// import { IPrizeConfig } from '@/types/storeType';
export const useGlobalConfig = defineStore('global', {
    state() {
        return {
            globalConfig: {
                rowCount: 17,
                isSHowPrizeList:true,
                topTitle:'大明内阁六部御前奏对',
                theme: {
                    name: 'dark',
                    detail: { primary: '#0f5fd3' },
                    cardColor: '#ff79c6',
                    cardWidth: 140,
                    cardHeight: 200,
                    textColor: '#ffffff',
                    luckyCardColor:'#ECB1AC',
                    textSize: 30,
                    patternColor:'#1b66c9',
                    patternList:defaultPatternList as number[],
                },
                musicList: defaultMusicList as IMusic[],
                imageList:defaultImageList as IImage[],
            },
            currentMusic: {
                item:defaultMusicList[0],
                paused:true,
            },
        };
    },
    getters: {
        // 获取全部配置
        getGlobalConfig(state) {
            return state.globalConfig;
        },
        // 获取标题
        getTopTitle(state) {
            return state.globalConfig.topTitle;
        },
        // 获取行数
        getRowCount(state) {
            return state.globalConfig.rowCount;
        },
        // 获取主题
        getTheme(state) {
            return state.globalConfig.theme;
        },
        // 获取卡片颜色
        getCardColor(state) {
            return state.globalConfig.theme.cardColor;
        },
        // 获取中奖颜色
        getLuckyColor(state) {
            return state.globalConfig.theme.luckyCardColor;
        },
        // 获取文字颜色
        getTextColor(state) {
            return state.globalConfig.theme.textColor;
        },
        // 获取卡片宽高
        getCardSize(state) {
            return {
                width: state.globalConfig.theme.cardWidth,
                height: state.globalConfig.theme.cardHeight
            }
        },
        // 获取文字大小
        getTextSize(state) {
            return state.globalConfig.theme.textSize;
        },
        // 获取图案颜色
        getPatterColor(state){
            return state.globalConfig.theme.patternColor;
        },
        // 获取图案列表
        getPatternList(state){
            return state.globalConfig.theme.patternList;
        },
        // 获取音乐列表
        getMusicList(state) {
            return state.globalConfig.musicList;
        },
        // 获取当前音乐
        getCurrentMusic(state) {
            return state.currentMusic;
        },
        // 获取图片列表
        getImageList(state) {
            return state.globalConfig.imageList;
        },
        // 获取是否显示奖品列表
        getIsShowPrizeList(state) {
            return state.globalConfig.isSHowPrizeList;
        }

    },
    actions: {
        // 设置rowCount
        setRowCount(rowCount: number) {
            this.globalConfig.rowCount = rowCount;
        },
        // 设置标题
        setTopTitle(topTitle: string) {
            this.globalConfig.topTitle = topTitle;
        },
        // 设置主题
        setTheme(theme: any) {
            const { name, detail } = theme;
            this.globalConfig.theme.name = name;
            this.globalConfig.theme.detail = detail;
        },
        // 设置卡片颜色
        setCardColor(cardColor: string) {
            this.globalConfig.theme.cardColor = cardColor;
        },
        // 设置中奖颜色
        setLuckyCardColor(luckyCardColor: string) {
            this.globalConfig.theme.luckyCardColor = luckyCardColor;
        },
        // 设置文字颜色
        setTextColor(textColor: string) {
            this.globalConfig.theme.textColor = textColor;
        },
        // 设置卡片宽高
        setCardSize(cardSize: { width: number, height: number }) {
            this.globalConfig.theme.cardWidth = cardSize.width;
            this.globalConfig.theme.cardHeight = cardSize.height;
        },
        // 设置文字大小
        setTextSize(textSize: number) {
            this.globalConfig.theme.textSize = textSize;
        },
        // 设置图案颜色
        setPatterColor(patterColor: string) {
            this.globalConfig.theme.patternColor = patterColor;
        },
        // 设置图案列表
        setPatternList(patternList: number[]) {
            this.globalConfig.theme.patternList = patternList;
        },
        // 重置图案列表
        resetPatternList() {
            this.globalConfig.theme.patternList = defaultPatternList;
        },
        // 添加音乐
        addMusic(music: IMusic) {
            // 验证音乐是否已存在，看name字段
            for (let i = 0; i < this.globalConfig.musicList.length; i++) {
                if (this.globalConfig.musicList[i].name === music.name) {
                    return;
                }
            }
            this.globalConfig.musicList.push(music);
        },
        // 删除音乐
        removeMusic(musicId: string) {
            for (let i = 0; i < this.globalConfig.musicList.length; i++) {
                if (this.globalConfig.musicList[i].id === musicId) {
                    this.globalConfig.musicList.splice(i, 1);
                    break;
                }
            }
        },
        // 设置当前播放音乐
        setCurrentMusic(musicItem: IMusic,paused:boolean=true) {
            this.currentMusic={
                item:musicItem,
                paused:paused,
            }
        },
        // 重置音乐列表
        resetMusicList() {
            this.globalConfig.musicList = defaultMusicList as IMusic[];
        },
        // 清空音乐列表
        clearMusicList() {
            this.globalConfig.musicList = [] as IMusic[];
        },
        // 添加图片
        addImage(image:IImage){
            for (let i = 0; i < this.globalConfig.imageList.length; i++) {
                if (this.globalConfig.imageList[i].name === image.name) {
                    return;
                }
            }
            this.globalConfig.imageList.push(image);
        },
        // 删除图片
        removeImage(imageId: string) {
            for (let i = 0; i < this.globalConfig.imageList.length; i++) {
                if (this.globalConfig.imageList[i].id === imageId) {
                    this.globalConfig.imageList.splice(i, 1);
                    break;
                }
            }
        },
        // 重置图片列表
        resetImageList() {
            this.globalConfig.imageList = defaultImageList as IImage[];
        },
        // 清空图片列表
        clearImageList() {
            this.globalConfig.imageList = [] as IImage[]
        },
        // 设置是否显示奖品列表
        setIsShowPrizeList(isShowPrizeList: boolean) {
            this.globalConfig.isSHowPrizeList = isShowPrizeList;
        },
        // 重置所有配置
        reset() {
            this.globalConfig = {
                rowCount: 12,
                topTitle:'大明内阁六部御前奏对',
                isSHowPrizeList:true,
                theme: {
                    name: 'dark',
                    detail: { primary: '#0f5fd3' },
                    cardColor: 'rgba(0, 255, 255)',
                    luckyCardColor:'#ECB1AC',
                    cardWidth: 200,
                    cardHeight: 140,
                    textColor: '#ffffff',
                    textSize: 30,
                    patternColor: '#1b66c9',
                    patternList:defaultPatternList,

                },
                musicList: defaultMusicList as IMusic[],
                imageList:defaultImageList as IImage[],
            },
            this.currentMusic= {
                item:defaultMusicList[0] as IMusic,
                paused:true,
            }
        }
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
