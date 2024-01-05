import { defineStore } from 'pinia';
import { defaultMusicList } from './data'
// import { IPrizeConfig } from '@/types/prizeConfig';
export const useGlobalConfig = defineStore('global', {
    state() {
        return {
            globalConfig: {
                rowCount: 12,
                theme: {
                    name: 'dark',
                    detail: { primary: '#0f5fd3' },
                    cardColor: 'rgba(0, 255, 255)',
                    cardWidth: 140,
                    cardHeight: 200,
                    textColor: '#ffffff',
                    textSize: 30
                },
                musicList: defaultMusicList,
            }
        };
    },
    getters: {
        // 获取全部配置
        getGlobalConfig(state) {
            return state.globalConfig;
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
        // 获取音乐列表
        getMusicList(state) {
            return state.globalConfig.musicList;
        }

    },
    actions: {
        // 设置rowCount
        setRowCount(rowCount: number) {
            this.globalConfig.rowCount = rowCount;
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
        // 添加音乐
        addMusic(music: any) {
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
        // 重置音乐列表
        resetMusicList() {
            this.globalConfig.musicList = defaultMusicList;
        },
        // 清空音乐列表
        clearMusicList() {
            this.globalConfig.musicList = [];
        },
        // 重置所有配置
        reset() {
            this.globalConfig = {
                rowCount: 12,
                theme: {
                    name: 'dark',
                    detail: { primary: '#0f5fd3' },
                    cardColor: 'rgba(0, 255, 255)',
                    cardWidth: 200,
                    cardHeight: 140,
                    textColor: '#ffffff',
                    textSize: 30

                },
                musicList: defaultMusicList
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
            },
        ],
    },
})
