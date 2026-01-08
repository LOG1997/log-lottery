import type { ServerType } from '@/types/storeType'
import { defineStore } from 'pinia'
import { defaultServerHostList } from './data'

export const useServerConfig = defineStore('server', {
    state() {
        return {
            serverConfig: {
                serverList: defaultServerHostList,
                currentServer: defaultServerHostList[0],
            },
        }
    },
    getters: {
        // 获取服务器列表
        getServerList(state) {
            return state.serverConfig.serverList
        },
        // 获取当前服务器
        getCurrentServer(state) {
            return state.serverConfig.currentServer
        },

    },
    actions: {
        // 设置服务器列表地址
        updateServerList(userServer: ServerType) {
            this.serverConfig.serverList.map((item) => {
                if (item.id === userServer.id) {
                    item.host = userServer.host
                }
                return item
            })
        },
        // 设置当前服务器
        setCurrentServer(userServer: ServerType) {
            this.serverConfig.currentServer = userServer
        },
        // 重置所有配置
        resetDefault() {
            this.serverConfig = {
                serverList: defaultServerHostList,
                currentServer: defaultServerHostList[0],
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                // 如果要存储在localStorage中
                storage: localStorage,
                key: 'serverConfig',
            },
        ],
    },
})
