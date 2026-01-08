import type { Ref } from 'vue'
import type { WsMsgData } from '@/types/storeType'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch } from 'vue'

export function useWebsocket() {
    const wsUrl = ref('')
    const status = ref<WebSocket['readyState']>()
    const data = ref<WsMsgData>()
    async function registerSW() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js')
                console.log('Service Worker 注册成功:', registration)
            }
            catch (error) {
                console.error('Service Worker 注册失败:', error)
            }
        }
        else {
            console.log('浏览器不支持 Service Worker')
        }
    }
    function open(url: string, query: Record<string, string>) {

    }
    // 向 Service Worker 发送消息
    navigator.serviceWorker?.controller?.postMessage({
        type: 'PING',
    })
    function close() {

    }
    function send(message: string) {

    }
    function getStatus() {

    }

    return {
        open,
        close,
        send,
        status,
        data,
    }
}
