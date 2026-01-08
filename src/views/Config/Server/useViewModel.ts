import type { ServerType } from '@/types/storeType'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useWebsocket } from '@/hooks/useWebsocket'
import useStore from '@/store'
import { getOriginUrl, getUniqueSignature } from '@/utils/auth'

export function useViewModel() {
    const serverConfig = useStore().serverConfig
    const { getServerList: serverList, getCurrentServer: currentServer } = storeToRefs(serverConfig)
    const currentServerValue = ref<ServerType>(cloneDeep(currentServer.value))
    const wsUrl = ref<string>('ws://localhost:8080/echo')
    const wsQuery = ref<{ userSignature: string }>({
        userSignature: '',
    })
    const { open: openWs, close: closeWs, send, status: wsStatus, data, wsRef } = useWebsocket(wsUrl, wsQuery, 5 * 1000)
    async function getFinger() {
        const userSignature = await getUniqueSignature()
        wsQuery.value.userSignature = userSignature
        return userSignature
    }
    watch(
        () => currentServerValue.value.id,
        (newValue) => {
            serverList.value.forEach((item) => {
                if (item.id === newValue) {
                    currentServerValue.value = item
                    serverConfig.setCurrentServer(currentServerValue.value)
                }
            })
        },
    )
    watch(() => currentServer.value.host, (newValue) => {
        currentServerValue.value.host = newValue
        serverConfig.updateServerList(currentServerValue.value)
    })
    watch(() => wsStatus.value, (newValue) => {
        console.log('status:', newValue)
    })
    onMounted(() => {
        getFinger()
    })
    return {
        serverList,
        currentServerValue,
        wsStatus,
        openWs,
        closeWs,
    }
}
