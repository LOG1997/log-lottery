import { defineStore } from 'pinia';
import { IPrizeConfig } from '@/types/prizeConfig';
export const usePrizeConfig = defineStore('prize', {
  state() {
    return {
      prizeConfig:{
        prizeList:[] as IPrizeConfig[],
      }
    };  
  },
  getters: {
    // 获取全部配置
    getPrizeConfig(state) {
      return state.prizeConfig.prizeList;
    },
    // 根据id获取配置
    getPrizeConfigById(state) {
      return (id: number|string) => {
        return state.prizeConfig.prizeList.find(item => item.id === id);
      }
    },
   
  },
  actions: {
    // 设置奖项
    setPrizeConfig(prizeList:IPrizeConfig[]) {
      this.prizeConfig.prizeList = prizeList;
    },
    // 添加奖项
    addPrizeConfig(prizeConfigItem: IPrizeConfig) {
        this.prizeConfig.prizeList.push(prizeConfigItem);
    },
    // 删除奖项
    deletePrizeConfig(prizeConfigItemId: number|string) {
        this.prizeConfig.prizeList = this.prizeConfig.prizeList.filter(item => item.id!== prizeConfigItemId);
    },
    // 更新奖项数据
    updatePrizeConfig(prizeConfigItem: IPrizeConfig) {
        const index = this.prizeConfig.prizeList.findIndex(item => item.id === prizeConfigItem.id);
        this.prizeConfig.prizeList[index] = prizeConfigItem;
    },
    // 重置所有配置
    reset() {
        this.prizeConfig = {
            prizeList:[] as IPrizeConfig[],
        }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 如果要存储在localStorage中
        storage: localStorage,
        key: 'personConfig',
      },
    ],
  },
});
