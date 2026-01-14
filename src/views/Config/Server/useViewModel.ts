import type { ServerType, WsMsgData } from '@/types/storeType'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useWebsocket } from '@/hooks/useWebsocket'
import useStore from '@/store'
import { getUniqueSignature } from '@/utils/auth'
import { IndexDb } from '@/utils/dexie'

export function useViewModel() {
    const serverConfig = useStore().serverConfig
    const {
        getServerList: serverList,
        getCurrentServer: currentServer,
    } = storeToRefs(serverConfig)
    const currentServerValue = ref<ServerType>(cloneDeep(currentServer.value))
    const wsUrl = ref<string>('ws://localhost:8080/echo')
    const msgList = ref<WsMsgData[]>([])
    const { open: openWs, close: closeWs, status: wsStatus } = useWebsocket()
    const msgListDb = new IndexDb('msgList', ['msgList'], 1, ['createTime'])
    const handleConnectWs = async () => {
        const userSignature = await getUniqueSignature()
        wsUrl.value = `ws://localhost:8080/echo?userSignature=${userSignature}`
        openWs(wsUrl.value)
    }
    const getAllMsg = async () => {
        msgListDb.getDataSortedByDateTime('msgList', 'dateTime').then((data) => {
            msgList.value = data
        })
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

    watch(
        () => wsStatus.value,
        (newValue) => {
            if (newValue && (newValue.connected === true || newValue.connected === false)) {
                serverConfig.setServerStatus(newValue.connected)
            }
        },
    )

    onMounted(() => {
        getAllMsg()
    })
    return {
        serverList,
        currentServerValue,
        wsStatus,
        handleConnectWs,
        closeWs,
        msgList,
    }
}
