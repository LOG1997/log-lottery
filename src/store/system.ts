import { defineStore } from 'pinia'
// import { IPrizeConfig } from '@/types/storeType';
export const useSystem = defineStore('system', {
  state() {
    return {
      isMobile: false,
      isChrome: true,
    }
  },
  getters: {
    getIsMobile(state) {
      return state.isMobile
    },
    getIsChrome(state) {
      return state.isChrome
    },
  },
  actions: {
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },
    setIsChrome(isChrome: boolean) {
      this.isChrome = isChrome
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 如果要存储在localStorage中
        // storage: localStorage,
        // key: 'globalConfig',
        // paths: ['globalConfig'],
      },
    ],
  },
})
