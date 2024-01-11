import { defineStore } from 'pinia';
// import { IPrizeConfig } from '@/types/storeType';
export const useSystem = defineStore('system', {
    state() {
        return {
            isMobile:false
        };
    },
    getters: {
        getIsMobile(state) {
            return state.isMobile;
        },
    },
    actions: {
        setIsMobile(isMobile: boolean) {
            this.isMobile = isMobile;
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
