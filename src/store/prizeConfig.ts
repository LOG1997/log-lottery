import { defineStore } from 'pinia';
import { IPrizeConfig } from '@/types/storeType';
import { defaultPrizeList } from './data';
export const usePrizeConfig = defineStore('prize', {
    state() {
        return {
            prizeConfig: {
                prizeList: defaultPrizeList,
                currentPrize: {
                    id: '001',
                    name: '一等奖',
                    sort: 1,
                    isAll: true,
                    count: 1,
                    isUsedCount:0,
                    picture: {
                        id: '0',
                        name: '一等奖',
                        url: 'https://24years.top/resource/image/image1.png'
                    },
                    desc: '一等奖',
                    isShow: true,
                    isUsed: false,
                    frequency: 1,
                } as IPrizeConfig,
                temporaryPrize:{
                    id: '',
                    name: '',
                    sort: 0,
                    isAll: false,
                    count: 1,
                    isUsedCount:0,
                    picture: {
                        id: '-1',
                        name: '',
                        url: ''
                    },
                    desc: '',
                    isShow: false,
                    isUsed: false,
                    frequency: 1,
                } as IPrizeConfig
            }
        };
    },
    getters: {
        // 获取全部配置
        getPrizeConfigAll(state) {
            return state.prizeConfig;
        },
        // 获取奖品列表
        getPrizeConfig(state) {
return state.prizeConfig.prizeList;
        },
        // 根据id获取配置
        getPrizeConfigById(state) {
            return (id: number | string) => {
                return state.prizeConfig.prizeList.find(item => item.id === id);
            }
        },
        // 获取当前奖项
        getCurrentPrize(state) {
            return state.prizeConfig.currentPrize;
        },
        // 获取临时的奖项
        getTemporaryPrize(state){
            return state.prizeConfig.temporaryPrize;
        },

    },
    actions: {
        // 设置奖项
        setPrizeConfig(prizeList: IPrizeConfig[]) {
            this.prizeConfig.prizeList = prizeList;
        },
        // 添加奖项
        addPrizeConfig(prizeConfigItem: IPrizeConfig) {
            this.prizeConfig.prizeList.push(prizeConfigItem);
        },
        // 删除奖项
        deletePrizeConfig(prizeConfigItemId: number | string) {
            this.prizeConfig.prizeList = this.prizeConfig.prizeList.filter(item => item.id !== prizeConfigItemId);
        },
        // 更新奖项数据
        updatePrizeConfig(prizeConfigItem: IPrizeConfig) {
            const prizeListLength=this.prizeConfig.prizeList.length;
            if(prizeConfigItem.isUsed&&prizeListLength){
                for(let i=0;i<prizeListLength;i++){
                    if(!this.prizeConfig.prizeList[i].isUsed){
                        this.setCurrentPrize(this.prizeConfig.prizeList[i]);
                        break;
                    }
                }
            }
            else{
                return
            }
            this.resetTemporaryPrize()
        },
        // 删除全部奖项
        deleteAllPrizeConfig() {
            this.prizeConfig.prizeList = [] as IPrizeConfig[];
        },
        // 设置当前奖项
        setCurrentPrize(prizeConfigItem: IPrizeConfig) {
            this.prizeConfig.currentPrize = prizeConfigItem
        },
        // 设置临时奖项
        setTemporaryPrize(prizeItem: IPrizeConfig) {
            if(prizeItem.isShow==false){
                for(let i=0;i<this.prizeConfig.prizeList.length;i++){
                    if(this.prizeConfig.prizeList[i].isUsed==false){
                        this.setCurrentPrize(this.prizeConfig.prizeList[i]);
                        
break
                    }
                }
                this.resetTemporaryPrize()
                
return
            }
            
            this.prizeConfig.temporaryPrize = prizeItem
        },
        // 重置临时奖项
        resetTemporaryPrize() {
            this.prizeConfig.temporaryPrize = {
                id: '',
                name: '',
                sort: 0,
                isAll: false,
                count: 1,
                isUsedCount:0,
                picture: {
                    id: '-1',
                    name: '',
                    url: ''
                },
                desc: '',
                isShow: false,
                isUsed: false,
                frequency: 1,
            } as IPrizeConfig;
        },
        // 重置所有配置
        resetDefault() {
            this.prizeConfig = {
                prizeList: defaultPrizeList,
                currentPrize: {
                    id: '001',
                    name: '一等奖',
                    sort: 1,
                    isAll: true,
                    count: 1,
                    isUsedCount:0,
                    picture: {
                        id: '0',
                        name: '一等奖',
                        url: 'https://24years.top/resource/image/image1.png'
                    },
                    desc: '一等奖',
                    isShow: true,
                    isUsed: false,
                    frequency: 1,
                } as IPrizeConfig,
                temporaryPrize:{} as IPrizeConfig
            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                // 如果要存储在localStorage中
                storage: localStorage,
                key: 'prizeConfig',
            },
        ],
    },
});
