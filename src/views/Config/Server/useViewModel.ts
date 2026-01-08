import type { ServerType } from '@/types/storeType'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import useStore from '@/store'

export function useViewModel() {
    const serverConfig = useStore().serverConfig
    const { getServerList: serverList, getCurrentServer: currentServer } = storeToRefs(serverConfig)
    const currentServerValue = ref<ServerType>(cloneDeep(currentServer.value))

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
    return {
        serverList,
        currentServerValue,
    }
}
